import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { NotificationLog } from '../models/NotificationLog';
import { emailTemplates } from '../templates/emailTemplates';
import { logError, logInfo } from '../config/logger';

// Initialize Twilio client (optional - only if credentials are provided)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Initialize nodemailer transporter
const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return null;
};

class NotificationService {
  // ============= EMAIL METHODS =============

  /**
   * Send an email notification
   */
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    category: 'message' | 'schedule_change' | 'application_status' | 'system',
    userId: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      const emailTransporter = createEmailTransporter();

      if (!emailTransporter) {
        logError('Email transporter not configured', new Error('Missing email configuration'));
        await this.logNotification({
          userId,
          type: 'email',
          category,
          subject,
          content: htmlContent.substring(0, 500),
          recipient: to,
          status: 'failed',
          error: 'Email transporter not configured',
          metadata
        });
        return false;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent
      };

      await emailTransporter.sendMail(mailOptions);

      // Log successful notification
      await this.logNotification({
        userId,
        type: 'email',
        category,
        subject,
        content: htmlContent.substring(0, 500),
        recipient: to,
        status: 'sent',
        sentAt: new Date(),
        metadata
      });

      return true;
    } catch (error: any) {
      logError('Failed to send email', error as Error);

      // Log failed notification
      await this.logNotification({
        userId,
        type: 'email',
        category,
        subject,
        content: htmlContent.substring(0, 500),
        recipient: to,
        status: 'failed',
        error: error.message,
        metadata
      });

      return false;
    }
  }

  /**
   * Send notification for new message
   */
  async sendMessageNotification(message: any): Promise<boolean> {
    try {
      const htmlContent = emailTemplates.newMessage(message);

      const success = await this.sendEmail(
        message.recipient.email,
        `New message from ${message.sender.name}`,
        htmlContent,
        'message',
        message.recipient._id.toString(),
        {
          messageId: message._id.toString(),
          senderId: message.sender._id.toString()
        }
      );

      // Optionally send SMS if recipient has phone number
      if (message.recipient.phoneNumber && (message.recipient.role === 'caretaker' || message.recipient.role === 'family')) {
        await this.sendSMS(
          message.recipient.phoneNumber,
          `OpenHand Care: New message from ${message.sender.name}. Subject: ${message.subject}. Login to view: ${process.env.FRONTEND_URL}/dashboard`,
          'message',
          message.recipient._id.toString(),
          {
            messageId: message._id.toString()
          }
        );
      }

      return success;
    } catch (error) {
      logError('Failed to send message notification', error as Error);
      return false;
    }
  }

  /**
   * Send notification for schedule change
   */
  async sendScheduleChangeNotification(
    schedule: any,
    changeType: 'created' | 'updated' | 'deleted'
  ): Promise<boolean> {
    try {
      // Determine recipient based on schedule type
      const recipient = schedule.caretakerId || schedule.residentId;
      const userName = recipient.name;
      const userEmail = recipient.email;
      const userPhone = recipient.phoneNumber;

      const htmlContent = emailTemplates.scheduleChange(schedule, changeType, userName);

      const subject = changeType === 'created' ? 'New Schedule Created'
                    : changeType === 'updated' ? 'Schedule Updated'
                    : 'Schedule Deleted';

      const success = await this.sendEmail(
        userEmail,
        subject,
        htmlContent,
        'schedule_change',
        recipient._id.toString(),
        {
          scheduleId: schedule._id.toString(),
          changeType
        }
      );

      // Optionally send SMS
      if (userPhone && (recipient.role === 'caretaker' || recipient.role === 'family')) {
        const smsMessage = `OpenHand Care: Your schedule has been ${changeType}. Login to view details: ${process.env.FRONTEND_URL}/dashboard`;
        await this.sendSMS(
          userPhone,
          smsMessage,
          'schedule_change',
          recipient._id.toString(),
          {
            scheduleId: schedule._id.toString(),
            changeType
          }
        );
      }

      return success;
    } catch (error) {
      logError('Failed to send schedule change notification', error as Error);
      return false;
    }
  }

  /**
   * Send notification for application status update
   */
  async sendApplicationStatusNotification(
    application: any,
    userEmail: string,
    userName: string,
    userId: string
  ): Promise<boolean> {
    try {
      const htmlContent = emailTemplates.applicationStatusUpdate(
        userName,
        'Resident Application',
        application.status,
        application.adminNotes
      );

      const success = await this.sendEmail(
        userEmail,
        `Application Status: ${application.status.toUpperCase()}`,
        htmlContent,
        'application_status',
        userId,
        {
          applicationId: application._id.toString(),
          status: application.status
        }
      );

      return success;
    } catch (error) {
      logError('Failed to send application status notification', error as Error);
      return false;
    }
  }

  // ============= SMS METHODS =============

  /**
   * Send an SMS notification
   */
  async sendSMS(
    to: string,
    message: string,
    category: 'message' | 'schedule_change' | 'application_status' | 'system',
    userId: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
        logInfo('Twilio not configured - skipping SMS');
        return false;
      }

      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      // Log successful notification
      await this.logNotification({
        userId,
        type: 'sms',
        category,
        subject: 'SMS Notification',
        content: message,
        recipient: to,
        status: 'sent',
        sentAt: new Date(),
        metadata
      });

      return true;
    } catch (error: any) {
      logError('Failed to send SMS', error as Error);

      // Log failed notification
      await this.logNotification({
        userId,
        type: 'sms',
        category,
        subject: 'SMS Notification',
        content: message,
        recipient: to,
        status: 'failed',
        error: error.message,
        metadata
      });

      return false;
    }
  }

  // ============= HELPER METHODS =============

  /**
   * Log notification to database
   */
  private async logNotification(data: {
    userId: string;
    type: 'email' | 'sms';
    category: 'message' | 'schedule_change' | 'application_status' | 'system';
    subject: string;
    content: string;
    recipient: string;
    status: 'pending' | 'sent' | 'failed';
    error?: string;
    sentAt?: Date;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await NotificationLog.create(data);
    } catch (error) {
      logError('Failed to log notification', error as Error);
      // Don't throw - logging failure shouldn't break the main flow
    }
  }

  /**
   * Get failed notifications for retry
   */
  async getFailedNotifications(limit: number = 50): Promise<any[]> {
    try {
      const failedNotifications = await NotificationLog.find({
        status: 'failed'
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return failedNotifications;
    } catch (error) {
      logError('Failed to get failed notifications', error as Error);
      return [];
    }
  }

  /**
   * Retry failed notification
   */
  async retryNotification(notificationId: string): Promise<boolean> {
    try {
      const notification = await NotificationLog.findById(notificationId);

      if (!notification || notification.status !== 'failed') {
        return false;
      }

      if (notification.type === 'email') {
        return await this.sendEmail(
          notification.recipient,
          notification.subject,
          notification.content,
          notification.category,
          notification.userId.toString(),
          notification.metadata
        );
      } else if (notification.type === 'sms') {
        return await this.sendSMS(
          notification.recipient,
          notification.content,
          notification.category,
          notification.userId.toString(),
          notification.metadata
        );
      }

      return false;
    } catch (error) {
      logError('Failed to retry notification', error as Error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

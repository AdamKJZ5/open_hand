export const emailTemplates = {
  newMessage: (message: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b5cf6;">New Message from ${message.sender.name}</h2>
      <p>Hi ${message.recipient.name},</p>
      <p>You have received a new message on OpenHand Care:</p>

      <div style="background: #f9fafb; border-left: 4px solid #8b5cf6; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 8px 0; color: #333;">${message.subject}</h3>
        <p style="margin: 0; color: #666;">${message.content}</p>
      </div>

      <p>Click the button below to read and reply to this message:</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View Message</a>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">OpenHand Care - Compassionate Care for Your Loved Ones</p>
    </div>
  `,

  scheduleChange: (schedule: any, changeType: 'created' | 'updated' | 'deleted', userName: string) => {
    const title = changeType === 'created' ? 'Schedule Created'
                : changeType === 'updated' ? 'Schedule Updated'
                : 'Schedule Deleted';

    const message = changeType === 'created'
      ? 'A new schedule has been created for you'
      : changeType === 'updated'
      ? 'Your schedule has been updated'
      : 'Your schedule has been removed';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">${title}</h2>
        <p>Hi ${userName},</p>
        <p>${message}.</p>

        ${changeType !== 'deleted' ? `
          <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #666;"><strong>Effective From:</strong> ${new Date(schedule.effectiveFrom).toLocaleDateString()}</p>
            ${schedule.effectiveTo ? `<p style="margin: 0 0 8px 0; color: #666;"><strong>Effective To:</strong> ${new Date(schedule.effectiveTo).toLocaleDateString()}</p>` : ''}
            ${schedule.weeklyHours ? `<p style="margin: 0 0 8px 0; color: #666;"><strong>Weekly Hours:</strong> ${schedule.weeklyHours}</p>` : ''}
            ${schedule.notes ? `<p style="margin: 0; color: #666;"><strong>Notes:</strong> ${schedule.notes}</p>` : ''}
          </div>
        ` : ''}

        <p>Click the button below to view your full schedule:</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View Schedule</a>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">OpenHand Care - Compassionate Care for Your Loved Ones</p>
      </div>
    `;
  },

  applicationStatusUpdate: (applicantName: string, applicationTitle: string, status: string, adminNotes?: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b5cf6;">Application Status Update</h2>
      <p>Hi ${applicantName},</p>
      <p>Your application status has been updated:</p>

      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; color: #666;"><strong>Application:</strong> ${applicationTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="color: ${
          status === 'approved' ? '#10b981' :
          status === 'rejected' ? '#ef4444' :
          '#f59e0b'
        }; font-weight: bold;">${status.toUpperCase()}</span></p>
        ${adminNotes ? `<p style="margin: 0; color: #666;"><strong>Notes:</strong> ${adminNotes}</p>` : ''}
      </div>

      <p>Click the button below to view your application details:</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View Application</a>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">OpenHand Care - Compassionate Care for Your Loved Ones</p>
    </div>
  `
};

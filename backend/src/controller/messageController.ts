import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/Users';
import { notificationService } from '../services/notificationService';

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Protected
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const messages = await Message.find({
      $or: [
        { recipient: user.id, deletedByRecipient: false },
        { sender: user.id, deletedBySender: false }
      ]
    })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages',
      error: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Protected
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const count = await Message.countDocuments({
      recipient: user.id,
      read: false,
      deletedByRecipient: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// @desc    Get single message by ID
// @route   GET /api/messages/:id
// @access  Protected
export const getMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    // Check if user is sender or recipient
    const isSender = message.sender._id.toString() === user.id;
    const isRecipient = message.recipient._id.toString() === user.id;

    if (!isSender && !isRecipient) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this message'
      });
      return;
    }

    // Check if deleted for this user
    if (isSender && message.deletedBySender) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    if (isRecipient && message.deletedByRecipient) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve message',
      error: error.message
    });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Protected
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { recipientId, subject, content } = req.body;

    // Validate required fields
    if (!recipientId || !subject || !content) {
      res.status(400).json({
        success: false,
        message: 'Recipient, subject, and content are required'
      });
      return;
    }

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
      return;
    }

    // Create message
    const message = await Message.create({
      sender: user.id,
      recipient: recipientId,
      subject,
      content,
      read: false,
      deletedBySender: false,
      deletedByRecipient: false
    });

    // Populate sender and recipient details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    // Trigger notification service (non-blocking)
    notificationService.sendMessageNotification(populatedMessage).catch(error => {
      // Log error but don't fail the request
      console.error('Failed to send message notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Protected
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
      return;
    }

    // Check if deleted by recipient
    if (message.deletedByRecipient) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    // Update read status
    message.read = true;
    message.readAt = new Date();
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: populatedMessage
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

// @desc    Delete message (soft delete)
// @route   DELETE /api/messages/:id
// @access  Protected
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    // Check if user is sender or recipient
    const isSender = message.sender.toString() === user.id;
    const isRecipient = message.recipient.toString() === user.id;

    if (!isSender && !isRecipient) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
      return;
    }

    // Soft delete based on user role
    if (isSender) {
      if (message.deletedBySender) {
        res.status(404).json({
          success: false,
          message: 'Message already deleted'
        });
        return;
      }
      message.deletedBySender = true;
    }

    if (isRecipient) {
      if (message.deletedByRecipient) {
        res.status(404).json({
          success: false,
          message: 'Message already deleted'
        });
        return;
      }
      message.deletedByRecipient = true;
    }

    await message.save();

    // If both deleted, permanently remove from database
    if (message.deletedBySender && message.deletedByRecipient) {
      await message.deleteOne();
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

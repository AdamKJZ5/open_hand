import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { registerUser } from '../controller/authController';
import {
  getMessages,
  getUnreadCount,
  getMessageById,
  sendMessage,
  markAsRead,
  deleteMessage
} from '../controller/messageController';
import { protect } from '../middleware/authMiddleware';
import { registerValidation, sendMessageValidation, mongoIdValidation } from '../middleware/validation';
import { User } from '../models/Users';
import { Message } from '../models/Message';
import './setup';

// Create test app WITHOUT rate limiting
const app = express();
app.use(express.json());

// Auth routes without rate limiting
const authRouter = express.Router();
authRouter.post('/register', registerValidation, registerUser);
app.use('/api/auth', authRouter);

// Message routes without rate limiting
const messageRouter = express.Router();
messageRouter.get('/', protect, getMessages);
messageRouter.get('/unread-count', protect, getUnreadCount);
messageRouter.get('/:id', protect, mongoIdValidation, getMessageById);
messageRouter.post('/', protect, sendMessageValidation, sendMessage);
messageRouter.put('/:id/read', protect, markAsRead);
messageRouter.delete('/:id', protect, deleteMessage);
app.use('/api/messages', messageRouter);

describe('Message System Tests', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    // Create two test users
    const user1Response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'Password123!',
      });

    const user2Response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'Password123!',
      });

    user1Token = user1Response.body.token;
    user2Token = user2Response.body.token;
    user1Id = user1Response.body._id;
    user2Id = user2Response.body._id;
  });

  describe('POST /api/messages', () => {
    it('should send a message with valid data', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          recipientId: user2Id,
          subject: 'Test Subject',
          content: 'Test message content',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.subject).toBe('Test Subject');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          recipientId: user2Id,
          subject: 'Test Subject',
          content: 'Test message content',
        })
        .expect(401);

      expect(response.body.message).toContain('Not authorized');
    });

    it('should fail with invalid recipient ID', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          recipientId: 'invalid-id',
          subject: 'Test Subject',
          content: 'Test message content',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with content exceeding 2000 characters', async () => {
      const longContent = 'a'.repeat(2001);
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          recipientId: user2Id,
          subject: 'Test Subject',
          content: longContent,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/messages', () => {
    beforeEach(async () => {
      // Create some test messages
      await Message.create({
        sender: user1Id,
        recipient: user2Id,
        subject: 'Message 1',
        content: 'Content 1',
      });

      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        subject: 'Message 2',
        content: 'Content 2',
      });
    });

    it('should get user messages', async () => {
      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should populate sender and recipient details', async () => {
      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      const message = response.body.data[0];
      expect(message.sender).toHaveProperty('name');
      expect(message.recipient).toHaveProperty('name');
    });
  });

  describe('GET /api/messages/unread-count', () => {
    beforeEach(async () => {
      // Create unread messages
      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        subject: 'Unread Message 1',
        content: 'Content 1',
        read: false,
      });

      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        subject: 'Unread Message 2',
        content: 'Content 2',
        read: false,
      });

      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        subject: 'Read Message',
        content: 'Content',
        read: true,
      });
    });

    it('should return correct unread count', async () => {
      const response = await request(app)
        .get('/api/messages/unread-count')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
    });
  });

  describe('PUT /api/messages/:id/read', () => {
    let messageId: string;

    beforeEach(async () => {
      const message = await Message.create({
        sender: user2Id,
        recipient: user1Id,
        subject: 'Test Message',
        content: 'Test Content',
        read: false,
      });
      messageId = message._id.toString();
    });

    it('should mark message as read', async () => {
      const response = await request(app)
        .put(`/api/messages/${messageId}/read`)
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify message is marked as read
      const message = await Message.findById(messageId);
      expect(message!.read).toBe(true);
      expect(message!.readAt).toBeDefined();
    });

    it('should fail if user is not the recipient', async () => {
      const response = await request(app)
        .put(`/api/messages/${messageId}/read`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(403);

      expect(response.body.message.toLowerCase()).toContain('not authorized');
    });
  });

  describe('DELETE /api/messages/:id', () => {
    let messageId: string;

    beforeEach(async () => {
      const message = await Message.create({
        sender: user1Id,
        recipient: user2Id,
        subject: 'Test Message',
        content: 'Test Content',
      });
      messageId = message._id.toString();
    });

    it('should soft delete message for sender', async () => {
      const response = await request(app)
        .delete(`/api/messages/${messageId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify message is soft deleted for sender
      const message = await Message.findById(messageId);
      expect(message!.deletedBySender).toBe(true);
      expect(message!.deletedByRecipient).toBe(false);
    });

    it('should soft delete message for recipient', async () => {
      const response = await request(app)
        .delete(`/api/messages/${messageId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify message is soft deleted for recipient
      const message = await Message.findById(messageId);
      expect(message!.deletedByRecipient).toBe(true);
      expect(message!.deletedBySender).toBe(false);
    });
  });
});

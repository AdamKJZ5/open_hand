import request from 'supertest';
import express from 'express';
import { registerUser, loginUser } from '../controller/authController';
import { User } from '../models/Users';
import { registerValidation, loginValidation } from '../middleware/validation';
import './setup';

// Create test app WITHOUT rate limiting for tests
const app = express();
app.use(express.json());

// Mount routes directly without rate limiting
const router = express.Router();
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

app.use('/api/auth', router);

describe('Authentication Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('already exists');
    });

    it('should hash password before storing', async () => {
      const userData = {
        name: 'Test User',
        email: 'hash-test@example.com',
        password: 'Password123!',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ email: userData.email }).select('+password');
      expect(user).toBeDefined();
      expect(user!.password).not.toBe(userData.password);
      expect(user!.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'Password123!',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe('login@example.com');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token', () => {
    it('should include user ID and role in token payload', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Token Test User',
          email: 'token@example.com',
          password: 'Password123!',
        })
        .expect(201);

      const token = response.body.token;
      expect(token).toBeDefined();

      // Decode JWT (without verification, just to check payload)
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      expect(payload).toHaveProperty('id');
      expect(payload).toHaveProperty('role');
      expect(payload).toHaveProperty('exp');
    });
  });
});

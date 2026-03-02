# Testing Guide - OpenHand Care Platform

This document provides instructions for running and writing tests for the OpenHand Care Platform backend.

## Test Setup

### Prerequisites
- MongoDB running locally on port 27017
- Node.js and npm installed
- All dependencies installed (`npm install`)

### Test Database
Tests use a separate database (`openhand-test`) that is:
- Created automatically before tests run
- Cleaned between each test
- Dropped after all tests complete

### Environment Variables
Create a `.env.test` file with test-specific configuration (see `.env.test` template).

## Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode (Re-run on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

Coverage report will be generated in `/coverage` directory.

## Test Structure

```
backend/
└── src/
    └── __tests__/
        ├── setup.ts              # Test configuration and database setup
        ├── auth.test.ts          # Authentication tests
        ├── messages.test.ts      # Message system tests
        └── [other test files]
```

## Writing Tests

### Test File Naming
- Name test files with `.test.ts` extension
- Place in `src/__tests__/` directory
- Jest will automatically discover and run them

### Example Test Structure

```typescript
import request from 'supertest';
import express from 'express';
import yourRoutes from '../routes/yourRoutes';
import './setup';

const app = express();
app.use(express.json());
app.use('/api/your-endpoint', yourRoutes);

describe('Your Feature Tests', () => {
  beforeEach(async () => {
    // Setup before each test
  });

  it('should do something', async () => {
    const response = await request(app)
      .post('/api/your-endpoint')
      .send({ data: 'test' })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
  });
});
```

### Authentication in Tests

When testing protected routes:

```typescript
// Register a user and get token
const response = await request(app)
  .post('/api/auth/register')
  .send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  });

const token = response.body.token;

// Use token in subsequent requests
await request(app)
  .get('/api/protected-route')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
```

## Test Coverage

### Current Coverage

| Category | Coverage |
|----------|----------|
| Authentication | ✅ Comprehensive |
| Messages | ✅ Comprehensive |
| Schedules | ⏳ Pending |
| User Management | ⏳ Pending |
| Job Postings | ⏳ Pending |

### Coverage Goals
- **Minimum**: 70% code coverage
- **Target**: 85% code coverage
- **Critical Paths**: 100% coverage (auth, messages, schedules)

## Test Best Practices

### 1. Isolate Tests
Each test should be independent and not rely on other tests:
```typescript
beforeEach(async () => {
  // Create fresh test data for each test
});

afterEach(async () => {
  // Cleanup happens automatically via setup.ts
});
```

### 2. Use Descriptive Test Names
```typescript
// Good
it('should return 401 when user is not authenticated')

// Bad
it('test auth')
```

### 3. Test Both Success and Failure Cases
```typescript
describe('POST /api/endpoint', () => {
  it('should succeed with valid data', async () => { ... });
  it('should fail with invalid data', async () => { ... });
  it('should fail without authentication', async () => { ... });
});
```

### 4. Use Appropriate HTTP Status Codes
```typescript
.expect(200)  // Success
.expect(201)  // Created
.expect(400)  // Bad Request
.expect(401)  // Unauthorized
.expect(403)  // Forbidden
.expect(404)  // Not Found
.expect(500)  // Internal Server Error
```

### 5. Verify Database State
```typescript
// After creating a resource, verify it exists
const user = await User.findOne({ email: 'test@example.com' });
expect(user).toBeDefined();
expect(user.name).toBe('Test User');
```

## Common Testing Patterns

### Testing Validation
```typescript
it('should validate email format', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'invalid-email',
      password: 'Password123!',
    })
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.errors).toBeDefined();
});
```

### Testing Rate Limiting
```typescript
it('should rate limit after max requests', async () => {
  // Make max allowed requests
  for (let i = 0; i < 5; i++) {
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401);
  }

  // Next request should be rate limited
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'wrong' })
    .expect(429);

  expect(response.body.message).toContain('Too many');
});
```

### Testing Authorization
```typescript
it('should deny access without admin role', async () => {
  // Login as non-admin user
  const userToken = await loginAsUser();

  const response = await request(app)
    .delete('/api/admin/action')
    .set('Authorization', `Bearer ${userToken}`)
    .expect(403);

  expect(response.body.message).toContain('Not authorized as an admin');
});
```

## Debugging Tests

### Enable Verbose Output
```bash
npm test -- --verbose
```

### Run Single Test File
```bash
npm test -- auth.test.ts
```

### Run Single Test Case
```bash
npm test -- -t "should register a new user"
```

### View Database State
Add console.logs in your test:
```typescript
const user = await User.findOne({ email: 'test@example.com' });
console.log('User:', user);
```

## Continuous Integration

Tests are run automatically on:
- Every pull request
- Before merging to main branch
- Before deployment to production

### CI Requirements
- ✅ All tests must pass
- ✅ No linting errors
- ✅ Minimum 70% code coverage

## Common Issues

### Issue: Tests timeout
**Solution**: Increase Jest timeout in jest.config.js
```javascript
testTimeout: 10000  // 10 seconds
```

### Issue: Database connection errors
**Solution**: Ensure MongoDB is running
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Issue: Port already in use
**Solution**: Tests use port 5002. Kill any process using this port:
```bash
lsof -ti:5002 | xargs kill -9
```

### Issue: Tests affecting each other
**Solution**: Ensure `afterEach` cleanup is working
- Check `src/__tests__/setup.ts`
- Database should be cleared between tests

## Next Steps

### Additional Tests Needed
1. **Schedule Management**
   - Create caretaker schedule
   - Create resident schedule
   - Export calendar (.ics)
   - Update schedule
   - Delete schedule

2. **User Management**
   - Update user role (admin)
   - Toggle schedule status
   - Delete user
   - Prevent last admin deletion

3. **Job Postings & Applications**
   - Create job posting
   - Apply to job
   - Update application status
   - Delete job/application

4. **Input Validation**
   - Test all validation rules
   - Test edge cases (max lengths, special chars)

5. **Security**
   - Test rate limiting on all endpoints
   - Test CSRF protection
   - Test NoSQL injection prevention

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - Alternative for tests

---

**Last Updated:** 2026-01-26
**Test Framework:** Jest + Supertest
**Coverage Tool:** Jest Coverage

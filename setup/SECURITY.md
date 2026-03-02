# Security Best Practices - OpenHand Care Platform

This document outlines the security measures implemented in the OpenHand Care Platform backend and provides guidance for maintaining and enhancing security.

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation](#input-validation)
3. [Rate Limiting](#rate-limiting)
4. [Security Headers](#security-headers)
5. [Database Security](#database-security)
6. [Logging & Monitoring](#logging--monitoring)
7. [Environment Variables](#environment-variables)
8. [Production Checklist](#production-checklist)

---

## Authentication & Authorization

### JWT Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 30 days
- **Secret**: Must be at least 32 characters (enforced at startup)
- **Payload**: Contains user ID and role

**Implementation:**
```typescript
// Generate token
const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Verify token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Password Security
- **Hashing**: bcryptjs with salt rounds = 10
- **Minimum Length**: 8 characters
- **Complexity Requirements**:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**Password Storage:**
```typescript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### Role-Based Access Control (RBAC)
Four user roles:
1. **admin** - Full system access
2. **caretaker** - View own schedule, send/receive messages
3. **family** - View assigned resident's schedule, send/receive messages
4. **default** - Limited access (newly registered users)

**Middleware:**
```typescript
// Protect routes (authentication required)
router.get('/protected', protect, handler);

// Admin-only routes
router.post('/admin-action', protect, admin, handler);
```

---

## Input Validation

All user input is validated using `express-validator`. Validation rules are defined in `/src/middleware/validation.ts`.

### Validation Coverage
- ✅ Email format and normalization
- ✅ Password complexity
- ✅ MongoDB ObjectId format
- ✅ String length limits
- ✅ Enum values (role, job type, activity type)
- ✅ Time format (HH:MM)
- ✅ Date format (ISO 8601)
- ✅ Array min/max length

### Example Usage
```typescript
router.post('/register', registerValidation, registerUser);
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must be at least 8 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

## Rate Limiting

Rate limiting prevents brute force attacks and API abuse.

### Configured Limits

| Endpoint | Window | Max Requests | Notes |
|----------|--------|--------------|-------|
| General API | 15 min | 100 | All `/api/*` routes |
| Login | 15 min | 5 | Skips successful requests |
| Registration | 1 hour | 3 | Per IP address |
| Password Reset | 1 hour | 3 | Request & reset combined |
| Send Message | 1 min | 10 | Prevents spam |

**Implementation:**
```typescript
import { authLimiter, registrationLimiter } from '../config/security';

router.post('/login', authLimiter, loginUser);
router.post('/register', registrationLimiter, registerUser);
```

**Rate Limit Response:**
```json
{
  "message": "Too many login attempts from this IP, please try again after 15 minutes."
}
```

---

## Security Headers

Implemented using `helmet.js` middleware.

### Enabled Headers
- **Content-Security-Policy (CSP)**: Prevents XSS attacks
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Browser-level XSS protection
- **Strict-Transport-Security**: Enforces HTTPS
- **Cross-Origin-Resource-Policy**: Controls resource sharing

**CSP Configuration:**
```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    // ... more directives
  }
}
```

---

## Database Security

### MongoDB Best Practices
1. **Connection Pooling**: 10 max, 2 min connections
2. **Timeout Settings**: 5s server selection, 45s socket timeout
3. **Password Hashing**: Never store plaintext passwords
4. **Soft Deletes**: Messages use soft delete for audit trail

### NoSQL Injection Prevention
- **express-mongo-sanitize**: Removes `$` and `.` from user input
- **Mongoose Schemas**: Enforce data types

**Example:**
```typescript
// Input: { "email": { "$gt": "" } }
// Sanitized: { "email": { "_gt": "" } }
```

### HTTP Parameter Pollution (HPP)
Prevents duplicate parameters in query strings.

**Whitelisted Parameters:**
- `role`
- `status`
- `page`
- `limit`

---

## Logging & Monitoring

### Winston Logger
Structured logging to console and files.

**Log Levels:**
- `error`: Application errors
- `warn`: Warnings (weak JWT secret, CORS blocks)
- `info`: HTTP requests, server start/stop
- `http`: HTTP access logs
- `debug`: Detailed debugging info

**Log Files:**
- `/logs/error.log` - Errors only (max 5MB × 5 files)
- `/logs/combined.log` - All logs (max 5MB × 5 files)

**Usage:**
```typescript
import { logInfo, logError, logWarn } from '../config/logger';

logInfo('Server started', { port: 5001, environment: 'production' });
logError('Database connection failed', error, { host: 'localhost' });
logWarn('Weak JWT secret detected');
```

### Notification Logging
All email/SMS notifications are logged to `NotificationLog` model:
- Status: pending → sent/failed
- Retry capability
- Error tracking

---

## Environment Variables

### Critical Variables
Must be set in production:
- `MONGO_URI` - Database connection
- `JWT_SECRET` - Token signing (min 32 chars)
- `NODE_ENV` - Set to `production`

### Validation
Server validates required env vars at startup:
```typescript
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV'];
if (missingEnvVars.length > 0) {
  logError('Missing environment variables', new Error(missingEnvVars.join(', ')));
  process.exit(1);
}
```

### Gmail App Passwords
**NEVER use your actual Gmail password!**

Generate an app password:
1. Google Account → Security
2. 2-Step Verification (enable if not already)
3. App passwords → Generate
4. Use generated 16-character password in `EMAIL_PASSWORD`

---

## Production Checklist

### Pre-Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT_SECRET (32+ chars)
- [ ] Rotate all credentials (email, database, Twilio)
- [ ] Remove exposed credentials from git history
- [ ] Update `ALLOWED_ORIGINS` to production domains
- [ ] Set up HTTPS (recommend Let's Encrypt)
- [ ] Configure reverse proxy (nginx/Apache) with:
  - `trust proxy` setting in Express
  - SSL termination
  - Request size limits

### Database
- [ ] Enable MongoDB authentication
- [ ] Create dedicated database user (not admin)
- [ ] Restrict database user permissions
- [ ] Enable MongoDB audit logging
- [ ] Set up automated backups

### Monitoring
- [ ] Set up error alerting (e.g., Sentry)
- [ ] Monitor log files for errors
- [ ] Track failed login attempts
- [ ] Monitor rate limit hits
- [ ] Set up uptime monitoring (health check endpoint)

### Testing
- [ ] Run security audit: `npm audit`
- [ ] Test rate limiting with high traffic
- [ ] Verify input validation on all endpoints
- [ ] Test authentication bypass attempts
- [ ] Verify CORS policies
- [ ] Check for exposed secrets

### Ongoing Maintenance
- [ ] Review logs weekly
- [ ] Update dependencies monthly: `npm update`
- [ ] Security audit quarterly: `npm audit fix`
- [ ] Rotate secrets every 90 days
- [ ] Review and revoke old JWT tokens
- [ ] Test backup restoration procedures

---

## Incident Response

### Security Breach Protocol
1. **Isolate**: Take affected systems offline
2. **Assess**: Identify scope and compromised data
3. **Contain**: Revoke tokens, rotate credentials
4. **Notify**: Inform affected users (GDPR compliance)
5. **Recover**: Restore from clean backups
6. **Review**: Post-mortem and security improvements

### Password Reset Force
If credentials are compromised:
```javascript
// Invalidate all tokens by changing JWT_SECRET
// Users must re-authenticate
```

---

## Reporting Security Issues

**DO NOT create public GitHub issues for security vulnerabilities.**

Contact: security@openhandcare.com

Expected response time: 48 hours

---

## Compliance

### GDPR Considerations
- User consent for data collection
- Right to be forgotten (user deletion)
- Data minimization (only collect necessary info)
- Secure data storage
- Data breach notification procedures

### HIPAA Notes
**If handling protected health information (PHI):**
- Enable audit logging for all data access
- Implement data encryption at rest
- Set up Business Associate Agreements (BAAs)
- Use HIPAA-compliant email/SMS providers

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated:** 2026-01-26
**Version:** 1.0.0

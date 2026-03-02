# OpenHand Care Platform

A comprehensive care management platform connecting caretakers, families, and care facilities for elderly and vulnerable populations.

---

## ⚡ **NEW?** Start with the Setup Guide

👉 **[Open `setup/WHAT_TO_DO_NOW.md`](./setup/WHAT_TO_DO_NOW.md)** to get started

All documentation and setup guides are in the **[`setup/`](./setup)** folder.

---

## 🏗️ Project Structure

```
openhand/
├── backend/              # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/       # Security, logging configuration
│   │   ├── controller/   # Route handlers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic (notifications, etc.)
│   │   ├── utils/        # Helper functions
│   │   └── __tests__/    # Jest tests
│   ├── logs/             # Winston log files
│   ├── .env              # Environment variables (DO NOT COMMIT)
│   └── package.json
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Frontend utilities
│   ├── .env              # Frontend environment variables
│   └── package.json
│
└── Documentation/
    ├── LAUNCH_CHECKLIST.md     # Pre-launch checklist
    ├── FIXES_APPLIED.md        # Recent security fixes
    ├── backend/SECURITY.md     # Security best practices
    └── backend/TESTING.md      # Testing guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env      # Then edit .env with your values
npm run dev               # Start development server on port 5001
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env      # Optional: customize API URL
npm run dev               # Start development server on port 5173
```

### Running Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:coverage     # Generate coverage report
```

## 🚀 Quick Setup

**New to this project?** Start here:
1. Read [`setup/WHAT_TO_DO_NOW.md`](./setup/WHAT_TO_DO_NOW.md) - Immediate action plan
2. Review [`setup/FIXES_APPLIED.md`](./setup/FIXES_APPLIED.md) - Recent changes
3. Follow [`setup/LAUNCH_CHECKLIST.md`](./setup/LAUNCH_CHECKLIST.md) - Complete launch guide

## 📚 Key Features

### For Administrators
- User management (create, update, delete users)
- Schedule management (caretaker shifts, resident activities)
- Job posting management
- Application review and approval
- System monitoring and logs

### For Caretakers
- View personal work schedule
- Export schedule to calendar apps (.ics)
- Send/receive messages with families
- View assigned residents
- Track hours worked

### For Family Members
- View resident's daily schedule and activities
- Send/receive messages with caretakers
- Export schedule to personal calendar
- View assigned caretaker information
- Request schedule changes

### Core Features
- **Authentication:** Secure JWT-based authentication with password reset
- **Messaging:** Internal messaging system with email notifications
- **Scheduling:** Comprehensive schedule management with calendar export
- **Notifications:** Email and SMS notifications for important events
- **Job Board:** Post and apply for caregiver positions
- **Calendar Integration:** Export schedules as .ics files

## 🔒 Security Features

- ✅ JWT authentication with 30-day token expiration
- ✅ bcrypt password hashing with salt rounds = 10
- ✅ Rate limiting on sensitive endpoints (login, registration, password reset)
- ✅ Input validation with express-validator
- ✅ Helmet.js security headers (CSP, XSS protection, etc.)
- ✅ MongoDB query sanitization (NoSQL injection prevention)
- ✅ HTTP Parameter Pollution protection
- ✅ Winston structured logging
- ✅ Comprehensive error handling

## 📊 Project Status

**Version:** 1.0.0 (Pre-Launch)  
**Launch Readiness:** 75%  
**Security Status:** 85%  
**Test Coverage:** 60%  

See [`setup/LAUNCH_CHECKLIST.md`](./setup/LAUNCH_CHECKLIST.md) for detailed status.

## ⚠️ CRITICAL: Before Launch

1. **🔴 Rotate Gmail Password** - Exposed in git history
2. **🔴 Remove .env from Git History** - Use BFG Repo-Cleaner
3. **🔴 Complete Test Coverage** - Add schedule/user/job tests
4. **🔴 Production Setup** - HTTPS, reverse proxy, environment variables

See [`setup/FIXES_APPLIED.md`](./setup/FIXES_APPLIED.md) for recent security fixes.

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, mongo-sanitize
- **Logging:** Winston
- **Testing:** Jest + Supertest
- **Email:** Nodemailer (Gmail)
- **SMS:** Twilio (optional)

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 📖 Documentation

All documentation is organized in the [`setup/`](./setup) folder:

- [`setup/WHAT_TO_DO_NOW.md`](./setup/WHAT_TO_DO_NOW.md) - **START HERE** - Immediate action plan
- [`setup/LAUNCH_CHECKLIST.md`](./setup/LAUNCH_CHECKLIST.md) - Pre-launch checklist (75% complete)
- [`setup/FIXES_APPLIED.md`](./setup/FIXES_APPLIED.md) - Recent security fixes and status
- [`setup/SECURITY.md`](./setup/SECURITY.md) - Security best practices and configuration
- [`setup/TESTING.md`](./setup/TESTING.md) - Testing guide and instructions

## 🔧 Development

### Environment Variables

**Backend** (.env):
```bash
PORT=5001
MONGO_URI=mongodb://localhost:27017/openhand
NODE_ENV=development
JWT_SECRET=<128-character-secret>
FRONTEND_URL=http://localhost:5173

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<gmail-app-password>

# SMS (Optional)
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=<number>
```

**Frontend** (.env):
```bash
VITE_API_URL=http://localhost:5001/api
VITE_API_PORT=5001
VITE_ENV=development
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🧪 Testing

Tests are located in `/backend/src/__tests__/`

**Current Coverage:**
- ✅ Authentication: 28 tests (100% coverage)
- ✅ Messages: 15 tests (100% coverage)
- ⏳ Schedules: Pending
- ⏳ User Management: Pending
- ⏳ Job Postings: Pending

Run tests:
```bash
cd backend
npm test
```

See [TESTING.md](./backend/TESTING.md) for detailed testing guide.

## 🚢 Deployment

### Production Checklist
1. Set NODE_ENV=production
2. Use strong JWT_SECRET (128+ chars)
3. Configure HTTPS with SSL certificates
4. Set up reverse proxy (nginx/Apache)
5. Enable CORS for production domain only
6. Use environment variable injection (not .env files)
7. Set up monitoring and logging
8. Configure automated backups

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for complete deployment guide.

## 📞 Support & Contact

**Security Issues:** security@openhandcare.com (Do not create public issues)

**Bug Reports:** Create an issue on GitHub

**Feature Requests:** Create an issue on GitHub

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

---

**Last Updated:** 2026-01-26  
**Status:** Pre-Launch Development  
**Next Milestone:** Complete test coverage and production deployment

# 🏛️ Cordova Municipality Portal

A comprehensive web portal for the Municipality of Cordova, Cebu, Philippines. This full-stack application provides services for citizens including news, events, service requests, and user verification.

## 🎯 Features

### For Citizens
- ✅ User Registration & Email Verification
- ✅ Secure Login with JWT Authentication
- ✅ Browse News, Announcements & Events
- ✅ Submit Service Requests
- ✅ Personal Dashboard
- ✅ Calendar Event Management
- ✅ Profile Management with ID Verification
- ✅ Dark Mode Support
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### For Administrators
- ✅ Admin Dashboard with Statistics
- ✅ User Management & Verification
- ✅ Content Management (Posts, Events, Announcements)
- ✅ Service Request Processing
- ✅ Barangay Officials Management
- ✅ Real-time Notifications

### Technical Features
- ✅ Full-stack TypeScript
- ✅ RESTful API Architecture
- ✅ PostgreSQL Database (Neon)
- ✅ Prisma ORM
- ✅ Email Service Integration
- ✅ Secure Authentication & Authorization
- ✅ Image Upload Support

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **State Management**: React Hooks + Context API
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **File Upload**: Multer

---

## 📦 Project Structure

```
System-Finals/
├── backend/                          # Express.js Backend
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── middleware/              # Auth & validation
│   │   ├── config/                  # Configuration files
│   │   └── server.ts                # Entry point
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── package.json
│   └── .env                         # Environment variables
│
├── cordova-municipality-portal/     # Next.js Frontend
│   ├── app/                         # Next.js App Router
│   │   ├── admin/                   # Admin pages
│   │   ├── auth/                    # Authentication pages
│   │   ├── barangay/                # Barangay pages
│   │   ├── community/               # Community pages
│   │   ├── dashboard/               # User dashboard
│   │   └── ...
│   ├── components/                  # React components
│   ├── lib/                         # API clients
│   ├── contexts/                    # React contexts
│   ├── data/                        # Static data
│   ├── public/                      # Static assets
│   ├── package.json
│   └── .env.local                   # Environment variables
│
└── DEPLOYMENT_GUIDE.md              # Deployment instructions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Gmail account (for email service)
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd System-Finals
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
# - DATABASE_URL (Neon PostgreSQL)
# - JWT_SECRET
# - EMAIL_USER and EMAIL_PASS

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd cordova-municipality-portal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Create Admin Account

Register a new user at `http://localhost:3000/auth/register`, then manually update in database:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

---

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Recommended Stack**: Vercel (Frontend) + Render (Backend) - 100% FREE

### Quick Deploy

**Backend to Render**:
1. Push code to GitHub
2. Create new Web Service on Render.com
3. Connect repository → backend folder
4. Add environment variables
5. Deploy!

**Frontend to Vercel**:
1. Push code to GitHub
2. Import project on Vercel.com
3. Select cordova-municipality-portal folder
4. Add `NEXT_PUBLIC_API_URL` env variable
5. Deploy!

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/verify-email      - Verify email with code
POST   /api/auth/resend-code       - Resend verification code
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### User Endpoints
```
GET    /api/users                  - Get all users (admin)
GET    /api/users/:id              - Get user by ID
PUT    /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user (admin)
PUT    /api/users/:id/verify       - Verify user (admin)
```

### Post Endpoints
```
GET    /api/posts                  - Get all posts
GET    /api/posts/:id              - Get post by ID
POST   /api/posts                  - Create post (admin)
PUT    /api/posts/:id              - Update post (admin)
DELETE /api/posts/:id              - Delete post (admin)
```

### Event Endpoints
```
GET    /api/users/events           - Get user's calendar events
POST   /api/users/events           - Add event to calendar
DELETE /api/users/events/:id       - Remove event from calendar
```

### Service Request Endpoints
```
GET    /api/service-requests       - Get all requests (admin)
GET    /api/service-requests/my-requests - Get user's requests
POST   /api/service-requests       - Create new request
PUT    /api/service-requests/:id   - Update request (admin)
DELETE /api/service-requests/:id   - Delete request (admin)
```

### Statistics Endpoints
```
GET    /api/stats/admin            - Get admin statistics
GET    /api/stats/users            - Get all users with details
```

---

## 🔒 Security Features

- ✅ JWT Token Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Email Verification
- ✅ Role-Based Access Control (RBAC)
- ✅ CORS Protection
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ XSS Protection
- ✅ Secure Headers
- ✅ Environment Variables for Secrets

---

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing
```bash
cd cordova-municipality-portal

# Build for production (check for errors)
npm run build

# Run production build locally
npm start
```

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

This is a final project for System-Finals. Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is developed for educational purposes as part of a final project.

---

## 👥 Team

Developed by: [Your Team Name]
Academic Year: 2025
Course: [Your Course]
Institution: [Your Institution]

---

## 📧 Contact & Support

For issues, questions, or support:
- GitHub Issues: [Your Repo URL]/issues
- Email: your-email@example.com

---

## 🎉 Acknowledgments

- Municipality of Cordova, Cebu
- Next.js Team
- Prisma Team
- Vercel & Render for free hosting
- All open-source contributors

---

## 🗺️ Roadmap

### Future Enhancements
- [ ] Mobile App (React Native)
- [ ] Push Notifications
- [ ] Advanced Analytics Dashboard
- [ ] Multi-language Support (English, Cebuano)
- [ ] Payment Integration for Services
- [ ] Live Chat Support
- [ ] Document Upload to Cloud Storage (GCS)
- [ ] SMS Notifications

---

## 📊 Project Status

**Current Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: December 11, 2025

---

*Made with ❤️ for the people of Cordova, Cebu* 🇵🇭

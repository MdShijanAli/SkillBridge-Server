# 🎓 SkillBridge Server

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**A modern, full-stack tutoring platform backend connecting learners with expert tutors**

[Live API](https://skillbridge-server-s2ql.onrender.com) • [Client Demo](https://skill-bridge-client-by-shijan.netlify.app/) • [Report Bug](https://github.com/md-shijan-ali/skillbridge-server/issues)

</div>

---

## 📖 Overview

**SkillBridge** is a comprehensive learning management system backend built with modern technologies. It enables students to discover and book sessions with verified tutors, while providing tutors with tools to manage their profiles, availability, and sessions. The platform includes a robust admin dashboard for platform oversight.

## ✨ Key Features

### 🔐 Authentication & Authorization

- **Multi-provider authentication** using Better Auth
- Google OAuth integration
- Email/Password authentication with OTP verification
- Role-based access control (Admin, Tutor, Student)
- Session management with secure token handling
- Email verification system via Brevo API

### 👨‍🎓 Tutor Management

- Comprehensive tutor profile creation and management
- Skills and subject categorization
- Hourly rate configuration
- Experience and education details
- Multi-language support
- Video introduction uploads
- Verification system for tutors
- Featured tutor highlighting
- Rating and review aggregation

### 📅 Scheduling & Availability

- Flexible availability management for tutors
- Real-time booking system
- Multi-status booking workflow (Pending, Confirmed, Completed, Cancelled)
- Duration-based session scheduling
- Conflict prevention for double bookings
- Cancellation management with reason tracking

### 📚 Learning Features

- Subject and category organization
- Multiple teaching categories per tutor
- Session notes and feedback
- Student-tutor matching based on subjects
- Booking history tracking

### ⭐ Reviews & Ratings

- Post-session review system
- 5-star rating mechanism
- Public/private review toggles
- Automated tutor rating calculation
- Review moderation capabilities

### 📊 Dashboard & Analytics

- Comprehensive admin dashboard
- User management (ban/unban, activate/deactivate)
- Booking statistics and analytics
- Revenue tracking
- Platform usage metrics
- Featured content management

### 📧 Communication

- Automated email notifications via Brevo
- Booking confirmations
- Verification emails
- Password reset functionality
- Session reminders

## 🛠️ Tech Stack

### Core Technologies

- **Language:** TypeScript 5.9
- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.2
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 7.4

### Key Packages & Libraries

#### Authentication & Security

- `better-auth` (v1.4.18) - Modern authentication framework
- `@prisma/client` (v7.3.0) - Type-safe database client
- `cors` (v2.8.6) - Cross-origin resource sharing

#### Email & Communication

- `@getbrevo/brevo` (v4.0.1) - Email service integration
- `nodemailer` (v7.0.13) - Email sending utility
- `resend` (v6.9.2) - Alternative email service

#### Utilities

- `axios` (v1.13.5) - HTTP client
- `dotenv` (v17.2.3) - Environment configuration
- `pg` (v8.17.2) - PostgreSQL driver
- `tsx` (v4.21.0) - TypeScript execution

#### Development Tools

- `@types/express` - TypeScript definitions for Express
- `@types/node` - TypeScript definitions for Node.js
- `tsup` (v8.3.5) - Build tool for TypeScript
- `prisma` (v7.4.1) - Database toolkit

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud instance)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/md-shijan-ali/skillbridge-server.git
cd skillbridge-server
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Server
PORT=5050

# Authentication
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:5050

# Application URLs
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5050/api

# Email Configuration
APP_USER=your-email@example.com
BREVO_API_KEY=your_brevo_api_key

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# (Optional) Seed admin user
npm run seed:admin

# (Optional) Open Prisma Studio to view/edit data
npm run show:db
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5050`

## 📂 Project Structure

```
skillbridge-server/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── availability/     # Tutor availability management
│   │   ├── booking/          # Booking system
│   │   ├── categories/       # Subject categories
│   │   ├── dashboard/        # Admin dashboard
│   │   ├── reviews/          # Review & rating system
│   │   ├── subjects/         # Subject management
│   │   ├── tutor-profile/    # Tutor profile management
│   │   ├── tutors/           # Tutor-specific features
│   │   └── users/            # User management
│   ├── lib/                  # Core libraries
│   │   ├── auth.ts           # Better Auth configuration
│   │   └── prisma.ts         # Prisma client instance
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── betterAuthErrorHandler.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts       # 404 handler
│   ├── utils/                # Utility functions
│   │   └── formatResult.ts   # Response formatting
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Server entry point
│   └── index.ts              # Main entry point
├── prisma/
│   ├── schema/               # Modular Prisma schemas
│   │   ├── auth.prisma       # User & authentication models
│   │   ├── tutorProfiles.prisma
│   │   ├── bookings.prisma
│   │   ├── categories.prisma
│   │   ├── reviews.prisma
│   │   ├── availability.prisma
│   │   ├── enums.prisma
│   │   └── schema.prisma     # Main schema file
│   └── migrations/           # Database migrations
├── api/                      # Vercel deployment files
├── generated/                # Auto-generated Prisma client
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── vercel.json
```

## 🗄️ Database Schema

### Core Models

#### User

- Multi-role support (Admin, Tutor, Student)
- Profile information (name, email, phone, bio, location)
- User status management (active, banned, featured)
- Better Auth integration

#### TutorProfile

- Extended tutor information
- Hourly rate and experience tracking
- Education and specialization
- Multi-language and subject support
- Rating system (average rating, total reviews)
- Verification and featured status

#### Booking

- Student-tutor session management
- Scheduling (date, time, duration)
- Multi-status workflow
- Pricing and payment tracking
- Session notes and cancellation reasons

#### Category

- Subject categorization
- Featured category highlighting

#### Availability

- Tutor schedule management
- Day-wise availability
- Time slot configuration

#### Review

- Star rating (1-5)
- Written feedback
- Public/private visibility
- Linked to completed bookings

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/sign-up/email         # Email signup
POST   /api/auth/sign-in/email         # Email login
POST   /api/auth/sign-in/social        # OAuth login (Google)
POST   /api/auth/sign-out              # Logout
GET    /api/auth/session               # Get current session
POST   /api/auth/verify-email          # Verify email with OTP
```

### Users

```
GET    /api/users                      # Get all users (Admin)
GET    /api/users/:id                  # Get user by ID
PATCH  /api/users/:id                  # Update user profile
DELETE /api/users/:id                  # Delete user (Admin)
```

### Tutors

```
GET    /api/tutors                     # Get all tutors (with filters)
GET    /api/tutors/featured            # Get featured tutors
GET    /api/tutors/:id                 # Get tutor details
```

### Tutor Profiles

```
POST   /api/tutor-profiles             # Create tutor profile
GET    /api/tutor-profiles/:id         # Get profile
PATCH  /api/tutor-profiles/:id         # Update profile
DELETE /api/tutor-profiles/:id         # Delete profile
```

### Categories

```
GET    /api/categories                 # Get all categories
POST   /api/categories                 # Create category (Admin)
PATCH  /api/categories/:id             # Update category (Admin)
DELETE /api/categories/:id             # Delete category (Admin)
```

### Availability

```
GET    /api/availabilities/tutor/:id   # Get tutor availability
POST   /api/availabilities             # Create availability
PATCH  /api/availabilities/:id         # Update availability
DELETE /api/availabilities/:id         # Delete availability
```

### Bookings

```
GET    /api/bookings                   # Get all bookings
GET    /api/bookings/my-bookings       # Get user's bookings
POST   /api/bookings                   # Create new booking
PATCH  /api/bookings/:id               # Update booking status
DELETE /api/bookings/:id               # Cancel booking
```

### Reviews

```
GET    /api/reviews/tutor/:id          # Get tutor reviews
POST   /api/reviews                    # Create review
PATCH  /api/reviews/:id                # Update review
DELETE /api/reviews/:id                # Delete review
```

### Dashboard (Admin)

```
GET    /api/dashboard/stats            # Platform statistics
GET    /api/dashboard/users            # User management
GET    /api/dashboard/bookings         # Booking overview
GET    /api/dashboard/revenue          # Revenue analytics
```

### Subjects

```
GET    /api/subjects                   # Get all subjects
POST   /api/subjects                   # Create subject (Admin)
```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run migrate          # Run Prisma migrations
npm run generate         # Generate Prisma client
npm run show:db          # Open Prisma Studio

# Authentication
npm run generate:auth    # Generate Better Auth types

# Seeding
npm run seed:admin       # Create initial admin user

# Deployment
npm run build:vercel     # Build for Vercel deployment
```

## 🌐 Deployment

### Vercel Deployment

The project is configured for Vercel serverless deployment:

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
npm run build:vercel
vercel --prod
```

### Environment Variables

Ensure all environment variables are configured in your deployment platform:

- Database connection string (use connection pooling)
- Authentication secrets
- Email service API keys
- OAuth credentials
- Client and API URLs

### Database Setup

For production, use a managed PostgreSQL service:

- **Neon** (recommended, used in this project)
- **Supabase**
- **Railway**
- **AWS RDS**

## 🔒 Security Features

- ✅ Password hashing with Better Auth
- ✅ JWT token-based authentication
- ✅ Email verification
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention via Prisma
- ✅ Rate limiting ready
- ✅ Secure session management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Roadmap

### Current Issues

- [ ] Add rate limiting middleware
- [ ] Implement caching layer (Redis)
- [ ] Add comprehensive API documentation (Swagger)

### Future Enhancements

- [ ] Real-time chat between tutors and students
- [ ] Video conferencing integration
- [ ] Payment gateway integration
- [ ] Mobile app backend support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Automated session reminders

## 📄 License

This project is licensed under the **ISC License**.

## 👨‍💻 Author

**Md Shijan Ali**

- GitHub: [@md-shijan-ali](https://github.com/md-shijan-ali)
- Email: shijan135@gmail.com

## 🙏 Acknowledgments

- [Better Auth](https://better-auth.com/) for authentication framework
- [Prisma](https://www.prisma.io/) for database ORM
- [Neon](https://neon.tech/) for PostgreSQL hosting
- [Brevo](https://www.brevo.com/) for email services
- [Vercel](https://vercel.com/) for hosting

---

<div align="center">

**Made with ❤️ by Md Shijan Ali**

⭐ Star this repository if you find it helpful!

[🔝 Back to Top](#-skillbridge-server)

</div>

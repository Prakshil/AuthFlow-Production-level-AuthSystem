# 🔐 AuthFlow - Production-Grade Authentication System

<div align="center">

![AuthFlow Logo](https://img.shields.io/badge/AuthFlow-Production%20Ready-blue?style=for-the-badge&logo=shield&logoColor=white)

**Modern, Secure, and Scalable Authentication System Built with Next.js 14**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)


</div>

---

## ✨ Features

### 🔐 **Core Authentication**
- **JWT-based authentication** with HTTP-only cookies
- **Email verification** system with beautiful templates
- **Password reset** functionality with secure tokens
- **Route protection** middleware
- **Session management** with automatic token refresh

### 🎨 **Modern UI/UX**
- **Dark theme** with glass morphism effects
- **Responsive design** for all devices
- **Smooth animations** and transitions
- **Real-time notifications** with React Hot Toast
- **Auth0-inspired** component design

### 📧 **Email System**
- **Production-ready Gmail SMTP** integration
- **HTML email templates** with modern design
- **Environment-based configuration** (dev/prod)
- **Delivery tracking** and error handling

### 🛡️ **Security Features**
- **bcrypt password hashing** (10 rounds)
- **JWT token validation** and expiration
- **CORS protection**
- **Rate limiting** ready
- **SQL injection prevention**
- **XSS protection**

### 🚀 **Production Ready**
- **Environment-based configuration**
- **MongoDB Atlas** integration
- **Vercel deployment** optimized
- **Error handling** and logging
- **TypeScript** for type safety
- **ESLint** and **Prettier** configured

---

## 🏗️ Architecture

```
AuthFlow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/users/         # Authentication API routes
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── profile/           # User dashboard
│   │   ├── forgotpassword/    # Password reset
│   │   └── verifyemail/       # Email verification
│   ├── components/            # Reusable UI components
│   ├── utils/                 # Utility functions
│   │   ├── mailer.ts         # Email service
│   │   ├── environment.ts     # Environment config
│   │   └── getDataFromToken.ts # JWT utilities
│   ├── models/               # MongoDB schemas
│   ├── dbConfig/             # Database configuration
│   └── middleware.ts         # Route protection
├── public/                   # Static assets
├── .env                     # Environment variables
└── package.json            # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **MongoDB Atlas** account
- **Gmail** account with App Password

### 1. Clone Repository
```bash
git clone https://github.com/Prakshil/AuthFlow-Production-level-AuthSystem.git
cd AuthFlow-Production-level-AuthSystem
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env` file:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Security
TOKEN_SECRET=your-super-secure-jwt-secret-key

# Environment
NODE_ENV=development

# Domain Configuration
DOMAIN=http://localhost:3000
PRODUCTION_DOMAIN=https://your-app.vercel.app

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="AuthFlow <your-email@gmail.com>"
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔧 Configuration

### Gmail SMTP Setup
1. Enable **2-Factor Authentication** on your Gmail account
2. Generate an **App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `SMTP_PASS`

### MongoDB Atlas Setup
1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a database user
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get the connection string and add to `MONGODB_URI`

### JWT Configuration
Generate a strong secret key:
```bash
openssl rand -base64 64
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables** in Vercel Dashboard:
   - All variables from your `.env` file
   - Set `NODE_ENV=production`
   - Update `PRODUCTION_DOMAIN` with your Vercel URL

3. **Automatic Deployments**:
   - Push to `main` branch for automatic deployments
   - Preview deployments for pull requests

### Other Platforms

<details>
<summary><strong>Railway</strong></summary>

1. Connect GitHub repository to Railway
2. Add environment variables
3. Deploy automatically

</details>

<details>
<summary><strong>Netlify</strong></summary>

1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

</details>

---

## 📖 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/signup` | User registration |
| `POST` | `/api/users/login` | User login |
| `GET` | `/api/users/logout` | User logout |
| `GET` | `/api/users/me` | Get current user |
| `POST` | `/api/users/verification` | Email verification |
| `POST` | `/api/users/forgotpass` | Request password reset |
| `POST` | `/api/users/resetpassword` | Reset password |

### Request/Response Examples

<details>
<summary><strong>User Registration</strong></summary>

```javascript
// POST /api/users/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "message": "User registered successfully",
  "success": true
}
```

</details>

<details>
<summary><strong>User Login</strong></summary>

```javascript
// POST /api/users/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "message": "Login successful",
  "success": true
}
```

</details>

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── api/users/           # API routes
├── utils/
│   ├── mailer.ts           # Email utilities
│   ├── environment.ts       # Environment config
│   └── getDataFromToken.ts  # JWT helpers
├── models/
│   └── user.models.js      # User schema
└── dbConfig/
    └── dbConfig.ts         # Database connection
```

---

## 🔒 Security

### Implemented Security Measures

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure HTTP-only cookies
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for production
- **Environment Variables**: Sensitive data protection
- **Token Expiration**: Automatic session management

### Security Headers

```typescript
// next.config.ts
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with email verification
- [ ] User login and logout
- [ ] Password reset flow
- [ ] Protected route access
- [ ] Email delivery (both dev and prod)
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Test User Account
```
Email: test@example.com
Password: TestPassword123
```

---

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimizations
- Next.js 14 App Router
- Server-side rendering
- Image optimization
- Font optimization
- Bundle size optimization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test all authentication flows
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Vercel** for seamless deployment
- **MongoDB** for reliable database service
- **Tailwind CSS** for beautiful styling
- **React Hot Toast** for notifications

---

## 📞 Support

### Having Issues?

1. Check the [Issues](https://github.com/Prakshil/AuthFlow-Production-level-AuthSystem/issues) tab
2. Create a new issue with detailed description
3. Include error logs and environment details

### Connect with Developer

[![GitHub](https://img.shields.io/badge/GitHub-Prakshil-black?style=flat-square&logo=github)](https://github.com/Prakshil)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/prakshil)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Prakshil Patel](https://github.com/Prakshil)

</div>

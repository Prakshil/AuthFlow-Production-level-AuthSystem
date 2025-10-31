export const env = {
  // Environment detection
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Domain configuration
  get DOMAIN() {
    if (this.NODE_ENV === 'production') {
      return process.env.PRODUCTION_DOMAIN || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-production-domain.com';
    }
    return process.env.DOMAIN || 'http://localhost:3000';
  },
  
  // Database
  get MONGODB_URI() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    return uri;
  },
  
  // JWT
  get TOKEN_SECRET() {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error('TOKEN_SECRET environment variable is not set');
    }
    return secret;
  },
  
  // Email configuration
  get SMTP_HOST() {
    const host = process.env.SMTP_HOST;
    if (!host) {
      throw new Error('SMTP_HOST environment variable is not set');
    }
    return host;
  },
  
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  
  get SMTP_USER() {
    const user = process.env.SMTP_USER;
    if (!user) {
      throw new Error('SMTP_USER environment variable is not set');
    }
    return user;
  },
  
  get SMTP_PASS() {
    const pass = process.env.SMTP_PASS;
    if (!pass) {
      throw new Error('SMTP_PASS environment variable is not set');
    }
    return pass;
  },
  
  get EMAIL_FROM() {
    const from = process.env.EMAIL_FROM;
    if (!from) {
      throw new Error('EMAIL_FROM environment variable is not set');
    }
    return from;
  },
  
  // Mailtrap (for development)
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
  MAILTRAP_ENDPOINT: process.env.MAILTRAP_ENDPOINT,
  
  // Helper functions
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  
  // Get email configuration based on environment
  getEmailConfig() {
    return {
      host: this.SMTP_HOST,
      port: this.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.SMTP_USER,
        pass: this.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    };
  },
  
  // Get URLs for email templates
  getVerifyUrl(token: string) {
    return `${this.DOMAIN}/verifyemail?token=${token}`;
  },
  
  getResetUrl(token: string) {
    return `${this.DOMAIN}/resetpassword?token=${token}`;
  }
};
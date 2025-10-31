export const env = {
  // Environment detection
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Domain configuration
  get DOMAIN() {
    if (this.NODE_ENV === 'production') {
      return process.env.PRODUCTION_DOMAIN || 'https://your-production-domain.com';
    }
    return process.env.DOMAIN || 'http://localhost:3000';
  },
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI!,
  
  // JWT
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  
  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM!,
  
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
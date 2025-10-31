/**
 * Environment Configuration Utility
 * Handles different configurations for development and production
 */

export const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    // Environment info
    isProduction,
    isDevelopment,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Domain configuration
    domain: isProduction 
      ? process.env.DOMAIN_PROD || process.env.DOMAIN || 'https://your-app.vercel.app'
      : process.env.DOMAIN_DEV || process.env.DOMAIN || 'http://localhost:3000',

    // Database
    mongoUri: process.env.MONGODB_URI,

    // JWT
    jwtSecret: process.env.JWT_SECRET,

    // Email configuration (environment-based)
    email: {
      host: isProduction 
        ? process.env.SMTP_HOST 
        : (process.env.MAILTRAP_HOST || process.env.SMTP_HOST),
      port: isProduction 
        ? parseInt(process.env.SMTP_PORT || '587')
        : parseInt(process.env.MAILTRAP_PORT || '2525'),
      user: isProduction 
        ? process.env.SMTP_USER 
        : (process.env.MAILTRAP_USER || process.env.SMTP_USER),
      pass: isProduction 
        ? process.env.SMTP_PASS 
        : (process.env.MAILTRAP_PASS || process.env.SMTP_PASS),
      from: process.env.EMAIL_FROM || 'Auth System <noreply@authsystem.com>',
      secure: isProduction, // Use SSL/TLS in production
    }
  };
};

// Export individual configs for convenience
export const config = getEnvironmentConfig();

// Validation function
export const validateEnvironmentConfig = () => {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
};

export default config;
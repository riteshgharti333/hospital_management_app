import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || '15', 10),
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || '30', 10),
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USERNAME || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
};
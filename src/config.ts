import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongo: {
      dbName: process.env.MONGO_DATABASE,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      port: parseInt(process.env.MONGO_PORT, 10),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
    mail: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      secure: process.env.MAIL_SECURE,
    },
    security: {
      jwtSecret: process.env.JWT_SECRET,
      jwtExpires: process.env.JWT_EXPIRES,
    },
    api: {
      intelx: process.env.INTELX_API,
    },
  };
});

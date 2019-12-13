import 'dotenv/config';

export const config = {
  env: {
    type: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT),
    api_prefix: '/api/v1'
  },
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT)
  }, 
  email: {
    sender_email: process.env.SD_EMAIL,
    sender_psw: process.env.SD_PSW,
    service: process.env.E_SERVICE
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_TTL
  },
  school: {
    school_start: process.env.SCHOOL_START_UTC
  }
}

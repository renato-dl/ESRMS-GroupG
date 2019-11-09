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
  }
}

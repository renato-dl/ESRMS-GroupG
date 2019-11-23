import * as jwt from 'jsonwebtoken';
import { config } from '../config';

const signToken = (data) => {
  return jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
}

export {
  signToken,
  verifyToken
}

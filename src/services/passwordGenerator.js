//generate salt
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function genRandomString (length) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length);   /** return required number of characters */
}

export function createSecurePassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(clearPasswd, hash) {
  return bcrypt.compareSync(clearPasswd, hash);
}

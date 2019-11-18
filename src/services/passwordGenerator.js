//generate salt
import crypto from 'crypto';

export function genRandomString (length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
  }

  export function createSecurePassword(password){
    let hash = crypto.createHmac('sha256', genRandomString(16));
    hash.update(password);
    return hash.digest('hex');
  
  }

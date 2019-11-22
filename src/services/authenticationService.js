import {Strategy, ExtractJwt} from "passport-jwt";
import passport from 'passport';
import { config } from "../config";
import User from '../database/models/user';

export const AuthenticationService = () => {
  passport.use(new Strategy({
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (jwt_payload, done) => {
    const errorMessage = { message: 'User not found.' };

    if (!jwt_payload.id) {
      return done(null, false, errorMessage);
    }

    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      
      done(null, false, errorMessage);
    } catch(err) {
      done(null, false, errorMessage);
    }
  }));


  return {
    init: () => { return passport.initialize(); },
    authenticate: () => { return passport.authenticate('jwt', { session: false }); }
  }
}

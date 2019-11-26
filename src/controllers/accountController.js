import {BaseController} from "./baseController";
import User from "../database/models/user";
import { signToken } from "../services/tokenService";

class AccountController extends BaseController {
  
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      throw new Error('Invalid credentials.');
    }

    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    const token = signToken({id: user.ID});

    res.send({ token });
  }

}

export default new AccountController();

import {BaseController} from "./baseController";
import User from "../database/models/user";
import { signToken } from "../services/tokenService";
import { verifyPassword } from "../services/passwordGenerator";

class AccountController extends BaseController {
  
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      throw new Error('Invalid credentials.');
    }

    const user = await User.findOne({ email: req.body.email });
    const isCorrectPassword = verifyPassword(req.body.password, user.Password);

    if (!isCorrectPassword) {
      throw new Error('Invalid credentials.');
    }

    const roles = ['IsAdminOfficer', 'IsSysAdmin', 'IsParent', 'IsTeacher', 'IsPrincipal'];
    const thisUserRoles = {};

    roles.filter((role) => user[role]).forEach((role) => thisUserRoles[role] = true);
    const token = signToken({ id: user.ID });

    res.send({ token, roles: Object.keys(thisUserRoles) });
  }

}

export default new AccountController();

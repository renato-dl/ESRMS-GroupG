import {BaseController} from "./baseController";
import User from "../database/models/user";
import { signToken } from "../services/tokenService";
import { verifyPassword, hashPassword } from "../services/passwordGenerator";
import { validatePassword } from "../services/passwordValidator";

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

    if (user.IsNew) {
      thisUserRoles.IsNew = true;
    } else {
      roles.filter((role) => user[role]).forEach((role) => thisUserRoles[role] = true);
    }    
    const token = signToken({ id: user.ID });

    res.send({ token, roles: Object.keys(thisUserRoles) });
  }

  async changePassword(req, res) {
    if (!req.body.oldPass || !req.body.newPass) {
      throw new Error('Invalid credentials.');
    }
    const user = await User.findById(req.user.ID);
    const isCorrectPassword = verifyPassword(req.body.oldPass, user.Password);

    if (!isCorrectPassword) {
      throw new Error('Invalid credentials.');
    }

    const isValidPassword = validatePassword(req.body.newPass);

    if (!isValidPassword) {
      throw new Error('New password does not follow security criteria');
    }    

    const result = await User.update(req.user.ID, {
      IsNew: false,
      Password: hashPassword(req.body.newPass)
    });

    res.send({success: result});
  }

}

export default new AccountController();

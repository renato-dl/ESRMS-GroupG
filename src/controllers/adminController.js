import {BaseController} from "./baseController";
import Admin from "../database/models/admin";

class AdminController extends BaseController {

    async insertParentData(req, res) {
        const parent = await Admin.insertParentData(
          req.params.adminId,  
          req.body.firstName, 
          req.body.lastName, 
          req.body.eMail, 
          req.body.SSN, 
          req.body.password
        );
        res.send(parent); 
    }
}

export default new AdminController();
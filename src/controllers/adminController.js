import {BaseController} from "./baseController";
import Admin from "../database/models/admin";

class AdminController extends BaseController {

    async insertParentData(req, res) {
        const parent = await Admin.insertParentData(
          req.params.parentId, 
          req.body.ID, 
          req.body.FirstName, 
          req.body.LastName, 
          req.body.eMail, 
          req.body.SSN, 
          req.body.Password
          );
        res.send(parent);
    
    }
}

export default new AdminController();
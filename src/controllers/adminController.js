import {BaseController} from "./baseController";
import Admin from "../database/models/admin";

class AdminController extends BaseController {


  async getParentData(req, res){
    const parents = await Admin.getParentData();
    res.send(parents);
  }

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
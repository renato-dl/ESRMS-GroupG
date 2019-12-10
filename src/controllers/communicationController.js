import {BaseController} from "./baseController";
import CommunicationModel from "../database/models/communication";

class CommunicationController extends BaseController {
  
  async list(req, res) {
    const communications = await CommunicationModel.findAll();
    res.send({communications});
  }

  async add(req, res) {
    const communication = await CommunicationModel.add(req.body.title, req.body.description);
    res.send({communication});
  }

  async update(req, res) {
    const communication = await CommunicationModel.update(req.params.id, req.body.title, req.body.description);
    res.send({communication});
  }

  async remove(req, res) {
    await CommunicationModel.remove(req.params.id);
    res.send({success: true});
  }

}

export default new CommunicationController();

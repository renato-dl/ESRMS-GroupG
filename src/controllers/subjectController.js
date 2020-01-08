import {BaseController} from "./baseController";
import Subject from '../database/models/subject'

class SubjectController extends BaseController {

  async listAll(req, res) {
    const subjects = await Subject.findAll();
    res.send(subjects);
  }

}

export default new SubjectController();

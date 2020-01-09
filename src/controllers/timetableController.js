import {BaseController} from "./baseController";
import TimetableModel from "../database/models/timetable";

class TimetableController extends BaseController {
  
  async list(req, res) {
    const timetables = await TimetableModel.list();
    res.send({ timetables });
  }

  async add(req, res) {
    const timetableSuccess = await TimetableModel.add(req.body.classId, req.body.timetable);
    res.send({ success: timetableSuccess });
  }

  async remove(req, res) {
    await TimetableModel.remove(req.params.id);
    res.send({ success: true });
  }

}

export default new TimetableController();

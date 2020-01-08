import {BaseController} from "./baseController";
import TimetableModel from "../database/models/timetable";

class TimetableController extends BaseController {
  
  async list(req, res) {
    const timetables = await TimetableModel.findAll();
    res.send({ timetables });
  }

  async add(req, res) {
    const timetable = await TimetableModel.add(req.body);
    res.send({ timetable });
  }

  async remove(req, res) {
    await TimetableModel.remove(req.params.id);
    res.send({ success: true });
  }

}

export default new TimetableController();

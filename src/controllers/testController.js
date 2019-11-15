import {BaseController} from "./baseController";
import User from "../database/models/user";
import uuid from 'uuid';

class TestController extends BaseController {
  async list(req, res) {
    const users = await User.findAll();
    res.send(users);
  }

  async one(req, res) {
    const user = await User.findById(req.params.id);
    res.send(user);
  }

  async create(req, res) {
    const user = await User.create({
      id: uuid.v4(),
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password
    });
    
    res.send({user});
  }

  async remove(req, res) {
    await User.remove(req.params.id);
    res.send({ success: true });
  }
}

export default new TestController();

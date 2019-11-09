import { BaseController } from "./baseController";

class TestController extends BaseController {
  index(req, res) {
    res.send({test: 'test'});
  }
}

export default new TestController();

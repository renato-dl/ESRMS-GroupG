const BaseController = require("./baseController");

class TestController extends BaseController {
  index(req, res) {
    res.send({test: 'test'});
  }
}

module.exports = new TestController();

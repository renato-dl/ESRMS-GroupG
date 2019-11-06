class BaseController {

  processRequest(action, req, res) {
    // process all the request here
    if (!this[action]) {
      throw new Error(`Invalid controller method '${action}'.`);
    }

    // calls the method
    try {
      this[action](req, res);
    } catch(error) {
      res.status(422).json({
        errors: [{
          msg: error.message
        }]
      });
    }
  }

}

module.exports = BaseController;

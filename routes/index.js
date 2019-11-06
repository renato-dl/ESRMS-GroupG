const express = require('express');
const router = express.Router();
const TestController = require('../controllers/testController');

router.get('/test', TestController.processRequest.bind(TestController, 'index'));

module.exports = router;

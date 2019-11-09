import express from 'express';
import TestController from '../controllers/testController';

const router = express.Router();

router.get('/test', TestController.processRequest.bind(TestController, 'index'));

export default router;

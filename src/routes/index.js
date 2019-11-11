import express from 'express';
import TestController from '../controllers/testController';

const router = express.Router();

router.get('/users', TestController.processRequest.bind(TestController, 'list'));
router.post('/users', TestController.processRequest.bind(TestController, 'create'));
router.get('/users/:id', TestController.processRequest.bind(TestController, 'one'));
router.delete('/users/:id', TestController.processRequest.bind(TestController, 'remove'));

export default router;

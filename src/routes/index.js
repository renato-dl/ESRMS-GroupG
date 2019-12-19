import express from 'express';
//import TestController from '../controllers/testController';
import AccountController from '../controllers/accountController';
import { AuthenticationService } from '../services/authenticationService';

const authenticate = AuthenticationService().authenticate;

const router = express.Router();

router.post('/login', AccountController.processRequest.bind(AccountController, 'login'));
router.patch('/password', authenticate(), AccountController.processRequest.bind(AccountController, 'changePassword'));

/*
router.post('/users', TestController.processRequest.bind(TestController, 'create'));
router.get('/users/:id', TestController.processRequest.bind(TestController, 'one'));
router.delete('/users/:id', TestController.processRequest.bind(TestController, 'remove'));
*/

export default router;

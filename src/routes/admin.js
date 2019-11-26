import express from 'express';
import AdminController from '../controllers/adminController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.post('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'addStudent'));
router.get('/parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentData'));
router.get('/find-parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentsBySSN'));
export default router;
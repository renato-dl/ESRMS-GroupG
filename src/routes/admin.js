import express from 'express';
import AdminController from '../controllers/adminController';

const router = express.Router();

router.post('/parent', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'insertParentData'));
router.get('/parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentData'));
export default router;
import express from 'express';
import AdminController from '../controllers/adminController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.post('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'addStudent'));
router.patch('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateStudent'));
router.patch('/parent', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateParent'));
router.get('/parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentData'));
router.get('/students', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getStudentsData'));
router.get('/find-parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentsBySSN'));
router.get('/internal-accounts', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'getInternalAccountsData'));
router.post('/classes/:classID/assign-students', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'assignStudentsToClass'));

export default router;
import express from 'express';
import AdminController from '../controllers/adminController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.post('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'addStudent'));
router.patch('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateStudent'));
router.get('/students', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getStudentsData'));


router.patch('/parent', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateParent'));
router.patch('/students/:studentId/update-student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateAssignmentStudentsToClass'));
router.get('/parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentData'));
router.get('/find-parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentsBySSN'));

router.get('/internal-accounts', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'getInternalAccountsData'));
router.post('/internal-account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'insertInternalAccount'));
router.delete('/account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'deleteAccount'));
router.patch('/internal-account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'updateInternalAccount'));


router.get('/classes', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getClasses'));
router.post('/classes/:classID/assign-students', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'assignStudentsToClass'));


export default router;
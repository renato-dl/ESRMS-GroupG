import express from 'express';
import AdminController from '../controllers/adminController';
import { Authorization } from '../middlewares/authorization';

const admin = express.Router();

admin.post('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'addStudent'));
admin.patch('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateStudent'));
admin.get('/students', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getStudentsData'));
admin.delete('/student', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'removeStudent'));

admin.patch('/parent', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateParent'));
admin.patch('/students/:studentId/updateClassAssignment', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'updateAssignmentStudentsToClass'));
admin.delete('/students/:studentId/removeClassAssignment', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'removeAssignmentStudentsToClass'));
admin.get('/parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentData'));
admin.get('/find-parents', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getParentsBySSN'));

admin.get('/internal-accounts', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'getInternalAccountsData'));
admin.post('/internal-account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'insertInternalAccount'));
admin.delete('/account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'deleteAccount'));
admin.patch('/internal-account', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'updateInternalAccount'));


admin.get('/classes', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getClasses'));
admin.post('/classes/:classID/assign-students', Authorization(['IsSysAdmin']), AdminController.processRequest.bind(AdminController, 'assignStudentsToClass'));
admin.post('/class', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'createClass'));
admin.delete('/class', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'deleteClass'));

admin.get('/teachers', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getTeachers'));

admin.post('/teacher-class', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'createTeacherClassAssociation'));
admin.get('/teacher-class', Authorization(['IsAdminOfficer']), AdminController.processRequest.bind(AdminController, 'getAll'));

export default admin;
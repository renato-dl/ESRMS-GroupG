import express from 'express';
import ParentController from '../controllers/parentController';
import { Authorization } from '../middlewares/authorization';

const parent = express.Router();

parent.get('/students', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'studentsByParentId'));

parent.get('/grades', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'gradesByStudentId'));

parent.get('/subjects', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'subjectsByStudentId'));

parent.get('/assignments', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'assignmentsByStudentId'));
parent.get('/assignment/file', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getFile'));

parent.get('/attendance', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'attendanceByStudentId'));

parent.get('/notes', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getNotes'));
parent.get('/note', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getNote'));

parent.get('/support-material/file', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getFile'));
parent.get('/support-material/:studentId', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getSupportMaterial'));

export default parent;

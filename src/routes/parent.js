import express from 'express';
import ParentController from '../controllers/parentController';
import { Authorization } from '../middlewares/authorization';

const parent = express.Router();

parent.get('/students', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'studentsByParentId'));
parent.get('/grades', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'gradesByStudentId'));
parent.get('/subjects', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'subjectsByStudentId'));
parent.get('/assignments', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'assignmentsByStudentId'));
parent.get('/assignment/file', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getAssignmentFile'));
parent.get('/attendance', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'attendanceByStudentId'));
parent.get('/notes', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'getNotes'));

export default parent;

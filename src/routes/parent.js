import express from 'express';
import ParentController from '../controllers/parentController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.get('/students', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'studentsByParentId'));
router.get('/grades', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'gradesByStudentId'));
router.get('/assignments', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'assignmentsByStudentId'));
router.get('/attendance', Authorization(['IsParent']), ParentController.processRequest.bind(ParentController, 'attendanceByStudentId'));
export default router;

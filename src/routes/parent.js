import express from 'express';
import ParentController from '../controllers/parentController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.get('/:parentId/students', Authorization(['isAdmin', 'isParent']), ParentController.processRequest.bind(ParentController, 'studentsByParentId'));
router.get('/:parentId/grades', ParentController.processRequest.bind(ParentController, 'gradesByStudentId'));

export default router;

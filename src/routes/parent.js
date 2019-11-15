import express from 'express';
import ParentController from '../controllers/parentController';

const router = express.Router();

router.get('/:parentId/students', ParentController.processRequest.bind(ParentController, 'studentsByParentId'));
router.get('/:parentId/grades', ParentController.processRequest.bind(ParentController, 'gradesByStudentId'));

export default router;

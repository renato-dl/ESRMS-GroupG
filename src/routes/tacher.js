import express from 'express';
import TeacherController from '../controllers/teacherController';

const router = express.Router();

router.get('/:teacherId/subjects', TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));


export default router;
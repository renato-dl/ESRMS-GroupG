import express from 'express';
import TeacherController from '../controllers/teacherController';

const router = express.Router();

router.get('/:teacherId/subjects', TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));
router.post('/:teacherId/topic', TeacherController.processRequest.bind(TeacherController, 'addTopic'))


export default router;
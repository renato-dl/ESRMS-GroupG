import express from 'express';
import TeacherController from '../controllers/teacherController';

const router = express.Router();

router.get('/:teacherId/subjects', TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));
router.post('/:teacherId/topic', TeacherController.processRequest.bind(TeacherController, 'addTopic'));
router.delete('/:teacherId/topic', TeacherController.processRequest.bind(TeacherController, 'deleteTopic'));
router.patch('/:teacherId/topic', TeacherController.processRequest.bind(TeacherController, 'patchTopic'));
router.get('/:teacherId/topics', TeacherController.processRequest.bind(TeacherController, 'topicsByTeacherClassSubject'));

export default router;
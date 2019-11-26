import express from 'express';
import TeacherController from '../controllers/teacherController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.get('/subjects', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));
router.post('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addTopic'));
router.delete('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteTopic'));
router.patch('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'patchTopic'));
router.get('/topics', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'topicsByTeacherClassSubject'));

export default router;
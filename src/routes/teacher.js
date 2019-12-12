import express from 'express';
import TeacherController from '../controllers/teacherController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.get('/subjects',  Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));

router.post('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addTopic'));
router.delete('/topic',Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteTopic'));
router.patch('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'patchTopic'));
router.get('/topics', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'topicsByTeacherClassSubject'));

router.post('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addGrade'));
router.get('/grades', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'gradesByClassAndSubject'));
router.delete('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteGrade'));
router.patch('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'updateGrade'));

router.get('/students', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getStudents'));

router.get('/classes', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getClasses'));
router.post('/assignment', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addAssignment'));
router.delete('/assignment', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteAssignment'));
router.patch('/assignment', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'updateAssignment'));
router.get('/assignments', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'assignmentsByClassAndSubject'));

router.post('/absence', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerSingleAbsence'));
router.post('/absences', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerBulkAbsence'));
router.get('/attendance', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getAttendance'));
router.post('/late_entry', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerLateEntry'));

export default router;
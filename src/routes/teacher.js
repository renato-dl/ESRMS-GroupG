import express from 'express';
import TeacherController from '../controllers/teacherController';
import { Authorization } from '../middlewares/authorization';
import { UploadMiddleware } from '../middlewares/upload';

const teacher = express.Router();

teacher.get('/subjects',  Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'subjectsByTeacherId'));

teacher.post('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addTopic'));
teacher.delete('/topic',Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteTopic'));
teacher.patch('/topic', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'patchTopic'));
teacher.get('/topics', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'topicsByTeacherClassSubject'));

teacher.post('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addGrade'));
teacher.get('/grades', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'gradesByClassAndSubject'));
teacher.delete('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteGrade'));
teacher.patch('/grade', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'updateGrade'));

teacher.get('/students', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getStudents'));

teacher.get('/classes', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getClasses'));
teacher.post('/assignment', UploadMiddleware.multiple(10), Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addAssignment'));
teacher.delete('/assignment', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteAssignment'));
teacher.patch('/assignment', UploadMiddleware.multiple(10), Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'updateAssignment'));
teacher.get('/assignments', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'assignmentsByClassAndSubject'));
teacher.get('/assignment/file', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getAssignmentFile'));

teacher.post('/absence', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerSingleAbsence'));
teacher.post('/absences', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerBulkAbsence'));
teacher.get('/attendance', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getAttendance'));
teacher.post('/late_entry', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerLateEntry'));
teacher.post('/early_exit', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'registerEarlyExit'));

teacher.get('/notes', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getNotes'));
teacher.post('/note', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addNote'));
teacher.patch('/note', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'updateNote'));
teacher.delete('/note', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deleteNote'));

teacher.get('/support-material', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'getSupportMaterial'));
teacher.post('/support-material', UploadMiddleware.single, Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'addSupportMaterial'));
teacher.delete('/support-material', Authorization(['IsTeacher']), TeacherController.processRequest.bind(TeacherController, 'deletSupportMaterial'));


export default teacher;
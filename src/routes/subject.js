import express from 'express';
import SubjectController from '../controllers/subjectController';
import { Authorization } from '../middlewares/authorization';

const subject = express.Router();

subject.get('/all', Authorization(['IsAdminOfficer', 'IsParent', 'IsTeacher']), CommunicationController.processRequest.bind(SubjectController, 'listAll'));


export default communication;
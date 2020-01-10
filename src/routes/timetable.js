import express from 'express';
import TimetableController from '../controllers/timetableController';
import { Authorization } from '../middlewares/authorization';

const timetable = express.Router();

timetable.get('/', Authorization(['IsAdminOfficer']), TimetableController.processRequest.bind(TimetableController, 'list'));
timetable.post('/', Authorization(['IsAdminOfficer']), TimetableController.processRequest.bind(TimetableController, 'add'));
timetable.delete('/:id', Authorization(['IsAdminOfficer']), TimetableController.processRequest.bind(TimetableController, 'remove'));

export default timetable;
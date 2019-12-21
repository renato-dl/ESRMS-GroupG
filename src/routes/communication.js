import express from 'express';
import CommunicationController from '../controllers/communicationController';
import { Authorization } from '../middlewares/authorization';

const communication = express.Router();

communication.get('/', Authorization(['IsAdminOfficer', 'IsParent']), CommunicationController.processRequest.bind(CommunicationController, 'list'));
communication.post('/', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'add'));
communication.patch('/:id', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'update'));
communication.delete('/:id', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'remove'));

export default communication;
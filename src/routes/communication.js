import express from 'express';
import CommunicationController from '../controllers/communicationController';
import { Authorization } from '../middlewares/authorization';

const router = express.Router();

router.get('/', Authorization(['IsAdminOfficer', 'IsParent']), CommunicationController.processRequest.bind(CommunicationController, 'list'));
router.post('/', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'add'));
router.patch('/:id', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'update'));
router.delete('/:id', Authorization(['IsAdminOfficer']), CommunicationController.processRequest.bind(CommunicationController, 'remove'));

export default router;
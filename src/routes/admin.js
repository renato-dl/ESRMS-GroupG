import express from 'express';
import AdminController from '../controllers/AdminController';

const router = express.Router();

router.post('/:adminId/parent', AdminController.processRequest.bind(AdminController, 'insertParentData'));

export default router;
import express from 'express';
import AdminController from '../controllers/adminController';

const router = express.Router();

router.post('/:adminId/parent', AdminController.processRequest.bind(AdminController, 'insertParentData'));

export default router;
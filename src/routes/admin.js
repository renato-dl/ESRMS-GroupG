import express from 'express';
import AdminController from '../controllers/adminController';

const router = express.Router();

router.post('/:adminId/parent', AdminController.processRequest.bind(AdminController, 'insertParentData'));
router.get('/parents', AdminController.processRequest.bind(AdminController, 'getParentData'));
export default router;
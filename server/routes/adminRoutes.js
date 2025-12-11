import express from 'express';
import {
    getUsers,
    deleteUser,
    getPets,
    deletePet,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/pets').get(getPets);
router.route('/pets/:id').delete(deletePet);

export default router;

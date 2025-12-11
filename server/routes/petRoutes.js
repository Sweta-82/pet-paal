import express from 'express';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getPets)
    .post(protect, authorize('shelter'), upload.array('images'), createPet);

router.route('/:id')
    .get(getPetById)
    .put(protect, authorize('shelter'), upload.array('images'), updatePet)
    .delete(protect, authorize('shelter'), deletePet);

export default router;

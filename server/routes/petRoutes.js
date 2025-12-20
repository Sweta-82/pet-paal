import express from 'express';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    getShelterPets,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/my-pets', protect, authorize('shelter'), getShelterPets);

router.route('/')
    .get(getPets)
    .post(protect, authorize('shelter'), upload.array('images'), createPet);

router.route('/:id')
    .get(getPetById)
    .put(protect, authorize('shelter'), upload.array('images'), updatePet)
    .delete(protect, authorize('shelter'), deletePet);

export default router;

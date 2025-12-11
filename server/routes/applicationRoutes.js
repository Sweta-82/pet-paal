import express from 'express';
import {
    createApplication,
    getMyApplications,
    getShelterApplications,
    updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('adopter'), createApplication);

router.route('/my')
    .get(protect, authorize('adopter'), getMyApplications);

router.route('/shelter')
    .get(protect, authorize('shelter'), getShelterApplications);

router.route('/:id/status')
    .put(protect, authorize('shelter'), updateApplicationStatus);

export default router;

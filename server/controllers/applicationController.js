import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Pet from '../models/Pet.js';
import Notification from '../models/Notification.js';

// @desc    Create new application
// @route   POST /api/applications
// @access  Private/Adopter
const createApplication = asyncHandler(async (req, res) => {
    const { petId, message } = req.body;

    const pet = await Pet.findById(petId).populate('shelter');

    if (!pet) {
        res.status(404);
        throw new Error('Pet not found');
    }

    const applicationExists = await Application.findOne({
        pet: petId,
        adopter: req.user._id,
    });

    if (applicationExists) {
        res.status(400);
        throw new Error('You have already applied for this pet');
    }

    const application = await Application.create({
        adopter: req.user._id,
        pet: petId,
        shelter: pet.shelter._id,
        message,
    });

    // Notify Shelter
    await Notification.create({
        recipient: pet.shelter._id,
        type: 'new_application',
        message: `New adoption application for ${pet.name} from ${req.user.name}`,
        relatedId: application._id,
    });

    res.status(201).json(application);
});

// @desc    Get user applications
// @route   GET /api/applications/my
// @access  Private/Adopter
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ adopter: req.user._id })
        .populate('pet', 'name images')
        .populate('shelter', 'name');
    res.json(applications);
});

// @desc    Get shelter applications
// @route   GET /api/applications/shelter
// @access  Private/Shelter
const getShelterApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ shelter: req.user._id })
        .populate('pet', 'name')
        .populate('adopter', 'name email');
    res.json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Shelter
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('pet');

    if (application) {
        if (application.shelter.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        application.status = status;
        const updatedApplication = await application.save();

        // Notify Adopter
        await Notification.create({
            recipient: application.adopter,
            type: 'application_status',
            message: `Your application for ${application.pet.name} has been ${status}`,
            relatedId: application._id,
        });

        res.json(updatedApplication);
    } else {
        res.status(404);
        throw new Error('Application not found');
    }
});

export {
    createApplication,
    getMyApplications,
    getShelterApplications,
    updateApplicationStatus,
};

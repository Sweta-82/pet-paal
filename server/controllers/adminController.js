import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all pets (admin view)
// @route   GET /api/admin/pets
// @access  Private/Admin
const getPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find({}).populate('shelter', 'name email');
    res.json(pets);
});

// @desc    Delete pet
// @route   DELETE /api/admin/pets/:id
// @access  Private/Admin
const deletePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
        await pet.deleteOne();
        res.json({ message: 'Pet removed' });
    } else {
        res.status(404);
        throw new Error('Pet not found');
    }
});

export {
    getUsers,
    deleteUser,
    getPets,
    deletePet,
};

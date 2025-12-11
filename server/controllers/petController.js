import asyncHandler from 'express-async-handler';
import Pet from '../models/Pet.js';

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const age = req.query.age ? { age: req.query.age } : {};
    const breed = req.query.breed ? { breed: { $regex: req.query.breed, $options: 'i' } } : {};
    const location = req.query.location ? { location: { $regex: req.query.location, $options: 'i' } } : {};

    const count = await Pet.countDocuments({ ...keyword, ...category, ...age, ...breed, ...location, status: 'Available' });
    const pets = await Pet.find({ ...keyword, ...category, ...age, ...breed, ...location, status: 'Available' })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ pets, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single pet
// @route   GET /api/pets/:id
// @access  Public
const getPetById = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id).populate('shelter', 'name email location phone');

    if (pet) {
        res.json(pet);
    } else {
        res.status(404);
        throw new Error('Pet not found');
    }
});

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Shelter
const createPet = asyncHandler(async (req, res) => {
    console.log('createPet controller reached');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const { name, age, breed, category, gender, size, description, location } = req.body;

    let images = [];
    if (req.files) {
        images = req.files.map((file) => file.path);
    } else {
        // Fallback if no image uploaded, or handle as error if required
        // For now, let's keep the placeholder if no file, but usually we want at least one
        images = ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'];
    }

    const pet = new Pet({
        name,
        age,
        breed,
        category,
        gender,
        size,
        description,
        location,
        images,
        shelter: req.user._id,
    });

    const createdPet = await pet.save();
    res.status(201).json(createdPet);
});

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Shelter
const updatePet = asyncHandler(async (req, res) => {
    const { name, age, breed, category, gender, size, description, status, location } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (pet) {
        if (pet.shelter.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this pet');
        }

        pet.name = name || pet.name;
        pet.age = age || pet.age;
        pet.breed = breed || pet.breed;
        pet.category = category || pet.category;
        pet.gender = gender || pet.gender;
        pet.size = size || pet.size;
        pet.description = description || pet.description;
        pet.location = location || pet.location;
        pet.status = status || pet.status;

        if (req.files && req.files.length > 0) {
            pet.images = req.files.map((file) => file.path);
        }

        const updatedPet = await pet.save();
        res.json(updatedPet);
    } else {
        res.status(404);
        throw new Error('Pet not found');
    }
});

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Shelter
const deletePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
        if (pet.shelter.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this pet');
        }

        await pet.deleteOne();
        res.json({ message: 'Pet removed' });
    } else {
        res.status(404);
        throw new Error('Pet not found');
    }
});

export {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
};

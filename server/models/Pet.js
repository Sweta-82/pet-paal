import mongoose from 'mongoose';

const petSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        breed: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true,
        },
        size: {
            type: String,
            enum: ['Small', 'Medium', 'Large'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        status: {
            type: String,
            enum: ['Available', 'Adopted', 'Pending'],
            default: 'Available',
        },
        shelter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Pet = mongoose.model('Pet', petSchema);

export default Pet;

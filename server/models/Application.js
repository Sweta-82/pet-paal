import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
    {
        adopter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Pet',
        },
        shelter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;

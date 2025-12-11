import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['application_status', 'new_application', 'system', 'new_message'],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedId: {
            type: String, // Can be ObjectId (Application/Pet) or String (Chat ID)
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

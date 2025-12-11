import mongoose from 'mongoose';

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            type: String,
            default: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        },
        tags: [String],
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

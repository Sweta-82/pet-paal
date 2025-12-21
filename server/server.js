import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

import Message from './models/Message.js';
import Notification from './models/Notification.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const app = express();
const server = http.createServer(app);

// Check Cloudinary Config
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('ERROR: Cloudinary credentials missing in .env file!');
} else {
    console.log('Cloudinary credentials found.');
}

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://api.razorpay.com", "https://cdn.razorpay.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com", "https://api.razorpay.com", "https://cdn.razorpay.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            fontSrc: ["'self'", "data:", "https:", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https:", "http:", "https://api.razorpay.com", "https://lumberjack.razorpay.com", "https://*.razorpay.com"],
            frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com", "https://*.razorpay.com"],
            childSrc: ["https://api.razorpay.com", "https://checkout.razorpay.com"],
        },
    },
    crossOriginOpenerPolicy: false,
}));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// app.get("/",(req, res) => {
//      res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
// });
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/blogs', blogRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
// Error Handling

app.use(errorHandler);


// Socket.io
io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join_chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    socket.on('new_message', async (newMessageReceived) => {
        const { sender, receiver, content, chatId, pet } = newMessageReceived;

        if (!receiver) return console.log('Receiver not defined');

        // Save message to DB
        try {
            const message = await Message.create({
                sender: sender._id,
                receiver: receiver._id,
                pet: pet ? pet._id : null,
                content,
                chatId,
            });

            // Emit to receiver
            socket.in(receiver._id).emit('message_received', message);

            console.log('Creating notification for receiver:', receiver._id);
            // Create Notification for the receiver
            const notification = await Notification.create({
                recipient: receiver._id,
                type: 'new_message',
                message: `New message from ${sender.name}: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
                relatedId: chatId,
            });
            console.log('Notification created:', notification);
            socket.in(receiver._id).emit('notification_received', notification);

        } catch (error) {
            console.error('Error saving message or notification:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
});



// ... existing code ...

const PORT = process.env.PORT || 5000;

// Serve static files in production
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}


server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

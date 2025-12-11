import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    console.log('createOrder: Received amount:', amount);

    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log('createOrder: Order created successfully:', order);
        res.json(order);
    } catch (error) {
        console.error('createOrder: Error creating order:', error);
        res.status(error.statusCode || 500);
        throw new Error(error.error ? error.error.description : error.message);
    }
});

// @desc    Verify Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log('verifyPayment: Received data:', req.body);

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    console.log('verifyPayment: Generated signature:', expectedSignature);
    console.log('verifyPayment: Received signature:', razorpay_signature);

    if (expectedSignature === razorpay_signature) {
        console.log('verifyPayment: Signature verification successful');
        res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
        console.error('verifyPayment: Signature verification failed. Expected:', expectedSignature, 'Received:', razorpay_signature);
        res.status(400);
        throw new Error('Invalid signature');
    }
});



export {
    createOrder,
    verifyPayment,
};

import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DonationPage = () => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    console.log('handlePayment: Starting payment flow...');
    const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      console.error('handlePayment: Razorpay SDK failed to load');
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // Artificial delay for UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1. Create Order
      console.log('handlePayment: Creating order...');
      const { data: order } = await axios.post(
        '/api/payment/create-order',
        { amount },
        { withCredentials: true }
      );
      console.log('handlePayment: Order created:', order);

      // 2. Initialize Options
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log('handlePayment: Using Razorpay Key:', razorpayKey);

      if (!razorpayKey || razorpayKey === 'PASTE_YOUR_KEY_HERE_FROM_SERVER_ENV') {
        console.error('handlePayment: Invalid Razorpay Key');
        alert('Razorpay Key not found or is invalid. Please check your client .env file.');
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Pet-Paal',
        description: 'Donation for Pet Care',
        image: 'https://example.com/logo.png', // Optional
        order_id: order.id,
        handler: async function (response) {
          console.log('handlePayment: Payment successful, verifying signature...', response);
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post(
              '/api/payment/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            console.log('handlePayment: Verification response:', verifyRes.data);
            if (verifyRes.data.status === 'success') {
              alert('Payment Successful! Thank you for your donation.');
            }
          } catch (error) {
            console.error('Verification Error:', error);
            alert('Payment verification failed: ' + (error.response?.data?.message || error.message));
          }
        },
        prefill: {
          name: userInfo ? userInfo.name : 'Guest',
          email: userInfo ? userInfo.email : 'guest@example.com',
          contact: userInfo ? userInfo.phone : '9999999999',
        },
        notes: {
          address: 'Pet-Paal Corporate Office',
        },
        theme: {
          color: '#B19CD9', // Pastel Purple
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('handlePayment: Payment failed event:', response.error);
        alert('Payment Failed: ' + response.error.description);
      });
      paymentObject.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment Failed: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-500">
      <div className="max-w-lg w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60 overflow-hidden p-10 transform transition-all">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Support Our Mission</h1>
          <p className="text-gray-600 text-lg">Your donation helps us find loving homes for pets in need.</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Select Amount (INR)</label>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 px-2 border-2 rounded-2xl text-sm font-bold transition-all duration-300 ${amount === val ? 'bg-pastel-purple text-white border-pastel-purple shadow-lg scale-105' : 'bg-white/50 text-gray-600 border-pastel-pink/30 hover:border-pastel-pink hover:bg-white'}`}
              >
                ₹{val}
              </button>
            ))}
          </div>
          <div className="relative rounded-2xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-pastel-purple text-xl font-bold">₹</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="focus:ring-2 focus:ring-pastel-purple focus:border-transparent block w-full pl-10 pr-12 text-xl font-medium border-pastel-pink/30 rounded-2xl py-3 border bg-white/50 outline-none text-gray-800 placeholder-gray-400 transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-pastel-purple to-pastel-pink hover:from-pastel-pink hover:to-pastel-purple transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
        >
          {loading ? 'Processing...' : `Donate ₹${amount}`}
        </button>
      </div>
    </div>
  );
};

export default DonationPage;

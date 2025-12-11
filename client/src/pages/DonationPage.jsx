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
          color: '#2E8B57', // Forest Green
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
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Our Mission</h1>
          <p className="mt-2 text-gray-600">Your donation helps us find loving homes for pets in need.</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (INR)</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 px-4 border rounded-md text-sm font-medium ${amount === val ? 'bg-forest-green text-white border-forest-green' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                ₹{val}
              </button>
            ))}
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="focus:ring-forest-green focus:border-forest-green block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-forest-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 transition-colors`}
        >
          {loading ? 'Processing...' : `Donate ₹${amount}`}
        </button>
      </div>
    </div>
  );
};

export default DonationPage;

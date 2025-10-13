import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRazorpay } from '../hooks/useRazorpay';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { openRazorpay } = useRazorpay();

  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate form
    if (!shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      alert('Please fill all required fields');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare cart items
      const cartItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      // Create order
      const { data } = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          amount: totalAmount,
          cartItems,
          shippingAddress: shippingInfo
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Order created:', data.data);

      // Razorpay options
      const options = {
        key: RAZORPAY_KEY,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Bihar Ka Swaad',
        description: 'Order Payment',
        order_id: data.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await axios.post(
              `${API_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.data.dbOrderId
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            console.log('Payment verified:', verifyRes.data);

            // Clear cart and redirect
            dispatch(clearCart());
            alert('✅ Payment Successful!');
            navigate(`/order-success/${data.data.dbOrderId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('❌ Payment verification failed');
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: user?.email || '',
          contact: shippingInfo.phone
        },
        notes: {
          address: shippingInfo.address
        },
        theme: {
          color: '#ea580c' // Orange color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            alert('Payment cancelled');
          }
        }
      };

      // Open Razorpay
      openRazorpay(options);
      setLoading(false);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingInfo.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 pb-4 border-b">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

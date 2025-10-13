import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/payment/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase</p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-green-600">₹{order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-semibold text-xs">{order.paymentInfo.razorpayPaymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600 capitalize">{order.orderStatus}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

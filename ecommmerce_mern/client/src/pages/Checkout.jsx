import React from 'react';
import { useSelector } from 'react-redux';
import CheckoutForm from '../components/payment/CheckoutForm';

const Checkout = () => {
  const { totalAmount } = useSelector((s) => s.cart);

  const handleSuccess = (paymentIntent) => {
    // TODO: dispatch order creation with backend, passing payment info
    alert(`Payment successful: ${paymentIntent?.id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <CheckoutForm totalAmount={totalAmount} onSuccess={handleSuccess} />
    </div>
  );
};

export default Checkout;

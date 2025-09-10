import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, isLoading, error } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const changeQty = (id, q) => {
    if (q < 1) return;
    dispatch(updateQuantity({ productId: id, quantity: q }));
  };

  const remove = (id) => dispatch(removeFromCart({ productId: id }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/products" className="text-blue-600">Shop now</Link></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map(i => (
              <div key={i.product?._id || i.product} className="flex items-center gap-4 border rounded p-3 bg-white">
                <img src={i.product?.images?.} alt={i.product?.name} className="h-16 w-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{i.product?.name}</p>
                  <p className="text-gray-600">${i.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="px-2 border rounded" onClick={() => changeQty(i.product?._id || i.product, i.quantity - 1)}>-</button>
                    <span>{i.quantity}</span>
                    <button className="px-2 border rounded" onClick={() => changeQty(i.product?._id || i.product, i.quantity + 1)}>+</button>
                    <button className="ml-4 text-red-600" onClick={() => remove(i.product?._id || i.product)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border rounded p-4 bg-white">
            <p className="text-lg font-semibold">Subtotal: ${totalAmount.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

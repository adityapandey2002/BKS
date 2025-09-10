import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrent } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, isLoading, error } = useSelector((s) => s.products);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleAdd = () => {
    if (!current?._id) return;
    dispatch(addToCart({ productId: current._id, quantity: qty }));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!current) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={current.images?.} alt={current.name} className="w-full rounded" />
      <div>
        <h1 className="text-2xl font-semibold">{current.name}</h1>
        <p className="mt-2 text-gray-600">{current.description}</p>
        <p className="mt-3 text-blue-600 font-semibold text-xl">${current.price}</p>
        <div className="mt-4 flex items-center gap-3">
          <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24" />
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

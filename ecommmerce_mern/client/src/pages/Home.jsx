import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Featured Products</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {list.map(p => (
          <Link key={p._id} to={`/products/${p._id}`} className="border rounded p-4 bg-white hover:shadow">
            <img src={p.images?.} alt={p.name} className="h-40 w-full object-cover rounded" />
            <h3 className="mt-3 font-medium">{p.name}</h3>
            <p className="text-blue-600 font-semibold mt-1">${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

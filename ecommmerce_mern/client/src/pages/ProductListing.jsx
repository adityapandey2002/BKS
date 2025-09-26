import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';

const ProductListing = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((s) => s.products);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ q }));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..."
          className="border rounded px-3 py-2 flex-1" />
        <button className="bg-blue-600 text-white px-4 rounded">Search</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {list.map(p => (
          <Link key={p._id} to={`/products/${p._id}`} className="border rounded p-4 bg-white hover:shadow">
            {/* <img src={p.images?.} alt={p.name} className="h-40 w-full object-cover rounded" /> */}
            {p.images && (
              <img
                src={p.images}
                alt={p.name}
                className="h-40 w-full object-cover rounded"
              />
            )}

            <h3 className="mt-3 font-medium">{p.name}</h3>
            <p className="text-blue-600 font-semibold mt-1">${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;

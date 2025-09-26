import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const API = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}`;
  const { token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: '', images: [''] });
  const [products, setProducts] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const { data } = await axios.get(`${API}/products`);
    setProducts(data.data || data);
  };

  const create = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/products`, form, { headers });
    setForm({ name: '', description: '', price: 0, category: '', images: [''] });
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/products/${id}`, { headers });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <form onSubmit={create} className="bg-white p-4 rounded border mb-6 grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea className="border rounded px-3 py-2" placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Category" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input className="border rounded px-3 py-2" type="number" placeholder="Price" value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
        </div>
        <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.images || ''}
          onChange={(e) => setForm({ ...form, images: [e.target.value] })} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Product</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map(p => (
          <div key={p._id} className="border rounded p-3 bg-white">
            {/* <img src={p.images?.} alt={p.name} className="h-32 w-full object-cover rounded" /> */}
            {p.images && (
              <img
                src={p.images}
                alt={p.name}
                className="h-40 w-full object-cover rounded"
              />
            )}

            <h3 className="mt-2 font-medium">{p.name}</h3>
            <p className="text-blue-600 font-semibold">${p.price}</p>
            <button onClick={() => remove(p._id)} className="mt-2 text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

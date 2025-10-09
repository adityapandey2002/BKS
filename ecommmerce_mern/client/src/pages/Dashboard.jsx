import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from '../components/admin/AddProduct';
import ManageSiteAssets from '../components/admin/ManageSiteAssets';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'site-assets'

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Product deleted');
      fetchProducts();
    } catch (error) {
      alert('❌ Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-4 px-1 font-semibold transition ${activeTab === 'products'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Products Management
            </button>
            <button
              onClick={() => setActiveTab('site-assets')}
              className={`pb-4 px-1 font-semibold transition ${activeTab === 'site-assets'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Logo & Slideshow
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' ? (
          <>
            {/* Add Product Component */}
            <AddProduct onProductAdded={fetchProducts} />

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>

              {loading ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-500">No products yet. Add your first product above!</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <p className="text-green-600 font-bold mb-2">₹{product.price}</p>
                      <p className="text-gray-500 text-sm mb-4">Stock: {product.stock}</p>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Site Assets Management */
          <ManageSiteAssets />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

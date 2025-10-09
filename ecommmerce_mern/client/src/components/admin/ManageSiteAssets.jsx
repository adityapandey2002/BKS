import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSiteAssets = () => {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [slidePreview, setSlidePreview] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [slideFile, setSlideFile] = useState(null);
  const [slideData, setSlideData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    order: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchAssets = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/site-assets`);
      setAssets(data.data);
      if (data.data.logoUrl) {
        setLogoPreview(data.data.logoUrl);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Only JPG/JPEG images allowed!');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      alert('Please select a logo image');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('logo', logoFile);

      await axios.post(`${API_URL}/site-assets/logo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Logo updated successfully!');
      setLogoFile(null);
      fetchAssets();
    } catch (error) {
      alert('❌ Failed to upload logo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlideImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Only JPG/JPEG images allowed!');
      return;
    }

    setSlideFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSlidePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddSlideshow = async () => {
    if (!slideFile) {
      alert('Please select a slideshow image');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', slideFile);
      formData.append('title', slideData.title);
      formData.append('subtitle', slideData.subtitle);
      formData.append('buttonText', slideData.buttonText);
      formData.append('buttonLink', slideData.buttonLink);
      formData.append('order', slideData.order);

      await axios.post(`${API_URL}/site-assets/slideshow`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Slideshow added successfully!');
      setSlideFile(null);
      setSlidePreview(null);
      setSlideData({
        title: '',
        subtitle: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        order: 0
      });
      fetchAssets();
    } catch (error) {
      alert('❌ Failed to add slideshow');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (!window.confirm('Delete this slideshow image?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/site-assets/slideshow/${slideId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Slideshow deleted');
      fetchAssets();
    } catch (error) {
      alert('❌ Failed to delete slideshow');
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Website Logo
        </h2>

        <div className="space-y-4">
          <input
            id="logo-input"
            type="file"
            accept=".jpg,.jpeg"
            onChange={handleLogoChange}
            className="hidden"
          />

          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Logo"
                className="h-32 object-contain border-2 border-gray-200 rounded-lg p-2"
              />
              <label
                htmlFor="logo-input"
                className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-blue-700"
              >
                Change
              </label>
            </div>
          ) : (
            <label
              htmlFor="logo-input"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Click to upload logo (JPG only)</p>
            </label>
          )}

          {logoFile && (
            <button
              onClick={handleUploadLogo}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Logo'}
            </button>
          )}
        </div>
      </div>

      {/* Slideshow Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Homepage Slideshow
        </h2>

        {/* Add New Slide Form */}
        <div className="space-y-4 mb-8 border-b pb-6">
          <h3 className="font-semibold text-lg">Add New Slide</h3>

          <input
            type="text"
            placeholder="Slide Title *"
            value={slideData.title}
            onChange={(e) => setSlideData({ ...slideData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Subtitle (optional)"
            value={slideData.subtitle}
            onChange={(e) => setSlideData({ ...slideData, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Button Text"
              value={slideData.buttonText}
              onChange={(e) => setSlideData({ ...slideData, buttonText: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Button Link"
              value={slideData.buttonLink}
              onChange={(e) => setSlideData({ ...slideData, buttonLink: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <input
            id="slide-input"
            type="file"
            accept=".jpg,.jpeg"
            onChange={handleSlideImageChange}
            className="hidden"
          />

          {slidePreview ? (
            <div className="relative">
              <img
                src={slidePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <label
                htmlFor="slide-input"
                className="absolute bottom-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 shadow-lg"
              >
                Change Image
              </label>
            </div>
          ) : (
            <label
              htmlFor="slide-input"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Click to upload slideshow image (JPG only)</p>
            </label>
          )}

          <button
            onClick={handleAddSlideshow}
            disabled={loading || !slideFile || !slideData.title}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Slideshow'}
          </button>
        </div>

        {/* Existing Slides */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Current Slideshow Images ({assets?.slideshow?.length || 0})</h3>

          {assets?.slideshow && assets.slideshow.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {assets.slideshow.map((slide) => (
                <div key={slide._id} className="border rounded-lg overflow-hidden">
                  {slide.imageUrl && (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold">{slide.title}</h4>
                    {slide.subtitle && <p className="text-sm text-gray-600">{slide.subtitle}</p>}
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Order: {slide.order}</span>
                      <button
                        onClick={() => handleDeleteSlide(slide._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slideshow images yet. Add your first slide above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSiteAssets;

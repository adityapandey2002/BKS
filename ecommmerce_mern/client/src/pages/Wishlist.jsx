import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';

const Wishlist = () => {
  // const dispatch = useDispatch();
  // const { wishlist } = useSelector((state) => state.wishlist || { wishlist: [] });

  // Mock wishlist data for demonstration
  const mockWishlistItems = [
    {
      id: 1,
      name: 'Traditional Litti Chokha Mix',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      category: 'Traditional Food'
    },
    {
      id: 2,
      name: 'Bihari Thekua (Sweet)',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      inStock: true,
      category: 'Sweets'
    },
    {
      id: 3,
      name: 'Sattu Powder (Roasted Gram Flour)',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 67,
      inStock: false,
      category: 'Flour & Grains'
    },
    {
      id: 4,
      name: 'Bihari Pickle Mix',
      price: 179,
      originalPrice: 229,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      inStock: true,
      category: 'Pickles & Condiments'
    }
  ];

  const handleRemoveFromWishlist = (itemId) => {
    // Dispatch action to remove from wishlist
    console.log('Remove from wishlist:', itemId);
  };

  const handleAddToCart = (item) => {
    // Dispatch action to add to cart
    console.log('Add to cart:', item);
  };

  const handleMoveToCart = (item) => {
    handleAddToCart(item);
    handleRemoveFromWishlist(item.id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
        <p className="text-xl text-gray-600">Save items you love for later</p>
      </div>

      {mockWishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding items you love to your wishlist</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Wishlist Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {mockWishlistItems.length} {mockWishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                </h2>
                <p className="text-gray-600">Save items you love and add them to cart when ready</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                  Share Wishlist
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition duration-200 ${item.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.inStock}
                      className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${item.inStock
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Wishlist Actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to order?</h3>
                <p className="text-gray-600">Add all items to your cart and proceed to checkout</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200">
                  Clear Wishlist
                </button>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;

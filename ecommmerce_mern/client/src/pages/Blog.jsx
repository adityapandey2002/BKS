import React from 'react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Making Perfect Litti Chokha",
      excerpt: "Discover the traditional techniques and secrets behind Bihar's most beloved dish.",
      author: "Chef Rajesh Kumar",
      date: "2024-01-15",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
      category: "Traditional Recipes"
    },
    {
      id: 2,
      title: "Exploring Bihar's Street Food Culture",
      excerpt: "A journey through the vibrant street food scene of Patna and other cities.",
      author: "Food Blogger Priya",
      date: "2024-01-10",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop",
      category: "Food Culture"
    },
    {
      id: 3,
      title: "The Health Benefits of Traditional Bihari Spices",
      excerpt: "Learn about the medicinal properties and health benefits of indigenous spices.",
      author: "Dr. Anjali Singh",
      date: "2024-01-05",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=300&fit=crop",
      category: "Health & Wellness"
    },
    {
      id: 4,
      title: "Festival Foods of Bihar: A Culinary Celebration",
      excerpt: "Explore the special dishes prepared during Bihar's major festivals and celebrations.",
      author: "Cultural Expert Meera",
      date: "2023-12-28",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      category: "Festivals"
    },
    {
      id: 5,
      title: "From Farm to Table: Supporting Local Farmers",
      excerpt: "How we source our ingredients directly from local farmers and support communities.",
      author: "Sustainability Team",
      date: "2023-12-20",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
      category: "Sustainability"
    },
    {
      id: 6,
      title: "The Story Behind Thekua: Bihar's Sweet Tradition",
      excerpt: "Uncover the history and cultural significance of this traditional sweet treat.",
      author: "Heritage Researcher",
      date: "2023-12-15",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=300&fit=crop",
      category: "Heritage"
    }
  ];

  const categories = ["All", "Traditional Recipes", "Food Culture", "Health & Wellness", "Festivals", "Sustainability", "Heritage"];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600">Stories, recipes, and insights from Bihar's rich culinary heritage</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${category === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {blogPosts[0].category}
                </span>
                <span className="text-gray-500 text-sm ml-4">{blogPosts[0].date}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h2>
              <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">By {blogPosts[0].author}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {post.category}
                </span>
                <span className="text-gray-500 text-sm ml-3">{post.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">{post.author}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest recipes, stories, and updates from Bihar Ka Swaad.
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;

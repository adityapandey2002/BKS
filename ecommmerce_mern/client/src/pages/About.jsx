import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Bihar Ka Swaad</h1>
        <p className="text-xl text-gray-600">Discover the authentic flavors of Bihar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Bihar Ka Swaad was born from a deep love for the rich culinary heritage of Bihar.
            We believe that every dish tells a story, and we're passionate about bringing
            authentic Bihari flavors to your doorstep.
          </p>
          <p className="text-gray-600 mb-4">
            From traditional litti-chokha to mouth-watering thekua, our carefully curated
            selection represents the best of Bihar's diverse food culture. Each product
            is sourced directly from local artisans and traditional makers.
          </p>
          <p className="text-gray-600">
            We're committed to preserving these age-old recipes while supporting local
            communities and promoting sustainable food practices.
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Taste</h3>
          <p className="text-gray-600">100% authentic Bihari recipes passed down through generations</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
          <p className="text-gray-600">Every product undergoes strict quality checks to ensure freshness and authenticity</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Sourcing</h3>
          <p className="text-gray-600">Direct partnerships with local farmers and traditional food makers</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Made with Love</h3>
          <p className="text-gray-600">Every product is crafted with care and attention to traditional methods</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg">
          To preserve and promote the rich culinary heritage of Bihar while supporting
          local communities and bringing authentic flavors to food lovers worldwide.
        </p>
      </div>
    </div>
  );
};

export default About;

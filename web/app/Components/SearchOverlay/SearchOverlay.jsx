'use client';

import React from 'react';

const SearchOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  const books = [
    "MINI POTS: Luna Lovegood",
    "MINI POTS: Albus Dumbledore",
    "Watch Easter",
    "We dig"
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Search Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Suggestions
            </h3>

            {/* Categories */}
            <div className="space-y-3">
              {["Books", "Picture books"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                >
                  <span className="text-gray-700">{item}</span>
                  
                </div>
              ))}
            </div>

            {/* Authors */}
            <div className="space-y-3 mt-6">
              {[
                "Angelika Bodis Nagy",
                "Maya Jönsson",
                "Liselotte Roll"
              ].map((author) => (
                <div
                  key={author}
                  className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                >
                  <span className="text-gray-700">{author}</span>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Popular Products */}
          <div className="lg:col-span-2">
          

            {/* Horizontal Book Cards */}
            <div className="space-y-4">

              {books.map((title, index) => (
                
                <div
                  key={index}
                  className="flex items-center gap-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >


                

                </div>

              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;


import React from 'react';
import Nav from '../Nav/Nav';
import '../../globals.css';

const LandingPage = () => {
  return (
    <div className="landing-page bg-white min-h-screen">
      <Nav />
      <div className="container mx-auto flex items-center h-full">
        <div className="w-1/2 mt-16 ml-0"> {/* Added margin-left to ensure content is fully aligned to the left edge */}
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Discover Knowledge, <br /> Preserve Heritage
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Access thousands of knowledge products, and institutional archives through our digital library system.
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by title, author, ISBN, or keyword..."
            />
            <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Materials</option>
              <option>Books</option>
              <option>Journals</option>
              <option>Magazines</option>
            </select>
            <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Years</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">SEARCH</button>
          </div>
          <div className="mt-8 flex space-x-8 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">2,450 +</p>
              <p className="text-gray-600">Resources Cataloged</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">518</p>
              <p className="text-gray-600">Downloads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">67</p>
              <p className="text-gray-600">New This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
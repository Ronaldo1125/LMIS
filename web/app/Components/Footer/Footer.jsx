"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1C1B1A] text-white py-16 px-20">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#D0674B]">LMIS</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Library Management & Information System providing comprehensive access to digital resources and academic materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Home</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Categories</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Recommended</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">About</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">E-Books</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Journals</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Databases</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-[#D0674B] transition-colors">Research Papers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">Email: info@lmis.edu</li>
              <li className="text-sm text-gray-300">Phone: +1 (555) 123-4567</li>
              <li className="text-sm text-gray-300">Hours: Mon-Fri 8AM-8PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2026 LMIS. All rights reserved. Made by Paw Patrol
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-[#D0674B] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#D0674B] transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#D0674B] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

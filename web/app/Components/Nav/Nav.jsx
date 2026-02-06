import React from 'react';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className="navbar bg-white shadow-sm sticky top-0 z-50">
      <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-4">
        <ul className="nav-links flex space-x-6 text-gray-700 text-sm font-regular">
          <li><Link href="/about" legacyBehavior><a className="hover:text-blue-500">HOME</a></Link></li>
          <li><Link href="/catalog" legacyBehavior><a className="hover:text-blue-500">ADDITIONS</a></Link></li>
          <li><Link href="/contact" legacyBehavior><a className="hover:text-blue-500">CATALOG</a></Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
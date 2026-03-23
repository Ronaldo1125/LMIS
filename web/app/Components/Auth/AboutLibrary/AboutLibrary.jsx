"use client";

import React from "react";
import { User, Search, BookOpen, Bookmark, ArrowRight } from "lucide-react";

export default function AboutLibrary() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-[1700px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>GET STARTED</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            How to use the e-library
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Get started with our digital library in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-white rounded-sm p-8 h-full shadow-sm transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="absolute top-4 right-4 text-black font-bold text-2xl">
                1
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <User className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Create a free account
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Sign up in under a minute with just your email. No credit card, no subscription — your account is free forever.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="bg-white rounded-sm p-8 h-full shadow-sm transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="absolute top-4 right-4 text-black font-bold text-2xl">
                2
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Search className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Search the catalogue
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Use the search bar to find titles by name, author, ISBN, or topic. Filter by category, language, or publication year.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                <span>Explore books</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-white rounded-sm p-8 h-full shadow-sm transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="absolute top-4 right-4 text-black font-bold text-2xl">
                3
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <BookOpen className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Open and read instantly
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Click any title to open it directly in your browser. No downloads, no waiting — start reading on any device immediately.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                <span>Start reading</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative group">
            <div className="bg-white rounded-sm p-8 h-full shadow-sm transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="absolute top-4 right-4 text-black font-bold text-2xl">
                4
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Bookmark className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Save and track progress
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Bookmark titles, highlight passages, and pick up exactly where you left off across all your devices.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                <span>Manage library</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
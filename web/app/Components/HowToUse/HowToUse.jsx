"use client";

import React from "react";

const HowToUse = () => {
  const steps = [
    {
      icon: "🔍",
      title: "Search",
      description: "Find books, journals, articles, databases and more"
    },
    {
      icon: "📚", 
      title: "Browse",
      description: "Explore our collection by category or topic"
    },
    {
      icon: "📖",
      title: "Read",
      description: "Access full-text content online or download for offline reading"
    },
    {
      icon: "💾",
      title: "Save",
      description: "Create your personal library and save your favorite resources"
    }
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1320px] mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            GET STARTED
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            How to use Arcadia
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">
                {step.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;

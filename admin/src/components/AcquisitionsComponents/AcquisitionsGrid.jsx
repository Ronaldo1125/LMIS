import React from 'react';
import AcquisitionCard from './AcquisitionCard';

const AcquisitionsGrid = ({ acquisitions }) => {
  if (acquisitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-300 mb-6 animate-pulse"
        >
          <rect x="30" y="20" width="60" height="80" rx="4" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="65" x2="75" y2="65" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h2 className="text-2xl font-bold text-[#154A9A] mb-2">
          No Acquisitions Yet
        </h2>
        <p className="text-base text-slate-600">
          Books acquired will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {acquisitions.map((acquisition, index) => (
        <div 
          key={acquisition.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AcquisitionCard
            acquisition={acquisition}
            viewMode="grid"
          />
        </div>
      ))}
    </div>
  );
};

export default AcquisitionsGrid;
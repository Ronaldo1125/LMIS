import React from 'react';

const FreeAccess = () => {
  return (
    <div className="bg-blue-950 text-white py-16 px-8">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Free for everyone, forever.
          </h2>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
            LMIS is an open-access digital library. No subscriptions, no paywalls, no late fees — just instant access to hundreds of thousands of titles from any device.
          </p>
        </div>
        <div className="md:w-1/2 flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 transition-colors duration-200 text-base">
            Start reading free
          </button>
          <button className="bg-transparent border border-white hover:bg-white hover:text-blue-950 text-white font-semibold py-4 px-8 transition-all duration-200 text-base">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeAccess;

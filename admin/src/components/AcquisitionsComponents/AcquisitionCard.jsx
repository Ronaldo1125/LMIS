import React from 'react';

const AcquisitionCard = ({ acquisition, viewMode, onViewDetails }) => {
  const { title, author, coverImage, acquisitionDate } = acquisition;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (viewMode === 'list') {
    return (
      <div
        className="flex gap-6 p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:translate-x-2 group"
        onClick={onViewDetails}
      >
        {/* Cover */}
        <div className="flex-shrink-0 w-20 h-[120px] overflow-hidden shadow-md bg-gray-100">
          <img
            src={coverImage}
            alt={`Cover of ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <h3 className="text-lg font-semibold text-[#154A9A] leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-[15px] text-gray-600">
            by {author}
          </p>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Acquired: {formatDate(acquisitionDate)}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-[#154A9A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div
      className="bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] group"
      onClick={onViewDetails}
    >
      {/* Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Date Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-xs font-medium tracking-wide">
            {formatDate(acquisitionDate)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-[#154A9A] leading-snug tracking-tight mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {author}
        </p>

        {/* View Details */}
        <button
          className="mt-3 text-sm text-[#154A9A] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AcquisitionCard;


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
        className="flex gap-4 p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:translate-x-1 group"
        onClick={() => onViewDetails(acquisition)}
      >
        {/* Cover */}
        <div className="flex-shrink-0 w-16 h-[100px] overflow-hidden shadow bg-gray-100">
          <img
            src={coverImage}
            alt={`Cover of ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center gap-1">
          <h3 className="text-base font-semibold text-[#154A9A] leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-600">by {author}</p>
          <p className="text-xs text-gray-500">Acquired: {formatDate(acquisitionDate)}</p>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-[#154A9A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
      className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01] group"
      onClick={() => onViewDetails(acquisition)}
    >
      {/* Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Date Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-[11px] font-medium tracking-wide">
            {formatDate(acquisitionDate)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#154A9A] leading-snug tracking-tight mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-600">{author}</p>

        {/* View Details */}
        <button
          className="mt-2 text-xs text-[#154A9A] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(acquisition);
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
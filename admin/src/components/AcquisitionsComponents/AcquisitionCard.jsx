import React from 'react';
import { BookOpen } from 'lucide-react';
import PDFThumbnail from './PDFThumbnail'; // adjust path if needed

const AcquisitionCard = ({ acquisition, viewMode, onViewDetails, dark = false }) => {
  const { title, author, coverImage, acquisitionDate, upload_id } = acquisition;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ── Render function (not a nested component) ──────────────────────────────
  const renderCover = (extraStyle = {}) => {
    if (upload_id) {
      return (
        <PDFThumbnail
          uploadId={upload_id}
          title={title}
          style={{
            aspectRatio: 'unset',
            width: '100%',
            height: '100%',
            background: dark ? '#1a3356' : '#f3f4f6',
            ...extraStyle,
          }}
        />
      );
    }
    if (coverImage) {
      return (
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BookOpen size={28} className={dark ? 'text-[#1a3356]' : 'text-gray-300'} />
      </div>
    );
  };

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <div
        className={`flex gap-4 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:translate-x-1 group rounded-xl border ${dark ? 'bg-[#0a1628] border-[#1a3356]' : 'bg-white border-gray-200'}`}
        onClick={() => onViewDetails(acquisition)}
      >
        <div className={`flex-shrink-0 w-16 h-[100px] overflow-hidden shadow rounded ${dark ? 'bg-[#1a3356]' : 'bg-gray-100'}`}>
          {renderCover()}
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1">
          <h3 className={`text-base font-semibold leading-tight tracking-tight ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>{title}</h3>
          <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>by {author}</p>
          <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Acquired: {formatDate(acquisitionDate)}</p>
        </div>

        <div className="flex items-center">
          <svg
            className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01] group flex flex-col h-full rounded-xl border ${dark ? 'bg-[#0a1628] border-[#1a3356]' : 'bg-white border-gray-200'}`}
      onClick={() => onViewDetails(acquisition)}
    >
      <div className={`relative w-full aspect-[2/3] overflow-hidden ${dark ? 'bg-[#1a3356]' : 'bg-gray-100'}`}>
        {renderCover()}

        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <p className="text-white text-[11px] font-medium tracking-wide">
            {formatDate(acquisitionDate)}
          </p>
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow min-h-[90px]">
        <div>
          <h3 className={`font-semibold leading-snug tracking-tight mb-1 line-clamp-2 text-[0.95rem] ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>{title}</h3>
          <p className={`text-xs line-clamp-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{author}</p>
        </div>

        <button
          className={`mt-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}
          onClick={(e) => { e.stopPropagation(); onViewDetails(acquisition); }}
        >
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AcquisitionCard;
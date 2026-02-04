import React from 'react';

const AcquisitionCard = ({ acquisition, viewMode }) => {
  const { title, author, coverImage, acquisitionDate } = acquisition;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 p-5 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:translate-x-2 group">
        <div className="flex-shrink-0 w-20 h-[120px] rounded-lg overflow-hidden shadow-md bg-slate-100">
          <img 
            src={coverImage} 
            alt={`Cover of ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-2">
          <h3 className="text-lg font-bold text-[#154A9A] leading-tight">
            {title}
          </h3>
          <p className="text-[15px] text-slate-600 font-medium">
            by {author}
          </p>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Acquired: {formatDate(acquisitionDate)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] group">
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-100">
        <img 
          src={coverImage} 
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-xs font-semibold drop-shadow-lg">
            {formatDate(acquisitionDate)}
          </p>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-base font-bold text-[#154A9A] leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 font-medium">
          {author}
        </p>
      </div>
    </div>
  );
};

export default AcquisitionCard;
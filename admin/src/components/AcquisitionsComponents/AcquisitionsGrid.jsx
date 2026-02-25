import React, { useState } from 'react';
import AcquisitionCard from './AcquisitionCard';
import BookDetailsModal from './BookDetailsModal';

const AcquisitionsGrid = ({ acquisitions, dark = false }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  if (acquisitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-[#93c5fd]' : 'text-[#154A9A]'}`}>
          No Acquisitions Yet
        </h2>
        <p className={`text-base ${dark ? 'text-[#6b8cae]' : 'text-slate-600'}`}>
          Books acquired will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5">
      {acquisitions.map((acquisition, index) => (
        <div
          key={acquisition.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AcquisitionCard
            acquisition={acquisition}
            viewMode="grid"
            onViewDetails={(book) => setSelectedBook(book)}
            dark={dark}
          />
        </div>
      ))}

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          dark={dark}
        />
      )}
    </div>
  );
};

export default AcquisitionsGrid;
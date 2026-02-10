import React, { useState } from 'react';
import AcquisitionCard from './AcquisitionCard';
import BookDetailsModal from './BookDetailsModal';

const AcquisitionsGrid = ({ acquisitions }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  if (acquisitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-[#154A9A] mb-2">No Acquisitions Yet</h2>
        <p className="text-base text-slate-600">Books acquired will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
          />
        </div>
      ))}

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default AcquisitionsGrid;
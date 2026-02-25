import React, { useState } from 'react';

const PDFReader = ({ pdfUrl, fallbackImage, title, className = "" }) => {
  const [pdfError, setPdfError] = useState(false);

  const handlePdfError = () => {
    setPdfError(true);
  };

  if (pdfError) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={fallbackImage || "/assets/BooksImages/2.avif"}
          alt={title || "Book cover"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title={title || "Book Preview"}
        onError={handlePdfError}
        onLoad={() => setPdfError(false)}
      />
    </div>
  );
};

export default PDFReader;

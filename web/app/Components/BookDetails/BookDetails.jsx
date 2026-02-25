import React, { useState } from "react";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import PDFReader from "../PDFReader/PDFReader";

const BookDetails = ({ book }) => {
  const [showModal, setShowModal] = useState(false);

  const handleReadBook = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDownloadBook = () => {
    const pdfUrl = book.pdfUrl || "/pdfs/1975 Integrated Census of the Population and Its Economic Activities - Camarines Sur.pdf";
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = book.title ? `${book.title}.pdf` : 'book.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark functionality to be implemented');
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500 text-lg">
        Loading book details...
      </div>
    );
  }


  return (
    <>
      <Nav />

      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-8 font-sans">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-800 text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Books
            </button>
          </div>

          {/* Main card */}
          <div className="bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
              {/* Left: PDF Reader */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-[600px]">
                  <PDFReader
                    pdfUrl={book.pdfUrl || "/pdfs/1975 Integrated Census of the Population and Its Economic Activities - Camarines Sur.pdf"}
                    fallbackImage={book.coverImage || book.image || "/assets/BooksImages/2.avif"}
                    title={book.title}
                    className="h-[700px]"
                    maxPages={10}
                    startPage={1}
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
                  {book.title}
                </h1>

                <div className="mt-2 text-gray-500 text-sm">
                  <span className="font-medium text-gray-700">{book.author}</span>
                  {book.year ? <span className="mx-2">•</span> : null}
                  {book.year ? <span>{book.year} year</span> : null}
                </div>

                {/* format + actions row (like the screenshot) */}
                <div className="mt-8 flex flex-col gap-5">
                  <div className="flex justify-start">
                    {/* Buttons */}
                    <div className="flex gap-3 w-full max-w-2xl">
                      <button
                        onClick={handleReadBook}
                        className="flex-1 px-12 py-3 text-sm font-semibold rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                      >
                        Read
                      </button>

                      <button
                        onClick={handleDownloadBook}
                        className="flex-1 px-12 py-3 text-sm font-semibold rounded bg-gray-900 text-white hover:bg-black transition-colors"
                      >
                        Download
                      </button>

                      <button
                        onClick={handleBookmark}
                        className="px-6 py-3 text-sm font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Availability pill (optional, subtle) */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                        book.available
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          book.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {book.available ? "Available" : "Currently Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Book details section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
                    <InfoRow label="Author" value={book.author || "Maria Santos, PhD"} />
                    <InfoRow label="Edition" value={book.edition || "Second Edition"} />
                    <InfoRow label="Publication Date" value={book.publicationDate || "January 2024"} />
                    <InfoRow label="Material Type" value={book.materialType || "Research Publication"} />
                    <InfoRow label="ISBN" value={book.isbn || "978-1-234-56789-0"} />
                    <InfoRow label="Subject" value={book.subject || "Library science-United States"} />
                    <InfoRow label="Pages" value={book.pages || "342 pages"} />
                    <InfoRow label="Language" value={book.language || "English"} />
                    <InfoRow label="Call Num." value={book.callNumber || "Res 020.0973"} />
                    <InfoRow label="Accession No." value={book.accessionNumber || "ACC-2024-00847"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RelatedBooks currentBook={book} />
        </div>
      </div>

      {/* PDF Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{book.title || "Book Preview"}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="h-[75vh]">
              <PDFReader
                pdfUrl={book.pdfUrl || "/pdfs/1975 Integrated Census of the Population and Its Economic Activities - Camarines Sur.pdf"}
                fallbackImage={book.coverImage || book.image || "/assets/BooksImages/2.avif"}
                title={book.title}
                className="h-full"
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Reading preview only. Use Download button for full access.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

export default BookDetails;

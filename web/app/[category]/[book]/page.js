"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Nav from "../../Components/Nav/Nav";
import Footer from "../../Components/Footer/Footer";
import { allBooks } from "../../database";

// ✅ react-pdf (client-only)
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// IMPORTANT: set worker (put this in any client component that uses react-pdf)
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

// Document & Page must be dynamic to avoid SSR issues in Next
const Document = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

// Icons
function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-600">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 18l-6-6 6-6"
      />
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-black">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7h7M9 11h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
      <path
        d="M12 3v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 19h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ filled = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-black">
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Details components
const DetailItem = ({ label, value }) => (
  <div className="py-3">
    <p className="text-[11px] uppercase tracking-widest text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-[14px] text-gray-900 leading-tight">
      {value || "—"}
    </p>
  </div>
);

const DetailsSection = ({ groups }) => {
  return (
    <div className="w-full max-w-[640px]">
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[15px] font-semibold text-gray-900">
              {group.title}
            </h3>

            <div className="mt-3 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10 divide-y divide-gray-200 sm:divide-y-0">
                {group.items.map((it, idx) => (
                  <div
                    key={it.label}
                    className={[
                      "sm:border-r sm:border-gray-200",
                      idx % 2 === 1 ? "sm:border-r-0" : "",
                      idx >= 2 ? "sm:border-t sm:border-gray-200" : "",
                      idx % 2 === 0 ? "sm:pr-8" : "sm:pl-8",
                    ].join(" ")}
                  >
                    <DetailItem label={it.label} value={it.value} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ PDF preview (first 5 pages)
const PdfPreview5Pages = ({ pdfUrl, onClick }) => {
  const [numPages, setNumPages] = useState(null);

  // render only 1..5 (or less if pdf has fewer)
  const pagesToShow = useMemo(() => {
    const max = Math.min(numPages || 5, 5);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [numPages]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-widest text-gray-600">
          Preview (first 5 pages)
        </p>

        {/* optional: click to open full */}
        <button
          type="button"
          onClick={onClick}
          className="text-[12px] text-gray-700 hover:text-gray-900 underline underline-offset-4"
        >
          Open full
        </button>
      </div>

      <div className="mt-4 rounded-[10px] bg-white/70 border border-black/10 overflow-hidden">
        <div className="max-h-[320px] overflow-auto p-3">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="py-10 text-center text-[13px] text-gray-600">
                Loading preview…
              </div>
            }
            error={
              <div className="py-10 text-center text-[13px] text-gray-600">
                Preview unavailable (PDF not found).
              </div>
            }
          >
            <div className="space-y-4">
              {pagesToShow.map((pageNumber) => (
                <div
                  key={pageNumber}
                  className="rounded-md overflow-hidden border border-black/10 bg-white shadow-sm"
                >
                  <Page
                    pageNumber={pageNumber}
                    // ✅ Small, readable preview
                    width={520}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  <div className="px-3 py-2 border-t border-black/10 text-[12px] text-gray-600">
                    Page {pageNumber}
                    {numPages ? ` of ${numPages}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};

const BookDetailsPage = () => {
  const params = useParams();
  const { category, book: bookId } = params;

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const book = useMemo(() => {
    return allBooks.find((b) => b.id === bookId && b.category === category);
  }, [bookId, category]);

  const closePdfModal = () => setShowPdfModal(false);
  const toggleBookmark = () => setIsBookmarked((v) => !v);

  if (!book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Book Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The book you're looking for doesn't exist.
          </p>
          <Link
            href={`/${category}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:opacity-90 transition"
          >
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  // Links
  const readUrl = book.readUrl || `/read/${book.id}`;
  const pdfUrl = book.pdfUrl || `/pdfs/1975 Integrated Census of the Population and Its Economic Activities - Camarines Sur.pdf`;

  // Meta (fallbacks)
  const meta = {
    authorFull: book.authorFull || book.author || "Marketing Experts",
    edition: book.edition || "Second Edition",
    publicationDate: book.publicationDate || "January 2024",
    materialType: book.materialType || "Research Publication",
    isbn: book.isbn || "978-1-234-56789-17",
    subject: book.subject || "Library science–United States",
    pages: book.pages || "342",
    language: book.language || "English",
    callNumber: book.callNumber || "Res 020.0973",
    accessionNo: book.accessionNo || "ACC-2024-00847",
  };

  const detailsGroups = useMemo(
    () => [
      {
        title: "Book information",
        items: [
          { label: "Language", value: meta.language },
          { label: "Author", value: meta.authorFull },
          { label: "Edition", value: meta.edition },
          { label: "Publication date", value: meta.publicationDate },
          { label: "Material type", value: meta.materialType },
          { label: "Subject", value: meta.subject },
        ],
      },
      {
        title: "Production",
        items: [
          { label: "Call number", value: meta.callNumber },
          { label: "Accession no.", value: meta.accessionNo },
        ],
      },
      {
        title: "Product Details",
        items: [
          { label: "ISBN", value: meta.isbn },
          { label: "Number of pages", value: meta.pages },
        ],
      },
    ],
    [meta]
  );

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="mx-auto w-full max-w-[1350px] px-6 sm:px-8 lg:px-10 pt-8 pb-20">
        {/* Back */}
        <div className="mb-6">
          <Link
            href={`/${category}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft />
            <span className="text-[14px]">Back to {category}</span>
          </Link>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* ✅ LEFT: gray panel with PDF preview (5 pages) */}
          <div className="bg-[#f3f3f3] rounded-[10px] p-6 sm:p-8 lg:p-10">
            {/* Preview (ONLY 5 pages) */}
            <div className="mt-8">
              <PdfPreview5Pages
                pdfUrl={pdfUrl}
                onClick={() => setShowPdfModal(true)}
              />
            </div>
          </div>

          {/* RIGHT: content + details */}
          <div className="pt-1">
            <h1 className="text-[36px] sm:text-[46px] leading-[1.05] font-semibold text-gray-900">
              {book.title}
            </h1>

            <div className="mt-3 text-[14px] text-gray-500">
              <span className="font-medium text-gray-800">{book.author}</span>
              <span className="mx-2">•</span>
              <span>{book.year} year</span>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1f1f1f] px-6 py-3.5 text-[14px] font-medium text-white hover:opacity-90 transition"
              >
                <DownloadIcon />
                Download
              </a>

              <Link
                href={readUrl}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#f4f4f4] px-6 py-3.5 text-[14px] font-medium text-black hover:opacity-90 transition"
              >
                <ReadIcon />
                Read
              </Link>

              <button
                onClick={() => setShowPdfModal(true)}
                className="inline-flex items-center justify-center rounded-sm bg-[#f4f4f4] px-5 py-3.5 text-[14px] font-medium text-black hover:opacity-90 transition"
              >
                Preview
              </button>

              <button
                onClick={toggleBookmark}
                className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-[#f4f4f4] hover:bg-[#e8e8e8] transition"
                aria-label="Bookmark"
              >
                <BookmarkIcon filled={isBookmarked} />
              </button>
            </div>

            <div className="mt-8 h-px w-full bg-gray-200" />

            <div className="mt-8">
              <DetailsSection groups={detailsGroups} />
            </div>
          </div>
        </div>
      </main>

      {/* Full PDF Modal (optional) */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {book.title}
              </h3>
              <button
                onClick={closePdfModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-gray-600"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="h-[calc(90vh-120px)] overflow-auto p-4">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title={`${book.title} PDF`}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookDetailsPage;

/**
 * ✅ Install deps (once):
 * npm i react-pdf pdfjs-dist
 */

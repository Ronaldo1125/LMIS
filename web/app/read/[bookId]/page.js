"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../Components/Nav/Nav";
import Footer from "../../Components/Footer/Footer";
import { allBooks } from "../../database";

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

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-600">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const ReadPage = () => {
  const params = useParams();
  const { bookId } = params;

  const book = allBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Book Not Found</h1>
          <p className="text-gray-600 mb-8">The book you're looking for doesn't exist.</p>
          <Link
            href="/books"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:opacity-90 transition"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Link
              href={`/${book.category}/${book.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft />
              <span>Back to {book.title}</span>
            </Link>
            
            {/* Book Cover */}
            <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            
            <h1 className="text-lg font-semibold text-gray-900">{book.title}</h1>
          </div>
          
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <CloseIcon />
            Close
          </Link>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4">
          <div className="w-full h-full">
            <iframe
              src={`/pdfs/WEEK2 FEB.pdf#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 rounded-lg"
              title={`${book.title} PDF Reader`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReadPage;

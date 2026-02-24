"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Document = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

export default function PdfPreview5Pages({ pdfUrl, onClick }) {
  const [numPages, setNumPages] = useState(null);

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
}

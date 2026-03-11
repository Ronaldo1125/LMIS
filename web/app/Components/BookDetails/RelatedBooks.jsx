"use client";

import React, { useState } from "react";
import { ChevronRight, BookOpen, LayoutGrid, List } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

const BOOK_COLORS = [
  "#1a3a6e",
  "#0e5c8a",
  "#1a4d6e",
  "#283593",
  "#115f7a",
  "#1a4d6e",
  "#0a3d62",
  "#1b4f72",
  "#154360",
  "#1a5276",
  "#0e3460",
  "#1b4f72",
  "#1a5276",
  "#0e3460",
];

const sampleBooks = [
  { 
    id: 1,
    title: "Community Development in an Uncertain World", 
    author: "Ife & Tesoriero",       
    edition: "4th Edition · 2016", 
    label: "Community Development",
    isbn: "978-0190304296",
    publisher: "Oxford University Press",
    year: "2016",
    pages: 456,
    language: "English",
    category: "Community Development",
    upload_id: "book_1",
    description: "This comprehensive textbook explores the theory and practice of community development in an increasingly complex and uncertain world. It provides students with the critical thinking skills and practical tools needed to work effectively with diverse communities.",
    rating: 4.2,
    reviews: 128,
    available: true,
    dimensions: "6.1 x 0.9 x 9.2 inches",
    weight: "1.8 pounds",
    format: "Paperback",
    location: "Main Library, Shelf A-12"
  },
  { 
    id: 2,
    title: "Understanding Social Policy",                 
    author: "Alcock et al.",          
    edition: "9th Edition · 2021", 
    label: "Social Policy & Practice",
    isbn: "978-0190858704",
    publisher: "Oxford University Press",
    year: "2021",
    pages: 624,
    language: "English",
    category: "Social Policy & Practice",
    upload_id: "book_2",
    description: "A comprehensive introduction to social policy that explores the key concepts, theories, and debates in the field. This edition covers contemporary policy issues and their impact on society.",
    rating: 4.5,
    reviews: 89,
    available: true,
    dimensions: "6.5 x 1.2 x 9.5 inches",
    weight: "2.3 pounds",
    format: "Hardcover",
    location: "Main Library, Shelf B-08"
  },
  { 
    id: 3,
    title: "Research Design: Qualitative & Mixed",        
    author: "Creswell",               
    edition: "5th Edition · 2018", 
    label: "Research Methods",
    isbn: "978-1506386706",
    publisher: "SAGE Publications",
    year: "2018",
    pages: 304,
    language: "English",
    category: "Research Methods",
    upload_id: "book_3",
    description: "This book provides a clear and practical guide to research design, covering qualitative, quantitative, and mixed methods approaches. It includes numerous examples and practical applications.",
    rating: 4.7,
    reviews: 234,
    available: false,
    dimensions: "6.0 x 0.8 x 9.0 inches",
    weight: "1.4 pounds",
    format: "Paperback",
    location: "Main Library, Shelf C-15"
  },
  { 
    id: 4,
    title: "Collaborative Planning: Shaping Places",      
    author: "Healey",                 
    edition: "2nd Edition · 2006", 
    label: "Urban Planning",
    isbn: "978-0761944375",
    publisher: "SAGE Publications",
    year: "2006",
    pages: 432,
    language: "English",
    category: "Urban Planning",
    upload_id: "book_4",
    description: "An exploration of collaborative planning approaches in urban development, examining how different stakeholders can work together to shape better places and communities.",
    rating: 4.1,
    reviews: 67,
    available: true,
    dimensions: "6.1 x 1.0 x 9.1 inches",
    weight: "1.7 pounds",
    format: "Paperback",
    location: "Main Library, Shelf D-22"
  },
  { 
    id: 5,
    title: "Geographies of Development",                  
    author: "Potter et al.",          
    edition: "3rd Edition · 2008", 
    label: "Development Studies",
    isbn: "978-0415424758",
    publisher: "Routledge",
    year: "2008",
    pages: 320,
    language: "English",
    category: "Development Studies",
    upload_id: "book_5",
    description: "This book provides a comprehensive introduction to development geography, exploring the complex relationships between development processes and spatial change.",
    rating: 4.3,
    reviews: 156,
    available: true,
    dimensions: "6.2 x 0.9 x 9.3 inches",
    weight: "1.6 pounds",
    format: "Paperback",
    location: "Main Library, Shelf E-07"
  },
  { 
    id: 6,
    title: "Participatory Action Research in Practice",   
    author: "Kindon, Pain & Kesby",   
    edition: "1st Edition · 2007", 
    label: "Research Methods",
    isbn: "978-0415436607",
    publisher: "Routledge",
    year: "2007",
    pages: 288,
    language: "English",
    category: "Research Methods",
    description: "A practical guide to participatory action research, featuring case studies and methodological reflections from researchers working in diverse contexts.",
    rating: 4.4,
    reviews: 92,
    available: true,
    dimensions: "6.0 x 0.7 x 8.9 inches",
    weight: "1.3 pounds",
    format: "Paperback",
    location: "Main Library, Shelf C-18"
  },
  { 
    id: 7,
    title: "Social Innovation and Impact Measurement",    
    author: "Mulgan",                 
    edition: "1st Edition · 2019", 
    label: "Social Work",
    isbn: "978-1911117515",
    publisher: "Biteback Publishing",
    year: "2019",
    pages: 256,
    language: "English",
    category: "Social Work",
    description: "Exploring the theory and practice of social innovation and how to measure its impact on society, with practical frameworks and case studies.",
    rating: 4.0,
    reviews: 78,
    available: false,
    dimensions: "5.8 x 0.8 x 8.7 inches",
    weight: "1.2 pounds",
    format: "Hardcover",
    location: "Main Library, Shelf F-11"
  },
  { 
    id: 8,
    title: "Youth Development Frameworks",                
    author: "Eccles & Gootman",       
    edition: "1st Edition · 2002", 
    label: "Education",
    isbn: "978-0309072755",
    publisher: "National Academies Press",
    year: "2002",
    pages: 112,
    language: "English",
    category: "Education",
    description: "A comprehensive framework for understanding youth development, drawing on research from multiple disciplines to inform policy and practice.",
    rating: 4.6,
    reviews: 145,
    available: true,
    dimensions: "6.0 x 0.4 x 8.9 inches",
    weight: "0.8 pounds",
    format: "Paperback",
    location: "Main Library, Shelf G-03"
  },
  { 
    id: 9,
    title: "Intersectionality in Public Policy",          
    author: "Hankivsky",             
    edition: "2nd Edition · 2021", 
    label: "Policy Studies",
    isbn: "978-1447356789",
    publisher: "Policy Press",
    year: "2021",
    pages: 240,
    language: "English",
    category: "Policy Studies",
    description: "An examination of how intersectionality can be applied to public policy analysis and development, with practical examples and frameworks.",
    rating: 4.3,
    reviews: 103,
    available: true,
    dimensions: "6.1 x 0.8 x 9.0 inches",
    weight: "1.1 pounds",
    format: "Paperback",
    location: "Main Library, Shelf H-14"
  },
  { 
    id: 10,
    title: "Sustainable Development Goals Handbook",      
    author: "UN Global Compact",      
    edition: "2025 Edition",       
    label: "Development Studies",
    isbn: "978-9213614352",
    publisher: "United Nations",
    year: "2025",
    pages: 480,
    language: "English",
    category: "Development Studies",
    description: "A comprehensive handbook on the Sustainable Development Goals, providing practical guidance for implementation and monitoring at local, national, and global levels.",
    rating: 4.8,
    reviews: 267,
    available: true,
    dimensions: "6.3 x 1.1 x 9.4 inches",
    weight: "2.0 pounds",
    format: "Paperback",
    location: "Main Library, Shelf E-19"
  },
];

const RelatedBooks = ({ currentBook }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isGridView, setIsGridView] = useState(true);

  // Filter books by category or show first 4 as related
  const relatedBooks = sampleBooks
    .filter(book => book.category === currentBook?.category || book.id <= 6)
    .slice(0, visibleCount);

  const visible = relatedBooks;

  const handleBookClick = (book) => {
    // Navigate to book details page
    window.location.href = `/book/${book.id}`;
  };

  return (
    <div style={{ background: "#fff" }}>

      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 48px 24px",
        marginBottom: 0,
        maxWidth: 1440,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h2 style={{
          fontSize: 29,
          fontWeight: 600,
          color: "#003087",
          margin: 0,
        }}>
          Related Books
        </h2>
      </div>

     
      {/* GRID VIEW */}
      {isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 48px 56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 18,
            justifyContent: "start",
          }}
        >
          {visible.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book)}
              style={{
                cursor: "pointer",
                border: "1px solid #e6ecf7",
                borderRadius: 0,
                overflow: "hidden",
              
              }}
             
            >
              {/* Cover */}
              <PDFThumbnail uploadId={book.upload_id} title={book.title} />

              {/* Minimal Info (ONLY Title, Author, Year) */}
              <div style={{ padding: "12px 12px 14px" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.25,
                    marginBottom: 6,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {book.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    lineHeight: 1.2,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                    title={book.author}
                  >
                    {book.author}
                  </span>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>
                    {book.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {!isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 48px 56px",
            border: "1px solid #e6ecf7",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {visible.map((book, index) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderBottom:
                  index < visible.length - 1 ? "1px solid #eef2ff" : "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#f7faff")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <div
                style={{
                  width: 44,
                  height: 58,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid #e6ecf7",
                  background: "#f6f8ff",
                }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.25,
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={book.title}
                >
                  {book.title}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                    title={book.author}
                  >
                    {book.author}
                  </span>
                  <span style={{ fontWeight: 700, color: "#6b7280" }}>
                    {book.year}
                  </span>
                </div>
              </div>

              <ChevronRight size={18} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedBooks;
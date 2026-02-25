"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BookDetails from '../../Components/BookDetails/BookDetails';

const BookPage = () => {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock book data - in a real app, this would come from an API
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
      description: "This comprehensive textbook explores the theory and practice of community development in an increasingly complex and uncertain world. It provides students with the critical thinking skills and practical tools needed to work effectively with diverse communities.",
      rating: 4.2,
      reviews: 128,
      available: true,
      dimensions: "6.1 x 0.9 x 9.2 inches",
      weight: "1.8 pounds",
      format: "Paperback",
      location: "Main Library, Shelf A-12",
      coverImage: "/placeholder-book.png"
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
      description: "A comprehensive introduction to social policy that explores the key concepts, theories, and debates in the field. This edition covers contemporary policy issues and their impact on society.",
      rating: 4.5,
      reviews: 89,
      available: true,
      dimensions: "6.5 x 1.2 x 9.5 inches",
      weight: "2.3 pounds",
      format: "Hardcover",
      location: "Main Library, Shelf B-08",
      coverImage: "/placeholder-book.png"
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
      description: "This book provides a clear and practical guide to research design, covering qualitative, quantitative, and mixed methods approaches. It includes numerous examples and practical applications.",
      rating: 4.7,
      reviews: 234,
      available: false,
      dimensions: "6.0 x 0.8 x 9.0 inches",
      weight: "1.4 pounds",
      format: "Paperback",
      location: "Main Library, Shelf C-15",
      coverImage: "/placeholder-book.png"
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
      description: "An exploration of collaborative planning approaches in urban development, examining how different stakeholders can work together to shape better places and communities.",
      rating: 4.1,
      reviews: 67,
      available: true,
      dimensions: "6.1 x 1.0 x 9.1 inches",
      weight: "1.7 pounds",
      format: "Paperback",
      location: "Main Library, Shelf D-22",
      coverImage: "/placeholder-book.png"
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
      description: "This book provides a comprehensive introduction to development geography, exploring the complex relationships between development processes and spatial change.",
      rating: 4.3,
      reviews: 156,
      available: true,
      dimensions: "6.2 x 0.9 x 9.3 inches",
      weight: "1.6 pounds",
      format: "Paperback",
      location: "Main Library, Shelf E-07",
      coverImage: "/placeholder-book.png"
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
      location: "Main Library, Shelf C-18",
      coverImage: "/placeholder-book.png"
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
      location: "Main Library, Shelf F-11",
      coverImage: "/placeholder-book.png"
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
      location: "Main Library, Shelf G-03",
      coverImage: "/placeholder-book.png"
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
      location: "Main Library, Shelf H-14",
      coverImage: "/placeholder-book.png"
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
      location: "Main Library, Shelf E-19",
      coverImage: "/placeholder-book.png"
    },
  ];

  useEffect(() => {
    // Simulate loading and find the book
    const bookId = parseInt(params.id);
    const foundBook = sampleBooks.find(b => b.id === bookId);
    
    // Simulate API call delay
    setTimeout(() => {
      setBook(foundBook);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading book details...
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '32px', color: '#1f2937', marginBottom: '16px' }}>
          Book Not Found
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
          The book you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return <BookDetails book={book} />;
};

export default BookPage;

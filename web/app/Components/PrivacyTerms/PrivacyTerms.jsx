"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ContentRenderer = ({ content, textSize }) => {
  const paragraphs = content
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className={`${textSize} text-gray-600 leading-relaxed space-y-3`}>
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n').map(l => l.trim()).filter(Boolean);

        if (lines.length === 1) {
          return <p key={pi}>{lines[0]}</p>;
        }

        return (
          <ul key={pi} className="space-y-2 list-none">
            {lines.map((line, li) => (
              <li key={li} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-950 flex-shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};

const defaultPrivacyContent = [
  { header: "Information We Collect", content: "We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide when using our services." },
  { header: "How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations." },
  { header: "Information Sharing", content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide users with advance notice." },
  { header: "Data Security", content: "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information." },
  { header: "Cookies", content: "We use cookies to enhance your experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser." },
  { header: "Your Consent", content: "By using our site, you consent to our privacy policy." }
];

const defaultTermsContent = [
  { header: "Acceptance of Terms", content: "By accessing and using this Library Management Information System, you accept and agree to be bound by the terms and provision of this agreement." },
  { header: "Use License", content: "Permission is granted to temporarily use one copy of the materials on LMIS for personal, non-commercial transitory viewing only." },
  { header: "User Account Responsibilities", content: "You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account." },
  { header: "Prohibited Uses", content: "You may not use our services for any illegal purpose or to violate any laws, or interfere with or disrupt the integrity or performance of the services." },
  { header: "Intellectual Property", content: "The content on this website is owned by LMIS and its contributors. You may not reproduce or distribute content without prior written permission." },
  { header: "Limitation of Liability", content: "LMIS shall not be liable for any damages arising out of the use or inability to use the materials on this website." },
  { header: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Your continued use of the site following any changes indicates acceptance of the new terms." }
];

const PrivacyTerms = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [items, setItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const section = activeTab === 'privacy' ? 'privacy_policy' : 'terms_and_conditions';
        const res = await fetch(`${API_URL}/api/privacy-terms?section=${section}`);

        if (!res.ok) throw new Error('Failed to fetch data');

        const result = await res.json();

        if (result.data && result.data.length > 0) {
          const flatItems = result.data.flatMap(row => row.items || []);
          setItems(flatItems);

          const latestRow = result.data.reduce((latest, row) => {
            return new Date(row.updated_at) > new Date(latest.updated_at) ? row : latest;
          }, result.data[0]);
          setLastUpdated(latestRow.updated_at);
        } else {
          setItems([]);
          setLastUpdated(null);
        }
      } catch (err) {
        setError(err.message);
        setItems(activeTab === 'privacy' ? defaultPrivacyContent : defaultTermsContent);
        setLastUpdated(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 768;

  const textSize = isMobile ? "text-sm" : "text-base";
  const titleSize = isMobile ? "text-xl" : "text-2xl";
  const headingSize = isMobile ? "text-base" : "text-lg";
  // Consistent horizontal padding across all sections
  const hPad = isMobile ? "px-4" : isTablet ? "px-6" : "px-8";

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header — full width, no max-width cap */}
      <div className={`bg-blue-950 text-white py-8 ${hPad} w-full`}>
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-300 hover:text-white transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        <h1 className={`${titleSize} font-bold`}>Privacy & Terms</h1>
        <p className={`${textSize} text-gray-300 mt-2`}>
          Learn about how we protect your data and the terms governing your use of our services.
        </p>
      </div>

      {/* Tab Navigation — full width */}
      <div className="bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className={`flex border-b border-gray-200 ${hPad}`}>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-blue-950 border-b-2 border-blue-950 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
              activeTab === 'terms'
                ? 'text-blue-950 border-b-2 border-blue-950 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* Content — full width, grows to fill page */}
      <div className={`flex-1 bg-white ${hPad} py-8 w-full`}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No content available for this section.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 md:p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-950 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className={`${headingSize} font-semibold text-gray-800 mb-3`}>
                      {item.header}
                    </h2>
                    <ContentRenderer content={item.content} textSize={textSize} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — full width */}
      <div className={`bg-gray-100 py-6 ${hPad} w-full text-center`}>
        {error && (
          <p className="text-xs text-amber-600 mb-1">
            Showing default content — could not reach server.
          </p>
        )}
        <p className="text-sm text-gray-500">
          Last updated: {formattedDate}
        </p>
      </div>

    </div>
  );
};

export default PrivacyTerms;
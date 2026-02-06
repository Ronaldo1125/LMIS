import React, { useState } from 'react';
import { Download, FileText, TrendingUp, Book, Sparkles, X } from 'lucide-react';

const MostDownloadedStats = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data structure - replace with your actual API data
  const [downloadStats] = useState({
    totalDownloads: 15847,
    topItems: [
      {
        id: 1,
        title: "Digital Transformation in Education 2024",
        category: "Reports",
        subcategory: "Annual Reports",
        downloads: 1234,
        trend: 15.3
      },
      {
        id: 2,
        title: "Machine Learning Fundamentals",
        category: "Books",
        subcategory: null,
        downloads: 1089,
        trend: 8.7
      },
      {
        id: 3,
        title: "Technology Today Magazine - Jan 2024",
        category: "Periodicals",
        subcategory: "Magazines",
        downloads: 967,
        trend: -2.1
      },
      {
        id: 4,
        title: "Advanced Research Methods",
        category: "Thesis/Research papers",
        subcategory: null,
        downloads: 845,
        trend: 12.5
      },
      {
        id: 5,
        title: "User Manual: Library System v3.0",
        category: "Guides/Manuals",
        subcategory: null,
        downloads: 734,
        trend: 22.8
      },
      {
        id: 6,
        title: "Constitutional Law Handbook 2024",
        category: "Statute/Law/Legal Documents",
        subcategory: null,
        downloads: 698,
        trend: 5.2
      },
      {
        id: 7,
        title: "World Atlas - Revised Edition",
        category: "Reference Materials",
        subcategory: "Atlas",
        downloads: 645,
        trend: -1.5
      },
      {
        id: 8,
        title: "Historical Sourcebook Vol. 3",
        category: "Sourcebook",
        subcategory: null,
        downloads: 612,
        trend: 18.9
      },
      {
        id: 9,
        title: "Climate Change Research Compilation",
        category: "Thesis/Research papers",
        subcategory: null,
        downloads: 587,
        trend: 31.2
      },
      {
        id: 10,
        title: "Encyclopedia Britannica - Science",
        category: "Reference Materials",
        subcategory: "Encyclopedia",
        downloads: 543,
        trend: 8.1
      },
      {
        id: 11,
        title: "Financial Review Journal - Q4 2024",
        category: "Periodicals",
        subcategory: "Journals",
        downloads: 521,
        trend: 12.7
      },
      {
        id: 12,
        title: "Introduction to Data Science",
        category: "Books",
        subcategory: null,
        downloads: 498,
        trend: 24.5
      },
      {
        id: 13,
        title: "Annual Education Report 2024",
        category: "Reports",
        subcategory: "Annual Reports",
        downloads: 476,
        trend: 6.8
      },
      {
        id: 14,
        title: "Health & Wellness Magazine - Feb 2024",
        category: "Periodicals",
        subcategory: "Magazines",
        downloads: 454,
        trend: -3.2
      },
      {
        id: 15,
        title: "Software Development Best Practices",
        category: "Guides/Manuals",
        subcategory: null,
        downloads: 432,
        trend: 15.6
      }
    ]
  });

  const styles = {
    // Brand Colors
    darkBlue1: '#154A9A',
    darkBlue2: '#0F61F7',
    darkBlue3: '#0248D4',
    darkBlue4: '#0032A6',
    black: '#000000',
    white: '#ffffff',
    
    // Secondary Colors - Complement
    secondary1Light: '#6045D2',
    secondary1Medium: '#3F1BD2',
    secondary1Dark: '#2D0CB4',
    
    // Secondary Colors - Yellow
    secondary2Light: '#FFDA3C',
    secondary2Medium: '#FFD002',
    secondary2Dark: '#FFCF00',
    
    // Secondary Colors - Orange
    secondary3Light: '#FFBB3C',
    secondary3Medium: '#FFA602',
    secondary3Dark: '#FFA500',
    
    // Greys
    grey50: '#F9FAFB',
    grey100: '#F3F4F6',
    grey200: '#E5E7EB',
    grey300: '#D1D5DB',
    grey400: '#9CA3AF',
    grey500: '#6B7280',
    grey600: '#4B5563',
    grey700: '#374151',
    grey800: '#1F2937',
    grey900: '#111827',
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'books', label: 'Books' },
    { value: 'reports', label: 'Reports', subcategories: ['Annual Reports', 'Special Reports'] },
    { value: 'periodicals', label: 'Periodicals', subcategories: ['Magazines', 'Newspapers', 'Journals'] },
    { value: 'sourcebook', label: 'Sourcebook' },
    { value: 'thesis', label: 'Thesis/Research papers' },
    { value: 'statute', label: 'Statute/Law/Legal Documents' },
    { value: 'guides', label: 'Guides/Manuals' },
    { value: 'reference', label: 'Reference Materials', subcategories: ['Encyclopedia', 'Atlas'] }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Books': styles.darkBlue2,
      'Reports': styles.secondary1Medium,
      'Periodicals': styles.secondary3Medium,
      'Sourcebook': styles.darkBlue1,
      'Thesis/Research papers': styles.secondary1Dark,
      'Statute/Law/Legal Documents': styles.darkBlue4,
      'Guides/Manuals': styles.secondary3Dark,
      'Reference Materials': styles.darkBlue3
    };
    return colors[category] || styles.grey600;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getRankBadgeStyle = (index) => {
    if (index === 0) return { bg: styles.secondary2Medium, color: styles.grey900 };
    if (index === 1) return { bg: styles.grey300, color: styles.grey900 };
    if (index === 2) return { bg: styles.secondary3Light, color: styles.grey900 };
    return { bg: styles.grey100, color: styles.grey700 };
  };

  const renderDownloadItem = (item, index) => {
    const rankStyle = getRankBadgeStyle(index);
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <div
        key={item.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          backgroundColor: styles.grey50,
          borderRadius: '10px',
          border: `2px solid ${styles.grey100}`,
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = styles.white;
          e.currentTarget.style.borderColor = categoryColor;
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = styles.grey50;
          e.currentTarget.style.borderColor = styles.grey100;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Side accent bar */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: categoryColor
        }} />

        {/* Rank Badge */}
        <div style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: rankStyle.bg,
          borderRadius: '8px',
          boxShadow: index < 3 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          border: index === 0 ? `2px solid ${styles.secondary2Dark}` : 'none'
        }}>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '800', 
            color: rankStyle.color,
            letterSpacing: '-0.3px'
          }}>
            {index + 1}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: styles.grey900, 
            fontSize: '14px',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '600',
              color: styles.white,
              backgroundColor: categoryColor,
              padding: '2px 8px',
              borderRadius: '5px',
              letterSpacing: '0.2px'
            }}>
              {item.category}
            </span>
            {item.subcategory && (
              <span style={{ 
                fontSize: '11px', 
                color: styles.grey600,
                fontWeight: '500',
                backgroundColor: styles.grey200,
                padding: '2px 8px',
                borderRadius: '5px'
              }}>
                {item.subcategory}
              </span>
            )}
          </div>
        </div>

        {/* Downloads */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '3px' }}>
            <Download style={{ width: '14px', height: '14px', color: styles.grey400 }} />
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: styles.grey900,
              letterSpacing: '-0.3px'
            }}>
              {formatNumber(item.downloads)}
            </span>
          </div>
          
          {/* Trend */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 6px',
            borderRadius: '5px',
            backgroundColor: item.trend > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: item.trend > 0 ? '#16a34a' : '#dc2626'
          }}>
            <span style={{ fontSize: '12px' }}>{item.trend > 0 ? '↑' : '↓'}</span>
            {Math.abs(item.trend)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ 
        backgroundColor: styles.white, 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative corner accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          backgroundColor: styles.secondary2Light,
          opacity: 0.1,
          borderBottomLeftRadius: '100%',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              backgroundColor: styles.darkBlue1, 
              padding: '10px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: styles.white }} strokeWidth={2.5} />
              <Sparkles style={{ 
                width: '10px', 
                height: '10px', 
                color: styles.secondary2Medium, 
                position: 'absolute',
                top: '3px',
                right: '3px'
              }} />
            </div>
            <div>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: styles.grey900,
                marginBottom: '2px',
                letterSpacing: '-0.3px'
              }}>
                Most Downloaded
              </h2>
              <p style={{ fontSize: '13px', color: styles.grey500, fontWeight: '500' }}>
                Track popular ebooks and resources
              </p>
            </div>
          </div>
          
          {/* Total Downloads Badge */}
          <div style={{ 
            backgroundColor: styles.grey700,
            color: styles.white, 
            padding: '14px 20px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${styles.grey600}`,
            position: 'relative'
          }}>
            <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Total Downloads
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', letterSpacing: '-0.5px' }}>
              {formatNumber(downloadStats.totalDownloads)}
            </div>
            {/* Small accent dot */}
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              backgroundColor: styles.secondary2Medium,
              borderRadius: '50%'
            }} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '20px', 
          paddingBottom: '20px', 
          borderBottom: `2px solid ${styles.grey100}` 
        }}>
          <div style={{ flex: '1', minWidth: '180px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: styles.grey700, 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${styles.grey200}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: styles.grey900,
                backgroundColor: styles.white,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = styles.darkBlue2;
                e.target.style.boxShadow = `0 0 0 3px rgba(15, 97, 247, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.grey200;
                e.target.style.boxShadow = 'none';
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '1', minWidth: '180px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: styles.grey700, 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${styles.grey200}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: styles.grey900,
                backgroundColor: styles.white,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = styles.darkBlue2;
                e.target.style.boxShadow = `0 0 0 3px rgba(15, 97, 247, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.grey200;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {downloadStats.topItems.slice(0, 5).map((item, index) => renderDownloadItem(item, index))}
        </div>

        {/* View All Link */}
        <div style={{ 
          marginTop: '20px', 
          paddingTop: '16px', 
          borderTop: `2px solid ${styles.grey100}`, 
          textAlign: 'center' 
        }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              color: styles.darkBlue2,
              fontWeight: '600',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.grey100;
              e.target.style.color = styles.darkBlue4;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = styles.darkBlue2;
            }}
          >
            View Full Download Report →
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: styles.white,
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: `1px solid ${styles.grey200}`
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: styles.darkBlue1
              }}>
                Full Download Report
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.grey100;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X style={{ width: '24px', height: '24px', color: styles.grey600 }} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {downloadStats.topItems.map((item, index) => renderDownloadItem(item, index))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${styles.grey200}`,
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: styles.white,
                  backgroundColor: styles.darkBlue1,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.darkBlue4;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.darkBlue1;
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MostDownloadedStats;
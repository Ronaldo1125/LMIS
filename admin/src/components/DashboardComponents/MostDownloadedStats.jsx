import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, TrendingUp, Book, Sparkles, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;


function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
}

const MostDownloadedStats = ({ dark }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadStats, setDownloadStats] = useState({
    totalDownloads: 0,
    topItems: []
  });

  const categoryDropdownRef = useRef(null);
  const timeRangeDropdownRef = useRef(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_BASE_URL}/uploads/meta/statistics`, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setDownloadStats({
          totalDownloads: data.summary?.totalDownloads ?? 0,
          topItems: (data.topDownloads ?? []).map(item => ({
            id: item.id,
            title: item.book_title,
            category: item.book_category,
            subcategory: null,
            downloads: item.download_count,
            trend: 0
          }))
        });
      } catch (err) {
        console.error('[MostDownloadedStats] Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ── Brand Colors ──────────────────────────────────────────
  const brand = {
    darkBlue1: '#154A9A', darkBlue2: '#0F61F7',
    darkBlue3: '#0248D4', darkBlue4: '#0032A6',
    secondary1Medium: '#3F1BD2', secondary1Dark: '#2D0CB4',
    secondary2Light: '#FFDA3C', secondary2Medium: '#FFD002', secondary2Dark: '#FFCF00',
    secondary3Light: '#FFBB3C', secondary3Medium: '#FFA602', secondary3Dark: '#FFA500',
  };

  // ── Dark mode color system ────────────────────────────────
  const C = {
    cardBg:        dark ? '#0f1f38' : '#ffffff',
    cardBorder:    dark ? '#1a3356' : 'transparent',
    insetBg:       dark ? '#081422' : '#f9fafb',
    insetBorder:   dark ? '#1a3356' : '#e5e7eb',
    inputBg:       dark ? '#081422' : '#ffffff',
    inputBorder:   dark ? '#1a3356' : '#e5e7eb',
    inputText:     dark ? '#dde8f5' : '#111827',
    dropdownBg:    dark ? '#0f1f38' : '#ffffff',
    dropdownHover: dark ? '#0d1d35' : '#f9fafb',
    textPrimary:   dark ? '#dde8f5' : '#111827',
    textSecondary: dark ? '#6b8cae' : '#6b7280',
    textMuted:     dark ? '#2e4d70' : '#9ca3af',
    labelColor:    dark ? '#2e4d70' : '#374151',
    divider:       dark ? '#1a3356' : '#e5e7eb',
    subcatBg:      dark ? '#1a3356' : '#e5e7eb',
    subcatText:    dark ? '#6b8cae' : '#4b5563',
    totalBg:       dark ? '#1a3356' : '#374151',
    totalBorder:   dark ? '#2e4d70' : '#4b5563',
    iconColor:     dark ? '#9ca3af' : '#9ca3af',
    accentDot:     brand.secondary2Medium,
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

  const timeRanges = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' }
  ];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setIsCategoryOpen(false); setIsTimeRangeOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!categoryDropdownRef.current?.contains(event.target)) setIsCategoryOpen(false);
      if (!timeRangeDropdownRef.current?.contains(event.target)) setIsTimeRangeOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Books': brand.darkBlue2,
      'Reports': brand.secondary1Medium,
      'Periodicals': brand.secondary3Medium,
      'Sourcebook': brand.darkBlue1,
      'Thesis/Research papers': brand.secondary1Dark,
      'Statute/Law/Legal Documents': brand.darkBlue4,
      'Guides/Manuals': brand.secondary3Dark,
      'Reference Materials': brand.darkBlue3
    };
    return colors[category] || '#6b7280';
  };

  const formatNumber = (num) => Number(num).toLocaleString();

  const getRankBadgeStyle = (index) => {
    if (index === 0) return { bg: brand.secondary2Medium, color: '#111827' };
    if (index === 1) return { bg: dark ? '#2e4d70' : '#d1d5db', color: dark ? '#dde8f5' : '#111827' };
    if (index === 2) return { bg: dark ? 'rgba(255,166,2,0.25)' : brand.secondary3Light, color: dark ? '#fdba74' : '#111827' };
    return { bg: dark ? '#1a3356' : '#f3f4f6', color: dark ? '#6b8cae' : '#374151' };
  };

  const getCategoryLabel = (value) => categories.find(cat => cat.value === value)?.label ?? 'All Categories';
  const getTimeRangeLabel = (value) => timeRanges.find(tr => tr.value === value)?.label ?? 'Last Month';

  const dropdownStyle = {
    position: 'absolute', zIndex: 20, marginTop: '0.5rem',
    width: '100%', borderRadius: '0.5rem',
    border: `1px solid ${C.inputBorder}`,
    background: C.dropdownBg,
    boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'background 0.45s ease',
  };

  const renderDownloadItem = (item, index) => {
    const rankStyle = getRankBadgeStyle(index);
    const categoryColor = getCategoryColor(item.category);

    return (
      <div
        key={item.id}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.875rem',
          background: C.insetBg,
          borderRadius: '0.625rem',
          border: `2px solid ${C.insetBorder}`,
          position: 'relative', overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = dark ? '#0d1d35' : '#ffffff';
          e.currentTarget.style.borderColor = categoryColor;
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = dark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.insetBg;
          e.currentTarget.style.borderColor = C.insetBorder;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Side accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: categoryColor }} />

        {/* Rank Badge */}
        <div style={{
          flexShrink: 0, width: '2.25rem', height: '2.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: rankStyle.bg, borderRadius: '0.5rem',
          boxShadow: index < 3 ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
          border: index === 0 ? `2px solid ${brand.secondary2Dark}` : 'none',
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: rankStyle.color, letterSpacing: '-0.3px' }}>
            {index + 1}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontWeight: 600, color: C.textPrimary, fontSize: '0.875rem',
            marginBottom: '0.25rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            transition: 'color 0.45s ease',
          }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 600, color: '#ffffff',
              background: categoryColor, padding: '2px 8px', borderRadius: '0.3rem', letterSpacing: '0.2px'
            }}>
              {item.category}
            </span>
            {item.subcategory && (
              <span style={{
                fontSize: '0.6875rem', fontWeight: 500,
                color: C.subcatText, background: C.subcatBg,
                padding: '2px 8px', borderRadius: '0.3rem',
                transition: 'background 0.45s ease, color 0.45s ease',
              }}>
                {item.subcategory}
              </span>
            )}
          </div>
        </div>

        {/* Downloads + Trend */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
            <Download style={{ width: '0.875rem', height: '0.875rem', color: C.iconColor }} />
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.3px', transition: 'color 0.45s ease' }}>
              {formatNumber(item.downloads)}
            </span>
          </div>
          {item.trend !== 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
              fontSize: '0.6875rem', fontWeight: 700,
              padding: '3px 6px', borderRadius: '0.3rem',
              background: item.trend > 0
                ? (dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)')
                : (dark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.1)'),
              color: item.trend > 0
                ? (dark ? '#86efac' : '#16a34a')
                : (dark ? '#fca5a5' : '#dc2626'),
            }}>
              <span>{item.trend > 0 ? '↑' : '↓'}</span>
              {Math.abs(item.trend)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  const FilterDropdown = ({ label, value, isOpen, onToggle, options, onSelect, getLabel, dropRef }) => (
    <div style={{ flex: 1, minWidth: '180px' }} ref={dropRef}>
      <label style={{
        display: 'block', fontSize: '0.6875rem', fontWeight: 600,
        color: C.labelColor, marginBottom: '0.375rem',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        transition: 'color 0.45s ease',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: '100%', padding: '0.625rem 0.75rem',
            border: `2px solid ${C.inputBorder}`, borderRadius: '0.5rem',
            fontSize: '0.875rem', fontWeight: 500,
            color: C.inputText, background: C.inputBg,
            cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getLabel(value)}
          </span>
          <span style={{ color: C.textMuted, marginLeft: '0.5rem' }}>▾</span>
        </button>
        {isOpen && (
          <div style={dropdownStyle}>
            <div style={{ maxHeight: '16rem', overflowY: 'auto', padding: '0.5rem 0', fontSize: '0.875rem' }}>
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSelect(opt.value)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '0.5rem 1rem',
                    background: 'transparent', color: C.inputText,
                    border: 'none', cursor: 'pointer', fontWeight: 500,
                    outline: 'none', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.dropdownHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const LoadingPlaceholder = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          height: '4.5rem', borderRadius: '0.625rem',
          background: dark ? '#0d1d35' : '#f3f4f6',
          border: `2px solid ${C.insetBorder}`,
          animation: 'pulse 1.5s ease-in-out infinite',
          opacity: 1 - i * 0.15,
        }} />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '2rem', color: C.textSecondary }}>
      <Download style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem', opacity: 0.4 }} />
      <p style={{ margin: 0, fontWeight: 500 }}>No download data available</p>
    </div>
  );

  return (
    <>
      <div style={{
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: '0.75rem',
        boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: brand.darkBlue1, padding: '0.625rem', borderRadius: '0.625rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#ffffff' }} strokeWidth={2.5} />
              <Sparkles style={{ width: '0.625rem', height: '0.625rem', color: brand.secondary2Medium, position: 'absolute', top: '3px', right: '3px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: C.textPrimary, marginBottom: '2px', letterSpacing: '-0.3px', transition: 'color 0.45s ease' }}>
                Most Downloaded
              </h2>
              <p style={{ fontSize: '0.8125rem', color: C.textSecondary, fontWeight: 500, margin: 0, transition: 'color 0.45s ease' }}>
                Track popular ebooks and resources
              </p>
            </div>
          </div>

          {/* Total Downloads — stat beside title */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.875rem', borderRadius: '2rem',
            background: dark ? 'rgba(15,97,247,0.12)' : 'rgba(15,97,247,0.07)',
            border: `1px solid ${dark ? 'rgba(15,97,247,0.25)' : 'rgba(15,97,247,0.18)'}`,
          }}>
            <Download style={{ width: '0.8rem', height: '0.8rem', color: brand.darkBlue2, flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: dark ? '#93c5fd' : brand.darkBlue2, letterSpacing: '-0.01em' }}>
              {loading ? '—' : formatNumber(downloadStats.totalDownloads)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: dark ? '#4d7aaa' : '#6b8cae', fontWeight: 500 }}>
              total downloads
            </span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: `2px solid ${C.divider}` }}>
          <FilterDropdown
            label="Category"
            value={selectedCategory}
            isOpen={isCategoryOpen}
            onToggle={() => { setIsCategoryOpen(!isCategoryOpen); setIsTimeRangeOpen(false); }}
            options={categories}
            onSelect={(v) => { setSelectedCategory(v); setIsCategoryOpen(false); }}
            getLabel={getCategoryLabel}
            dropRef={categoryDropdownRef}
          />
          <FilterDropdown
            label="Time Range"
            value={timeRange}
            isOpen={isTimeRangeOpen}
            onToggle={() => { setIsTimeRangeOpen(!isTimeRangeOpen); setIsCategoryOpen(false); }}
            options={timeRanges}
            onSelect={(v) => { setTimeRange(v); setIsTimeRangeOpen(false); }}
            getLabel={getTimeRangeLabel}
            dropRef={timeRangeDropdownRef}
          />
        </div>

        {/* Stats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {loading
            ? <LoadingPlaceholder />
            : downloadStats.topItems.length === 0
              ? <EmptyState />
              : downloadStats.topItems.slice(0, 5).map((item, index) => renderDownloadItem(item, index))
          }
        </div>

        {/* View All */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: `2px solid ${C.divider}`, textAlign: 'center' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              color: brand.darkBlue2, fontWeight: 600, fontSize: '0.875rem',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.background = dark ? '#1a3356' : '#e5e7eb'; e.target.style.color = brand.darkBlue4; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = brand.darkBlue2; }}
          >
            View Full Download Report →
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: C.cardBg,
              border: dark ? `1px solid ${C.cardBorder}` : 'none',
              borderRadius: '1rem',
              boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 20px 40px rgba(0,0,0,0.15)',
              maxWidth: '1200px', width: '100%', maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              transition: 'background 0.45s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: `1px solid ${C.divider}` }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: dark ? '#dde8f5' : brand.darkBlue1, margin: 0 }}>
                Full Download Report
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1a3356' : '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X style={{ width: '1.5rem', height: '1.5rem', color: C.textSecondary }} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {loading
                  ? <LoadingPlaceholder />
                  : downloadStats.topItems.length === 0
                    ? <EmptyState />
                    : downloadStats.topItems.map((item, index) => renderDownloadItem(item, index))
                }
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${C.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.625rem 1rem', borderRadius: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 600,
                  color: '#ffffff', background: brand.darkBlue1,
                  border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = brand.darkBlue4}
                onMouseLeave={e => e.currentTarget.style.background = brand.darkBlue1}
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
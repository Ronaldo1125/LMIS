import { useState, useMemo, useEffect } from 'react';
import { BookMarked, AlertCircle } from 'lucide-react';
import ViewToggle from './AcquisitionsComponents/ViewToggle';
import SortControls from './AcquisitionsComponents/SortControls';
import SearchBar from './AcquisitionsComponents/SearchBar';
import AcquisitionsList from './AcquisitionsComponents/AcquisitionsList';
import AcquisitionsGrid from './AcquisitionsComponents/AcquisitionsGrid';
import api from '../utils/api';

const Acquisitions = ({ dark }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [acquisitionsData, setAcquisitionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageBg        = dark ? '#0a1628' : '#f1f5f9'
  const headerBg      = dark ? '#0d1d35' : '#ffffff'
  const headerBorder  = dark ? '#1a3356' : '#e2e8f0'
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const border        = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'
  const errorText     = dark ? '#fca5a5' : '#dc2626'

  useEffect(() => {
    const fetchAcquisitions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/acquisitions');
        const transformedData = response.data.data.map(item => ({
          id: item.id,
          accession_no: item.accession_no,
          date_accessioned: item.date_accessioned,
          title: item.title,
          author: item.author,
          editor: item.editor,
          edition: item.edition,
          publication: item.publication,
          publisher: item.publisher,
          date_of_publication: item.date_of_publication,
          isbn: item.isbn,
          issn: item.issn,
          subjects: item.subjects,
          extent: item.extent,
          dimensions: item.dimensions,
          other_physical_details: item.other_physical_details,
          accompanying_material: item.accompanying_material,
          notes_area: item.notes_area,
          upload_count: item.upload_count,
          upload_id: item.upload_id ?? null,   // ← passed to AcquisitionCard for PDF thumbnail
          acquisitionDate: item.date_accessioned,
        }));
        setAcquisitionsData(transformedData);
      } catch (err) {
        console.error('Error fetching acquisitions:', err);
        setError(err.response?.data?.message || 'Failed to load acquisitions');
      } finally {
        setLoading(false);
      }
    };
    fetchAcquisitions();
  }, []);

  const filteredAndSortedAcquisitions = useMemo(() => {
    let filtered = acquisitionsData;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = acquisitionsData.filter(book =>
      (book.title?.toLowerCase().includes(query) ?? false) ||
      (book.author?.toLowerCase().includes(query) ?? false) ||
      (book.accession_no?.toLowerCase().includes(query) ?? false)
    );
    }
    const sorted = [...filtered];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.acquisitionDate);
        const dateB = new Date(b.acquisitionDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    return sorted;
  }, [acquisitionsData, sortBy, sortOrder, searchQuery]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchQuery) setSearchQuery('');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.45s ease' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '3rem', height: '3rem', borderRadius: '50%', border: '2px solid transparent', borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
          <p style={{ color: textSecondary, margin: 0 }}>Loading acquisitions...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.45s ease' }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '2.5rem', maxWidth: '28rem', textAlign: 'center', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.06)' }}>
          <AlertCircle style={{ width: '3rem', height: '3rem', color: errorText, margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, margin: '0 0 0.5rem' }}>Error Loading Data</h2>
          <p style={{ color: textSecondary, margin: '0 0 1.25rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1.5rem', background: iconColor, color: '#ffffff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <BookMarked style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>
              Recent Acquisitions
            </h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              {filteredAndSortedAcquisitions.length}{' '}
              {filteredAndSortedAcquisitions.length === 1 ? 'book' : 'books'}
              {searchQuery && ' found'} • Last 15 Acquisitions
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="px-6">
        {/* Sticky Controls */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: pageBg, paddingTop: '1rem', paddingBottom: '1rem',
          transition: 'background 0.45s ease',
        }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <SortControls sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} dark={dark} />
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} dark={dark} />
          </div>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} dark={dark} />
        </div>

        {/* Content */}
        <div>
          {filteredAndSortedAcquisitions.length > 0 ? (
            viewMode === 'grid'
              ? <AcquisitionsGrid acquisitions={filteredAndSortedAcquisitions} dark={dark} />
              : <AcquisitionsList acquisitions={filteredAndSortedAcquisitions} dark={dark} />
          ) : (
            <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '4rem', textAlign: 'center', transition: 'background 0.45s ease, border-color 0.45s ease' }}>
              <p style={{ color: textSecondary, fontSize: '1rem', margin: 0 }}>
                {searchQuery ? `No books found matching "${searchQuery}"` : 'No acquisitions in the last 14 days'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: iconColor, color: '#ffffff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Acquisitions;
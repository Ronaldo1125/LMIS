import React, { useState, useEffect, useMemo } from 'react'
import api from '../../utils/api'
import { 
  XMarkIcon, 
  ArrowUturnLeftIcon, 
  EyeIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  InboxStackIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  InformationCircleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'

/**
 * ARCHIVES PROTOCOL MODAL (Long-Form Edition)
 * A high-fidelity "Steel-and-Glass" interface for managing decommissioned records.
 * Supports: Search Filtering, Audit Trail Visualization, and Record Reintegration.
 */
const ArchivesModal = ({ isOpen, onClose, onRestore, dark = true }) => {
  const [archivedBooks, setArchivedBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // ── System Theme Configuration ──────────────────────────────
  const theme = {
    overlay: 'bg-black/80 backdrop-blur-md',
    container: dark ? 'bg-[#0a1628] border-[#1e2d45]' : 'bg-white border-slate-200',
    header: dark ? 'bg-[#0d1d35] border-[#1e2d45]' : 'bg-slate-50 border-slate-200',
    card: dark ? 'bg-[#112240] border-[#1e2d45]' : 'bg-slate-50 border-slate-200',
    input: dark ? 'bg-[#0d1d35] border-[#1e2d45] text-white focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600',
    textMuted: dark ? 'text-slate-500' : 'text-slate-400',
    textHighlight: dark ? 'text-blue-400' : 'text-blue-600',
    badge: dark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
  }

  useEffect(() => {
    if (isOpen) {
      fetchArchivedBooks()
    } else {
      // Reset state on close to prevent data leakage
      setSearchQuery('')
      setShowDetails(false)
      setSelectedBook(null)
    }
  }, [isOpen])

  const fetchArchivedBooks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/books', {
        params: { showArchived: 'true', limit: 200 }
      })
      // Ensure we handle potential null returns
      setArchivedBooks(response.data.books || [])
    } catch (err) {
      setError('CRITICAL_SYNC_FAILURE: Failed to interface with Archive Repository.')
    } finally {
      setLoading(false)
    }
  }

  // ── Search & Filter Logic ──────────────────────────────────
  const filteredArchives = useMemo(() => {
    if (!searchQuery) return archivedBooks
    const q = searchQuery.toLowerCase()
    return archivedBooks.filter(b => 
      b.title?.toLowerCase().includes(q) || 
      b.isbn?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    )
  }, [searchQuery, archivedBooks])

  const handleRestoreAction = async (id, e) => {
    if (e) e.stopPropagation()
    try {
      await onRestore(id)
      fetchArchivedBooks() // Refresh pipeline
      if (showDetails) setShowDetails(false)
    } catch (err) {
      setError('PROTOCOL_ERROR: Reintegration sequence failed.')
    }
  }

  const renderValue = (val) => (val && val !== '' ? val : <span className="opacity-30 italic">Not Recorded</span>)

  if (!isOpen) return null

  // ── VIEW: RECORD AUDIT (Detail) ───────────────────────────
  const DetailView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Archive Header Metadata */}
      <div className={`p-6 rounded-3xl border-2 border-dashed ${theme.badge}`}>
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheckIcon className="w-6 h-6" />
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Decommission Protocol Log</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold opacity-60 uppercase">Archived Date</p>
            <p className="text-sm font-mono font-bold">
              {new Date(selectedBook.archived_at).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold opacity-60 uppercase">Authorized Officer</p>
            <p className="text-sm font-bold flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> {selectedBook.archived_by || 'System Admin'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold opacity-60 uppercase">Integrity Status</p>
            <p className="text-sm font-bold text-green-500">ReadOnly / Dormant</p>
          </div>
          <div className="md:col-span-3 pt-4 border-t border-current border-opacity-10">
            <p className="text-[10px] font-bold opacity-60 uppercase mb-2">Statement of Reason</p>
            <p className="text-sm italic leading-relaxed">
              "{selectedBook.archive_reason || 'No specific justification log provided by the operator.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Book Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
        {[
          { icon: <BookOpenIcon className="w-4 h-4" />, label: 'Title / Monograph', value: selectedBook.title },
          { icon: <UserIcon className="w-4 h-4" />, label: 'Principal Author', value: selectedBook.author },
          { icon: <InformationCircleIcon className="w-4 h-4" />, label: 'Classification', value: selectedBook.category },
          { icon: <ArrowsRightLeftIcon className="w-4 h-4" />, label: 'Call Number', value: selectedBook.call_number },
          { icon: <InboxStackIcon className="w-4 h-4" />, label: 'ISBN Identifier', value: selectedBook.isbn },
          { icon: <ClockIcon className="w-4 h-4" />, label: 'Edition/Date', value: `${selectedBook.edition || ''} ${selectedBook.date_of_publication || ''}` },
        ].map((field, idx) => (
          <div key={idx} className="group border-b border-slate-700/30 pb-3">
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-2 ${theme.textMuted}`}>
              {field.icon}
              {field.label}
            </div>
            <div className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>
              {renderValue(field.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Footer Actions */}
      <div className="pt-8 flex justify-between items-center border-t border-slate-700/30">
        <button
          onClick={() => setShowDetails(false)}
          className={`px-6 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${theme.input}`}
        >
          Back to Terminal
        </button>
        <button
          onClick={() => handleRestoreAction(selectedBook.id)}
          className="flex items-center gap-3 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowUturnLeftIcon className="w-4 h-4 stroke-[3px]" />
          Execute Reintegration
        </button>
      </div>
    </div>
  )

  // ── VIEW: ARCHIVE TERMINAL (List) ─────────────────────────
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.overlay}`} onClick={onClose}>
      <div 
        className={`w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${theme.container}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className={`px-10 py-8 border-b flex items-center justify-between ${theme.header}`}>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ArchiveBoxIcon className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className={`text-2xl font-black tracking-tighter ${dark ? 'text-white' : 'text-slate-900'}`}>
                {showDetails ? 'RECORD_AUDIT' : 'ARCHIVE_TERMINAL'}
              </h2>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.textMuted}`}>
                {showDetails ? `SERIAL: ${selectedBook.id}` : `SCANNING: ${archivedBooks.length} DORMANT OBJECTS`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-3 rounded-2xl transition-all hover:rotate-90 ${dark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Global Search Bar (Only in List View) */}
        {!showDetails && (
          <div className={`px-10 py-5 border-b flex items-center gap-4 ${dark ? 'bg-[#0c1a2e]' : 'bg-slate-50'}`}>
            <MagnifyingGlassIcon className={`w-5 h-5 ${theme.textMuted}`} />
            <input 
              type="text"
              placeholder="Filter by Title, ISBN, or Author..."
              className={`flex-1 bg-transparent border-none outline-none text-sm font-semibold tracking-tight ${dark ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Dynamic Content Body */}
        <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-in shake-1 duration-300">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <p className="text-xs font-black text-red-500 uppercase tracking-widest">{error}</p>
            </div>
          )}

          {showDetails ? (
            <DetailView />
          ) : (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.4em] animate-pulse ${theme.textMuted}`}>Establishing Pipeline...</p>
                </div>
              ) : filteredArchives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                  <InboxStackIcon className="w-20 h-20 mb-6" />
                  <p className="text-lg font-black uppercase tracking-widest">No Matches Found</p>
                  <p className="text-sm font-medium">Repository search returned zero records.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredArchives.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => { setSelectedBook(book); setShowDetails(true); }}
                      className={`group flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer ${theme.card} hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1`}
                    >
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`text-base font-bold truncate group-hover:text-blue-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
                            {renderValue(book.title)}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${theme.badge}`}>
                            {book.category || 'GENERAL'}
                          </span>
                        </div>
                        <div className={`flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium ${theme.textMuted}`}>
                          <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" /> {renderValue(book.author)}</span>
                          <span className="opacity-30">|</span>
                          <span className="font-mono">ID: {book.id}</span>
                          {book.archived_at && (
                            <>
                              <span className="opacity-30">|</span>
                              <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {new Date(book.archived_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pr-4">
                          <p className={`text-[9px] font-black uppercase tracking-tighter ${theme.textMuted}`}>Deep Scan</p>
                          <p className="text-[10px] font-bold text-blue-500">View Protocol</p>
                        </div>
                        <button
                          onClick={(e) => handleRestoreAction(book.id, e)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-90 ${
                            dark 
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <ArrowUturnLeftIcon className="w-3 h-3 stroke-[3px]" />
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Global Footer */}
        {!showDetails && (
          <div className={`px-10 py-6 border-t flex items-center justify-between ${theme.header}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>
              Repository: <span className={theme.textHighlight}>Cloud_Archive_V4</span>
            </p>
            <button
              onClick={onClose}
              className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border ${theme.input}`}
            >
              Terminate Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArchivesModal
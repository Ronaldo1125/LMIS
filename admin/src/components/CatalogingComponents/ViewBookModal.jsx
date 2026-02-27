import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  Download, 
  FileText, 
  File, 
  CheckCircle, 
  Loader, 
  Clock, 
  Database, 
  HardDrive,Tag, Hash, BookText, User, UserCog, Layers, MapPin, 
  Building2, Calendar, Maximize, Info, 
  PackagePlus, Barcode, Globe, Copy, Key, StickyNote

} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── BookFilesViewer (Embedded with Dark Mode) ───────────────────────────────

const BookFilesViewer = ({ bookId, dark }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState({})

  // Theme Constants
  const textPrimary = dark ? 'text-[#dde8f5]' : 'text-slate-900'
  const textSecondary = dark ? 'text-[#6b8cae]' : 'text-slate-500'
  const rowBg = dark ? 'bg-[#162a4a]/50' : 'bg-slate-50'
  const rowBorder = dark ? 'border-[#1a3356]' : 'border-slate-200'

  useEffect(() => {
    if (bookId) fetchFiles()
  }, [bookId])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFiles(response.data)
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (uploadId, fileName) => {
    setDownloading((prev) => ({ ...prev, [uploadId]: true }))
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/${uploadId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      fetchFiles()
    } catch (err) {
      console.error('Error downloading file:', err)
      alert(err.response?.data?.message || 'Error downloading file')
    } finally {
      setDownloading((prev) => ({ ...prev, [uploadId]: false }))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    const iconClass = 'w-6 h-6'
    switch (fileType?.toLowerCase()) {
      case 'pdf': return <FileText className={`${iconClass} text-red-400`} />
      case 'epub': return <FileText className={`${iconClass} text-blue-400`} />
      case 'mobi':
      case 'azw3': return <FileText className={`${iconClass} text-orange-400`} />
      case 'djvu': return <File className={`${iconClass} text-purple-400`} />
      default: return <File className={`${iconClass} text-slate-400`} />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className={`text-sm font-medium ${textSecondary}`}>Scanning digital repository...</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className={`text-center py-10 rounded-xl border-2 border-dashed ${rowBorder} ${textSecondary} text-sm`}>
        No digital assets currently linked to this record.
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}>
          <HardDrive className="w-4 h-4 text-blue-500" />
          Digital Assets ({files.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl transition-all hover:shadow-lg ${rowBg} ${rowBorder}`}
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className={`p-3 rounded-xl ${dark ? 'bg-[#0d1d35]' : 'bg-white shadow-sm'} border ${rowBorder}`}>
                {getFileIcon(file.file_type)}
              </div>
              
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <p className={`text-sm font-bold truncate ${textPrimary}`}>
                    {file.original_name}
                  </p>
                  {file.is_primary && (
                    <span className="flex-shrink-0 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                      Primary
                    </span>
                  )}
                </div>
                
                <div className={`flex items-center space-x-3 text-[11px] mt-1 font-medium ${textSecondary} flex-wrap`}>
                  <span className="flex items-center gap-1 uppercase tracking-tight">
                    <Database className="w-3 h-3" /> {formatFileSize(file.file_size)}
                  </span>
                  <span className="opacity-30">|</span>
                  <span className="uppercase">{file.file_type}</span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(file.upload_date)}
                  </span>
                  {file.download_count > 0 && (
                    <>
                      <span className="opacity-30">|</span>
                      <span className="text-blue-400">
                        {file.download_count} download{file.download_count !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(file.id, file.original_name)}
              disabled={downloading[file.id]}
              className={`mt-4 sm:mt-0 flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100 text-sm font-bold`}
            >
              {downloading[file.id] ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ViewBookModal (Long-form with Dark Mode) ──────────────────────────────────

const ViewBookModal = ({ isOpen, onClose, book, dark }) => {
  if (!isOpen || !book) return null

  // Theme Constants
  const modalBg = dark ? 'bg-[#0f1f38]' : 'bg-white'
  const headerBg = dark ? 'bg-[#0d1d35]' : 'bg-slate-50'
  const borderCol = dark ? 'border-[#1a3356]' : 'border-slate-200'
  const textPrimary = dark ? 'text-[#dde8f5]' : 'text-slate-900'
  const textSecondary = dark ? 'text-[#6b8cae]' : 'text-slate-500'
  const accentText = dark ? 'text-blue-400' : 'text-blue-600'

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return value
  }

  const details = [
    { label: 'Classification', value: book.category, icon: Tag },
    { label: 'Call Number', value: book.call_number, icon: Hash },
    { label: 'Full Title', value: book.title, fullWidth: true, icon: BookText },
    { label: 'Author', value: book.author, icon: User },
    { label: 'Editor', value: book.editor, icon: UserCog },
    { label: 'Edition', value: book.edition, icon: Layers },
    { label: 'Place of Publication', value: book.publication, icon: MapPin },
    { label: 'Publisher', value: book.publisher, icon: Building2 },
    { label: 'Date Published', value: book.date_of_publication, icon: Calendar },
    { label: 'Extent / Pages', value: book.extent, icon: FileText },
    { label: 'Dimensions', value: book.dimensions, icon: Maximize },
    { label: 'Physical Details', value: book.other_physical_details, icon: Info },
    { label: 'Accompanying Material', value: book.accompanying_material, icon: PackagePlus },
    { label: 'ISBN (Standard #)', value: book.isbn, icon: Barcode },
    { label: 'ISSN', value: book.issn, icon: Globe },
    { label: 'Total Copies', value: book.copies, icon: Copy },
    { label: 'Subjects / Keywords', value: book.subjects, fullWidth: true, icon: Key },
    { label: 'Notes Area', value: book.notes_area, fullWidth: true, icon: StickyNote },
]
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden"
      onClick={onClose}
    >
      <div
        className={`${modalBg} ${borderCol} border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 ${headerBg} border-b ${borderCol} px-8 py-5 flex items-center justify-between rounded-t-2xl z-10`}>
          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl font-bold tracking-tight truncate ${textPrimary}`}>
              Resource Overview
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className={`text-[11px] font-black uppercase tracking-widest ${accentText}`}>System Catalog ID:</span>
               <span className={`text-[11px] font-mono ${textSecondary}`}>{book.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-slate-500/10 rounded-xl transition-all ${textSecondary}`}
            aria-label="Close"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
          {/* Metadata Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {details.map((item) => (
                <div 
                  key={item.label} 
                  className={`${item.fullWidth ? 'md:col-span-2' : ''} border-b ${borderCol} pb-4`}
                >
                  {/* NEW CODE */}
            <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-2 ${textSecondary} flex items-center gap-2`}>
            <item.icon className="w-4 h-4 opacity-70" strokeWidth={2.5} /> 
              {item.label}
                </p>
                  <p className={`text-sm font-semibold leading-relaxed ${textPrimary}`}>
                    {renderValue(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Digital Files Section */}
          <section className={`pt-8 border-t ${borderCol}`}>
            <BookFilesViewer bookId={book.id} dark={dark} />
          </section>
        </div>

        {/* Footer */}
        <div className={`px-8 py-5 ${headerBg} border-t ${borderCol} flex justify-end rounded-b-2xl`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-8 py-2.5 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
              dark 
                ? 'bg-[#162a4a] text-slate-300 border-[#1a3356] hover:bg-[#1a3356]' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Close Viewport
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewBookModal
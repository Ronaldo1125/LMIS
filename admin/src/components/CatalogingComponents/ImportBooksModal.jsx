import React, { useState, useRef, useEffect } from 'react'
import api from '../../utils/api' 
import { 
  FileSpreadsheet, 
  UploadCloud, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  FileWarning, 
  Loader2,
  Database
} from 'lucide-react'

/**
 * ImportBooksModal
 * Long-form version with high-fidelity "Steel" aesthetic and Dark Mode support.
 */
const ImportBooksModal = ({ isOpen, onClose, onImported, dark }) => {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // ── Theme Configuration ────────────────────────────────────
  const theme = {
    overlay: 'bg-black/60 backdrop-blur-md',
    container: dark ? 'bg-[#0f1f38] border-[#1a3356]' : 'bg-white border-slate-200',
    header: dark 
      ? 'bg-gradient-to-br from-[#0d1d35] to-[#162a4a]' 
      : 'bg-gradient-to-br from-[#1e3a5f] to-[#2d5986]',
    textPrimary: dark ? 'text-[#dde8f5]' : 'text-slate-900',
    textSecondary: dark ? 'text-[#6b8cae]' : 'text-slate-500',
    dropzone: {
      base: dark ? 'bg-[#0d1d35]/50 border-[#1a3356]' : 'bg-slate-50 border-slate-200',
      active: dark ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-400',
    },
    card: dark ? 'bg-[#162a4a]/50 border-[#1a3356]' : 'bg-slate-50 border-slate-200',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20',
    buttonSecondary: dark ? 'bg-slate-800 text-slate-300 border-[#1a3356]' : 'bg-white text-slate-700 border-slate-200'
  }

  useEffect(() => {
    if (!isOpen) resetState()
  }, [isOpen])

  const resetState = () => {
    setFile(null)
    setResult(null)
    setError('')
    setLoading(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  // ── File Selection Logic ───────────────────────────────────
  const pickFile = (f) => {
    const isExcel = f.name.match(/\.(xlsx|xls)$/i)
    if (!isExcel) {
      setError('System validation failed: File must be in .xlsx or .xls format.')
      setFile(null)
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit for bulk processing.')
      setFile(null)
      return
    }
    setError('')
    setResult(null)
    setFile(f)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    else setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) pickFile(droppedFile)
  }

  // ── API Integration ────────────────────────────────────────
  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/books/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setResult(response.data)
      onImported?.()
    } catch (err) {
      setError(err.response?.data?.message || 'The server encountered an error processing the spreadsheet.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.overlay}`}
      onClick={handleClose}
    >
      <div 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${theme.container}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-8 py-6 flex items-center justify-between ${theme.header}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight"> Import Excel Files</h2>
              
            </div>
          </div>
          <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6">
          
          {/* 1. SUCCESS SUMMARY */}
          {result && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className={`rounded-2xl border p-6 ${dark ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3 text-green-500 mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg font-bold">Import Sequence Complete</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Scanned', value: result.imported, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Committed', value: result.inserted, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Conflicts', value: result.skipped, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl p-4 text-center border border-white/5 ${stat.bg}`}>
                      <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${theme.textSecondary}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {result.skippedDetails?.length > 0 && (
                  <div className={`mt-6 pt-6 border-t ${dark ? 'border-green-500/10' : 'border-green-200'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${theme.textSecondary}`}>
                      Conflict Logs
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {result.skippedDetails.map((s, i) => (
                        <div key={i} className={`flex items-center gap-3 text-[11px] font-medium p-2 rounded-lg ${dark ? 'bg-black/20' : 'bg-white/50'}`}>
                          <FileWarning className="w-3 h-3 text-amber-500" />
                          <span className={theme.textPrimary}>Row {s.row}:</span>
                          <span className={theme.textSecondary}>{s.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ERROR MESSAGE */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 animate-in shake-1 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-medium text-red-500">{error}</p>
            </div>
          )}

          {/* 3. DROP ZONE */}
          {!result && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group flex flex-col items-center justify-center py-12 px-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                isDragging ? theme.dropzone.active : theme.dropzone.base
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={(e) => pickFile(e.target.files?.[0])} 
                className="hidden" 
              />
              
              {file ? (
                <div className="text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className={`text-sm font-bold ${theme.textPrimary}`}>{file.name}</h4>
                  <p className={`text-xs font-medium mt-1 ${theme.textSecondary}`}>
                    {(file.size / 1024).toFixed(1)} KB • Ready for extraction
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 underline underline-offset-4"
                  >
                    Discard Selection
                  </button>
                </div>
              ) : (
                <>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-blue-500' : theme.textSecondary}`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
                      Drop spreadsheet or click to browse
                    </p>
                    
                  </div>
                  <div className="mt-6 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${theme.buttonSecondary}`}>
                      Max 10MB
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${theme.buttonSecondary}`}>
                      Auto-Mapping
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 4. DATA MAPPING HINT */}
          {!result && (
            <div className={`p-5 rounded-2xl border ${theme.card}`}>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-blue-500" />
                <h4 className={`text-xs font-black uppercase tracking-widest ${theme.textPrimary}`}>
                  Required Header Mapping
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Call No.', 'Title', 'Author', 'Publisher', 
                  'Date of Publication', 'ISBN/ISSN', 'Copies'
                ].map((col) => (
                  <div key={col} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono ${dark ? 'bg-black/30 border-white/5 text-blue-400' : 'bg-white border-slate-200 text-blue-600'}`}>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    {col}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
                  Our engine automatically detects and cleans your data. Blank rows, section headers, and unmapped columns will be ignored during the transaction.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-8 py-6 border-t flex items-center justify-between ${theme.container}`}>
          <div className="flex items-center gap-2">
            {loading && (
              <div className="flex items-center gap-2 text-blue-500 text-xs font-bold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Pipeline...
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${theme.buttonSecondary}`}
            >
              {result ? 'Dismiss' : 'Cancel'}
            </button>
            {!result && (
              <button
                onClick={handleImport}
                disabled={!file || loading}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${theme.buttonPrimary}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing Import
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Upload Data                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportBooksModal
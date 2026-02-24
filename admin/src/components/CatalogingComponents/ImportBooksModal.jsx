import { useState, useRef } from 'react'
import api from '../../utils/api' // ✅ Import configured axios

const ImportBooksModal = ({ isOpen, onClose, onImported }) => {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)   // success summary
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

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

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) pickFile(selected)
  }

  const pickFile = (f) => {
    const ok = f.name.match(/\.(xlsx|xls)$/i)
    if (!ok) {
      setError('Only .xlsx and .xls files are accepted.')
      setFile(null)
      return
    }
    setError('')
    setResult(null)
    setFile(f)
  }

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) pickFile(dropped)
  }

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await api.post('/books/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(res.data)
      onImported?.()          // refresh parent list
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-5 rounded-t-2xl"
            style={{ background: 'linear-gradient(135deg, var(--dark-blue-1, #1e3a5f) 0%, var(--dark-blue-2, #2d5986) 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                {/* upload icon */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Import Books</h2>
                <p className="text-white/70 text-xs">Upload an Excel file to bulk-import books</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-6 space-y-5">

            {/* Success result */}
            {result && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Import Successful
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rows found', value: result.imported, color: 'blue' },
                    { label: 'Inserted / Updated', value: result.inserted, color: 'green' },
                    { label: 'Skipped', value: result.skipped, color: 'yellow' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-lg bg-${color}-100 p-3 text-center`}>
                      <div className={`text-2xl font-bold text-${color}-700`}>{value}</div>
                      <div className={`text-xs text-${color}-600 mt-0.5`}>{label}</div>
                    </div>
                  ))}
                </div>
                {result.skippedDetails?.length > 0 && (
                  <details className="text-xs text-gray-500 cursor-pointer">
                    <summary className="font-medium text-gray-600 select-none">
                      View skipped rows ({result.skippedDetails.length})
                    </summary>
                    <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto pl-2">
                      {result.skippedDetails.map((s, i) => (
                        <li key={i}>Row {s.row}: {s.reason}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Drop zone */}
            {!result && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all p-8"
                style={{
                  borderColor: isDragging ? 'var(--dark-blue-1, #1e3a5f)' : '#cbd5e1',
                  backgroundColor: isDragging ? '#f0f4ff' : '#f8fafc',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <>
                    {/* file preview */}
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setError('') }}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 text-sm">
                        Drag & drop your Excel file here
                      </p>
                      <p className="text-gray-400 text-xs mt-1">or click to browse</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      .xlsx &nbsp;·&nbsp; .xls &nbsp;·&nbsp; max 10 MB
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Accepted columns hint */}
            {!result && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1.5">Recognised Excel columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Call No.', 'Title', 'Author/Publisher', 'Date of Publication',
                    'ISBN/ISSN', 'No. of Copies', 'Link to Online Copy'].map(col => (
                    <span key={col}
                      className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-600 text-xs font-mono">
                      {col}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-blue-500 mt-2">
                  Section headers, blank rows, and unrecognised columns are automatically skipped.
                </p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {result ? 'Close' : 'Cancel'}
            </button>

            {!result && (
              <button
                onClick={handleImport}
                disabled={!file || loading}
                className="px-5 py-2 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--dark-blue-1, #1e3a5f)' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Importing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import Books
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportBooksModal
import { CloudArrowUpIcon, XMarkIcon, DocumentTextIcon, DocumentIcon } from '@heroicons/react/24/outline'

const FileUploadSection = ({ selectedFiles, onFileChange, onRemoveFile, error, loading, dark = false }) => {
  // ── Colors ────────────────────────────────────────────────
  const inputBorder   = dark ? '#1a3356' : '#d1d5db'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const fileBg        = dark ? '#081422' : '#f8fafc'
  const fileBorder    = dark ? '#1a3356' : '#e2e8f0'
  const sectionDivider = dark ? '#1a3356' : '#f1f5f9'

  const bannerBg     = dark ? 'rgba(30,64,175,0.08)' : '#f8fafc'
  const bannerBorder = dark ? '#1a3356' : '#e2e8f0'

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileColor = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    switch (ext) {
      case 'pdf':   return '#ef4444'
      case 'epub':  return '#3b82f6'
      case 'mobi':
      case 'azw3':  return '#f97316'
      case 'djvu':  return '#22c55e'
      default:      return textMuted
    }
  }

  const sectionLabelStyle = {
    fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: textMuted,
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px solid ${sectionDivider}`,
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <p style={sectionLabelStyle}>Digital Copy <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', color: textMuted }}>(optional)</span></p>

      {/* Upload Area */}
      <div style={{
        border: `2px dashed ${bannerBorder}`,
        borderRadius: '0.75rem',
        background: bannerBg,
        padding: '1.5rem',
        textAlign: 'center',
        transition: 'border-color 0.2s ease, background 0.45s ease',
        opacity: loading ? 0.5 : 1,
      }}>
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.epub,.mobi,.azw3,.djvu"
          onChange={onFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />
        <label
          htmlFor="file-upload"
          style={{ cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <CloudArrowUpIcon style={{ width: '2.5rem', height: '2.5rem', color: textMuted }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textSecondary }}>
            Click to upload or drag and drop
          </span>
          <span style={{ fontSize: '0.75rem', color: textMuted }}>
            PDF, EPUB, MOBI, AZW3, DJVU — max 100MB, up to 5 files
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '0.5rem', padding: '0.625rem 0.875rem',
          background: dark ? '#2e1a1a' : '#fef2f2',
          border: `1px solid ${dark ? '#7f1d1d' : '#fca5a5'}`,
          borderRadius: '0.5rem',
        }}>
          <p style={{ color: dark ? '#fca5a5' : '#dc2626', fontSize: '0.8rem', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: textSecondary, margin: 0 }}>
            Selected Files ({selectedFiles.length})
          </p>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.625rem 0.875rem',
              background: fileBg,
              border: `1px solid ${fileBorder}`,
              borderRadius: '0.5rem',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                <DocumentTextIcon style={{ width: '1.25rem', height: '1.25rem', color: getFileColor(file.name), flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: textMuted, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {formatFileSize(file.size)}
                    {index === 0 && (
                      <span style={{
                        padding: '0 0.375rem', fontSize: '0.7rem', fontWeight: 600,
                        background: dark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
                        color: dark ? '#93c5fd' : '#1d4ed8',
                        borderRadius: '0.25rem',
                      }}>
                        Primary
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                disabled={loading}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: '0.25rem', borderRadius: '0.375rem',
                  color: textMuted, flexShrink: 0,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = textMuted}
              >
                <XMarkIcon style={{ width: '1.125rem', height: '1.125rem' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploadSection
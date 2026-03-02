const FormField = ({ label, required, children, colSpan, dark }) => (
  <div style={{ gridColumn: colSpan === 2 ? '1 / -1' : undefined }}>
    <label style={{
      display: 'block', fontSize: '0.7rem', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      color: dark ? '#2e4d70' : '#6b7280',
      marginBottom: '0.375rem',
    }}>
      {label} {required && <span style={{ color: '#f87171' }}>*</span>}
    </label>
    {children}
  </div>
)

const BookFormFields = ({ formData, onChange, categories, loading, dark = false }) => {
  // ── Colors ────────────────────────────────────────────────
  const inputBg     = dark ? '#081422' : '#ffffff'
  const inputBorder = dark ? '#1a3356' : '#d1d5db'
  const textPrimary = dark ? '#dde8f5' : '#1e293b'
  const textMuted   = dark ? '#2e4d70' : '#94a3b8'
  const sectionDivider = dark ? '#1a3356' : '#f1f5f9'
  const selectBg    = dark ? '#081422' : '#ffffff'

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem', fontSize: '0.875rem',
    background: inputBg, color: textPrimary,
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.45s ease',
    boxSizing: 'border-box', fontFamily: 'inherit',
    opacity: loading ? 0.6 : 1,
    cursor: loading ? 'not-allowed' : 'auto',
  }

  const sectionLabelStyle = {
    fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: textMuted,
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px solid ${sectionDivider}`,
  }

  const handleChange = (field) => (e) => {
    onChange({ ...formData, [field]: e.target.value })
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#2563eb' }
  const blurStyle  = (e) => { e.target.style.borderColor = inputBorder }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Classification ──────────────────────────────────────── */}
      <div>
        <p style={sectionLabelStyle}>Classification</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <FormField label="Category" required dark={dark}>
            <select
              value={formData.category}
              onChange={handleChange('category')}
              disabled={loading}
              required
              style={{ ...inputStyle, cursor: loading ? 'not-allowed' : 'pointer' }}
              onFocus={focusStyle} onBlur={blurStyle}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id ?? cat} value={cat.id ?? cat}>
                  {cat.name ?? cat}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Call Number" dark={dark}>
            <input
              type="text" value={formData.callNumber}
              onChange={handleChange('callNumber')}
              placeholder="Enter call number"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

        </div>
      </div>

      {/* ── Bibliographic Info ──────────────────────────────────── */}
      <div>
        <p style={sectionLabelStyle}>Bibliographic Info</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <FormField label="Title" required colSpan={2} dark={dark}>
            <input
              type="text" value={formData.title}
              onChange={handleChange('title')}
              placeholder="Enter book title"
              disabled={loading} required style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Author" dark={dark}>
            <input
              type="text" value={formData.author}
              onChange={handleChange('author')}
              placeholder="Author name"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Editor" dark={dark}>
            <input
              type="text" value={formData.editor}
              onChange={handleChange('editor')}
              placeholder="Editor name"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Edition" dark={dark}>
            <input
              type="text" value={formData.edition}
              onChange={handleChange('edition')}
              placeholder="e.g., 2nd ed."
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Publication" dark={dark}>
            <input
              type="text" value={formData.publication}
              onChange={handleChange('publication')}
              placeholder="Place of publication"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Publisher" dark={dark}>
            <input
              type="text" value={formData.publisher}
              onChange={handleChange('publisher')}
              placeholder="Publisher name"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Date of Publication" dark={dark}>
            <input
              type="date" value={formData.dateOfPublication}
              onChange={handleChange('dateOfPublication')}
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

        </div>
      </div>

      {/* ── Physical Description ────────────────────────────────── */}
      <div>
        <p style={sectionLabelStyle}>Physical Description</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <FormField label="Extent of Item" dark={dark}>
            <input
              type="text" value={formData.extent}
              onChange={handleChange('extent')}
              placeholder="e.g., 120 pages"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Dimensions" dark={dark}>
            <input
              type="text" value={formData.dimensions}
              onChange={handleChange('dimensions')}
              placeholder="e.g., 21 cm"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Other Physical Details" colSpan={2} dark={dark}>
            <textarea
              rows={2} value={formData.otherPhysicalDetails}
              onChange={handleChange('otherPhysicalDetails')}
              placeholder="e.g., illustrations, maps"
              disabled={loading}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Accompanying Material" colSpan={2} dark={dark}>
            <textarea
              rows={2} value={formData.accompanyingMaterial}
              onChange={handleChange('accompanyingMaterial')}
              placeholder="e.g., 1 CD-ROM, 1 map"
              disabled={loading}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

        </div>
      </div>

      {/* ── Identifiers & Notes ─────────────────────────────────── */}
      <div>
        <p style={sectionLabelStyle}>Identifiers & Notes</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <FormField label="ISBN" dark={dark}>
            <input
              type="text" value={formData.isbn}
              onChange={handleChange('isbn')}
              placeholder="978-X-XXX-XXXXX-X"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="ISSN" dark={dark}>
            <input
              type="text" value={formData.issn}
              onChange={handleChange('issn')}
              placeholder="XXXX-XXXX"
              disabled={loading} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Notes Area" colSpan={2} dark={dark}>
            <textarea
              rows={3} value={formData.notesArea}
              onChange={handleChange('notesArea')}
              placeholder="Additional notes"
              disabled={loading}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          <FormField label="Subjects" colSpan={2} dark={dark}>
            <textarea
              rows={2} value={formData.subjects}
              onChange={handleChange('subjects')}
              placeholder="Comma-separated subjects"
              disabled={loading}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

        </div>
      </div>

      {/* ── Acquisition ─────────────────────────────────────────── */}
      <div>
        <p style={sectionLabelStyle}>Acquisition</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <FormField label="Number of Copies" required dark={dark}>
            <input
              type="number" value={formData.copies}
              onChange={handleChange('copies')}
              placeholder="1" min="1"
              disabled={loading} required style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </FormField>

          {/* Access Level */}
          <FormField label="Access Level" colSpan={2} dark={dark}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              {/* Public */}
              <button
                type="button"
                disabled={loading}
                onClick={() => onChange({ ...formData, access_level: 'public' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem', textAlign: 'left',
                  border: `2px solid ${(formData.access_level || 'public') === 'public'
                    ? '#2563eb'
                    : (dark ? '#1a3356' : '#e2e8f0')}`,
                  background: (formData.access_level || 'public') === 'public'
                    ? (dark ? 'rgba(37,99,235,0.12)' : '#eff6ff')
                    : (dark ? '#081422' : '#ffffff'),
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '0.75rem', height: '0.75rem', borderRadius: '50%', flexShrink: 0,
                  background: (formData.access_level || 'public') === 'public' ? '#2563eb' : (dark ? '#1a3356' : '#cbd5e1'),
                  transition: 'background 0.2s ease',
                }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: dark ? '#dde8f5' : '#1e293b', margin: 0 }}>Public</p>
                  <p style={{ fontSize: '0.75rem', color: dark ? '#6b8cae' : '#64748b', margin: 0 }}>Visible to all users</p>
                </div>
              </button>

              {/* Staff Only */}
              <button
                type="button"
                disabled={loading}
                onClick={() => onChange({ ...formData, access_level: 'staff_only' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem', textAlign: 'left',
                  border: `2px solid ${formData.access_level === 'staff_only'
                    ? '#d97706'
                    : (dark ? '#1a3356' : '#e2e8f0')}`,
                  background: formData.access_level === 'staff_only'
                    ? (dark ? 'rgba(217,119,6,0.1)' : '#fffbeb')
                    : (dark ? '#081422' : '#ffffff'),
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '0.75rem', height: '0.75rem', borderRadius: '50%', flexShrink: 0,
                  background: formData.access_level === 'staff_only' ? '#d97706' : (dark ? '#1a3356' : '#cbd5e1'),
                  transition: 'background 0.2s ease',
                }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: dark ? '#dde8f5' : '#1e293b', margin: 0 }}>Staff Only</p>
                  <p style={{ fontSize: '0.75rem', color: dark ? '#6b8cae' : '#64748b', margin: 0 }}>Hidden from regular users</p>
                </div>
              </button>

            </div>
          </FormField>

        </div>
      </div>

    </div>
  )
}

export default BookFormFields
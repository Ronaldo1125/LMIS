import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Trash2,
  CheckCircle,
  FileText,
  File,
  Loader,
  AlertCircle,
  CloudUpload,
  Info,
  BookOpen
} from 'lucide-react';
import FileUploadSection from './AddBookModal/FileUploadSection';

const EditBookModal = ({
  isOpen,
  onClose,
  onSubmit,
  editBook,
  setEditBook,
  categories,
  dark
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFile, setDeletingFile] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [categoryList, setCategoryList] = useState([]);

  // ── Dark mode colors (mirrors BookFormFields/AddBookModal) ─────────────────
  const modalBg      = dark ? '#0f1f38' : '#ffffff';
  const headerBorder = dark ? '#1a3356' : '#e5e7eb';
  const inputBg      = dark ? '#081422' : '#ffffff';
  const inputBorder  = dark ? '#1a3356' : '#d1d5db';
  const textPrimary  = dark ? '#dde8f5' : '#111827';
  const textMuted    = dark ? '#6b8cae' : '#6b7280';
  const labelColor   = dark ? '#6b8cae' : '#374151';
  const cardBg       = dark ? '#162a4a' : '#f9fafb';
  const cardBorder   = dark ? '#1a3356' : '#e5e7eb';

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${inputBorder}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    background: inputBg,
    color: textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, background 0.45s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: labelColor,
    marginBottom: '0.5rem',
  };

  const focusStyle = (e) => { e.target.style.borderColor = '#2563eb'; };
  const blurStyle  = (e) => { e.target.style.borderColor = inputBorder; };

  useEffect(() => {
    if (isOpen) {
      if (categoryList.length === 0) {
        api.get('/books/meta/categories').then(res => setCategoryList(res.data)).catch(() => {});
      }
      if (editBook?.id) {
        fetchExistingFiles(editBook.id);
      }
    }
    if (!isOpen) {
      setSelectedFiles([]);
      setUploadError('');
      setExistingFiles([]);
      setActiveTab('details');
    }
  }, [isOpen, editBook?.id]);

  const fetchExistingFiles = async (bookId) => {
    setLoadingFiles(true);
    try {
      const response = await api.get(`/uploads/book/${bookId}`);
      setExistingFiles(response.data);
    } catch (err) {
      console.error('Failed to fetch existing files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ['.pdf', '.epub', '.mobi', '.azw3', '.djvu'];

    const invalidFiles = files.filter(file =>
      !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (invalidFiles.length > 0) {
      setUploadError('Unsupported format. Please use PDF, EPUB, MOBI, AZW3, or DJVU.');
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (files.some(f => f.size > maxSize)) {
      setUploadError('One or more files exceed the 100MB size limit.');
      return;
    }

    if (existingFiles.length + selectedFiles.length + files.length > 5) {
      setUploadError('Limit reached. You can only have 5 files total per book.');
      return;
    }

    setUploadError('');
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = async (uploadId) => {
    if (!window.confirm('Are you sure you want to permanently delete this digital asset?')) return;

    setDeletingFile(prev => ({ ...prev, [uploadId]: true }));
    try {
      await api.delete(`/uploads/${uploadId}`);
      setExistingFiles(prev => prev.filter(f => f.id !== uploadId));
    } catch (err) {
      setUploadError('Permission denied or server error during deletion.');
    } finally {
      setDeletingFile(prev => ({ ...prev, [uploadId]: false }));
    }
  };

  const handleSetPrimary = async (uploadId) => {
    try {
      await api.patch(`/uploads/${uploadId}/set-primary`);
      fetchExistingFiles(editBook.id);
    } catch (err) {
      setUploadError('Failed to update primary file status.');
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    await onSubmit();

    if (selectedFiles.length > 0 && editBook?.id) {
      setIsUploading(true);
      setUploadError('');

      try {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));

        if (!existingFiles.some(f => f.is_primary)) {
          formData.append('setPrimary', 'true');
        }

        await api.post(`/uploads/${editBook.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setSelectedFiles([]);
        fetchExistingFiles(editBook.id);
      } catch (err) {
        setUploadError('Metadata saved, but file upload failed. Check connection.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'pdf') return <FileText className="w-5 h-5 text-red-400" />;
    if (['epub', 'mobi', 'azw3'].includes(t)) return <BookOpen className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  // Render category options with parent/child hierarchy and └─ arrows
  const renderCategoryOptions = () => {
    if (!categoryList || categoryList.length === 0) return null;

    const options = [];
    const parents = categoryList
      .filter(cat => !cat.parent_id)
      .sort((a, b) => a.display_order - b.display_order);

    parents.forEach(parent => {
      options.push(
        <option key={parent.id} value={parent.name}>
          {parent.name}
        </option>
      );
      const children = categoryList
        .filter(cat => cat.parent_id === parent.id)
        .sort((a, b) => a.display_order - b.display_order);
      children.forEach(child => {
        options.push(
          <option key={child.id} value={child.name}>
            {'    └─ '}{child.name}
          </option>
        );
      });
    });

    return options;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', zIndex: 50,
    }}>
      <div style={{
        background: modalBg,
        borderRadius: '1rem',
        boxShadow: dark
          ? '0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.03) inset'
          : '0 24px 64px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: '42rem',
        maxHeight: '90vh', overflowY: 'auto',
        border: dark ? `1px solid ${headerBorder}` : 'none',
        transition: 'background 0.45s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: `1px solid ${headerBorder}`,
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, margin: 0 }}>Edit Book</h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem', borderRadius: '9999px', border: 'none',
              background: 'transparent', cursor: 'pointer', color: textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', paddingLeft: '1.5rem', paddingRight: '1.5rem',
          borderBottom: `1px solid ${headerBorder}`,
        }}>
          {['details', 'assets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.875rem', fontWeight: 600,
                border: 'none', background: 'transparent', cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab ? '#2563eb' : 'transparent'}`,
                color: activeTab === tab ? '#2563eb' : textMuted,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {tab === 'details' ? 'Book Details' : `Digital Assets (${existingFiles.length})`}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Error Alert */}
          {uploadError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem', background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '0.5rem', color: '#f87171', fontSize: '0.875rem',
            }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              {uploadError}
            </div>
          )}

          {/* Book Details Tab */}
          {activeTab === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    required
                    value={editBook.category || ''}
                    onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                    onFocus={focusStyle} onBlur={blurStyle}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select category</option>
                    {renderCategoryOptions()}
                  </select>
                  <div style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: dark ? '#dde8f5' : '#6b7280',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Call Number */}
              <div>
                <label style={labelStyle}>Call Number</label>
                <input
                  type="text"
                  value={editBook.callNumber || ''}
                  onChange={(e) => setEditBook({ ...editBook, callNumber: e.target.value })}
                  placeholder="Enter call number"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  required
                  value={editBook.title || ''}
                  onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                  placeholder="Enter book title"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Author */}
              <div>
                <label style={labelStyle}>Author</label>
                <input
                  type="text"
                  value={editBook.author || ''}
                  onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                  placeholder="Author name"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Editor */}
              <div>
                <label style={labelStyle}>Editor</label>
                <input
                  type="text"
                  value={editBook.editor || ''}
                  onChange={(e) => setEditBook({ ...editBook, editor: e.target.value })}
                  placeholder="Editor name"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Edition */}
              <div>
                <label style={labelStyle}>Edition</label>
                <input
                  type="text"
                  value={editBook.edition || ''}
                  onChange={(e) => setEditBook({ ...editBook, edition: e.target.value })}
                  placeholder="e.g., 2nd ed."
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Publication */}
              <div>
                <label style={labelStyle}>Publication</label>
                <input
                  type="text"
                  value={editBook.publication || ''}
                  onChange={(e) => setEditBook({ ...editBook, publication: e.target.value })}
                  placeholder="Place of publication"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Publisher */}
              <div>
                <label style={labelStyle}>Publisher</label>
                <input
                  type="text"
                  value={editBook.publisher || ''}
                  onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                  placeholder="Publisher name"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Date of Publication */}
              <div>
      <label style={labelStyle}>Date of Publication</label>
      <input
      type="date"
      value={editBook.dateOfPublication || ''}
      onChange={(e) => setEditBook({ ...editBook, dateOfPublication: e.target.value })}
      style={{ ...inputStyle, colorScheme: dark ? 'dark' : 'light' }}
      onFocus={focusStyle} onBlur={blurStyle}
  />
      </div>

              {/* Extent */}
              <div>
                <label style={labelStyle}>Extent of Item</label>
                <input
                  type="text"
                  value={editBook.extent || ''}
                  onChange={(e) => setEditBook({ ...editBook, extent: e.target.value })}
                  placeholder="e.g., 120 pages"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Dimensions */}
              <div>
                <label style={labelStyle}>Dimensions</label>
                <input
                  type="text"
                  value={editBook.dimensions || ''}
                  onChange={(e) => setEditBook({ ...editBook, dimensions: e.target.value })}
                  placeholder="e.g., 21 cm"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Other Physical Details */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Other Physical Details</label>
                <textarea
                  rows={2}
                  value={editBook.otherPhysicalDetails || ''}
                  onChange={(e) => setEditBook({ ...editBook, otherPhysicalDetails: e.target.value })}
                  placeholder="e.g., illustrations, maps"
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Accompanying Material */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Accompanying Material</label>
                <textarea
                  rows={2}
                  value={editBook.accompanyingMaterial || ''}
                  onChange={(e) => setEditBook({ ...editBook, accompanyingMaterial: e.target.value })}
                  placeholder="e.g., 1 CD-ROM, 1 map"
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* ISBN */}
              <div>
                <label style={labelStyle}>ISBN</label>
                <input
                  type="text"
                  value={editBook.isbn || ''}
                  onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                  placeholder="978-X-XXX-XXXXX-X"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* ISSN */}
              <div>
                <label style={labelStyle}>ISSN</label>
                <input
                  type="text"
                  value={editBook.issn || ''}
                  onChange={(e) => setEditBook({ ...editBook, issn: e.target.value })}
                  placeholder="XXXX-XXXX"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Notes Area */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Notes Area</label>
                <textarea
                  rows={3}
                  value={editBook.notesArea || ''}
                  onChange={(e) => setEditBook({ ...editBook, notesArea: e.target.value })}
                  placeholder="Additional notes"
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Subjects */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Subjects</label>
                <textarea
                  rows={2}
                  value={editBook.subjects || ''}
                  onChange={(e) => setEditBook({ ...editBook, subjects: e.target.value })}
                  placeholder="Comma-separated subjects"
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Number of Copies */}
              <div>
                <label style={labelStyle}>Number of Copies *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editBook.copies || 1}
                  onChange={(e) => setEditBook({ ...editBook, copies: e.target.value })}
                  placeholder="1"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Access Level */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Access Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'public' })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: '0.75rem', textAlign: 'left',
                      border: `2px solid ${(editBook.access_level || 'public') === 'public' ? '#2563eb' : inputBorder}`,
                      background: (editBook.access_level || 'public') === 'public'
                        ? (dark ? 'rgba(37,99,235,0.12)' : '#eff6ff')
                        : inputBg,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '0.75rem', height: '0.75rem', borderRadius: '50%', flexShrink: 0,
                      background: (editBook.access_level || 'public') === 'public' ? '#2563eb' : inputBorder,
                    }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: textPrimary, margin: 0 }}>Public</p>
                      <p style={{ fontSize: '0.75rem', color: textMuted, margin: 0 }}>Visible to all users</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'staff_only' })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: '0.75rem', textAlign: 'left',
                      border: `2px solid ${editBook.access_level === 'staff_only' ? '#d97706' : inputBorder}`,
                      background: editBook.access_level === 'staff_only'
                        ? (dark ? 'rgba(217,119,6,0.1)' : '#fffbeb')
                        : inputBg,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '0.75rem', height: '0.75rem', borderRadius: '50%', flexShrink: 0,
                      background: editBook.access_level === 'staff_only' ? '#d97706' : inputBorder,
                    }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: textPrimary, margin: 0 }}>Staff Only</p>
                      <p style={{ fontSize: '0.75rem', color: textMuted, margin: 0 }}>Hidden from regular users</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Digital Assets Tab */}
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.75rem', background: dark ? 'rgba(37,99,235,0.08)' : '#eff6ff',
                border: `1px solid ${dark ? 'rgba(37,99,235,0.2)' : '#bfdbfe'}`,
                borderRadius: '0.5rem', fontSize: '0.875rem',
              }}>
                <Info style={{ width: '1rem', height: '1rem', color: '#3b82f6', marginTop: '0.1rem', flexShrink: 0 }} />
                <p style={{ color: textMuted, margin: 0 }}>
                  You can upload up to 5 files. The <strong style={{ color: textPrimary }}>Primary</strong> file is shown by default when users click download.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, marginBottom: '0.75rem' }}>Stored Files</h4>

                {loadingFiles ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 0', gap: '0.5rem' }}>
                    <Loader style={{ width: '2rem', height: '2rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: '0.875rem', color: textMuted }}>Loading files...</p>
                  </div>
                ) : existingFiles.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {existingFiles.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.75rem', borderRadius: '0.75rem',
                          border: `1px solid ${cardBorder}`, background: cardBg,
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                          <div style={{
                            padding: '0.5rem', borderRadius: '0.5rem',
                            background: inputBg, border: `1px solid ${cardBorder}`,
                          }}>
                            {getFileIcon(file.file_type)}
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {file.original_name}
                              </p>
                              {file.is_primary && (
                                <span style={{
                                  background: dark ? 'rgba(37,99,235,0.15)' : '#dbeafe',
                                  color: '#3b82f6', fontSize: '0.625rem',
                                  padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 600,
                                }}>
                                  Primary
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: textMuted, margin: 0 }}>
                              {file.file_type.toUpperCase()} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.download_count} downloads
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {!file.is_primary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(file.id)}
                              title="Set as Primary"
                              style={{ padding: '0.375rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', borderRadius: '0.5rem' }}
                            >
                              <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingFile(file.id)}
                            disabled={deletingFile[file.id]}
                            style={{ padding: '0.375rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#f87171', borderRadius: '0.5rem', opacity: deletingFile[file.id] ? 0.3 : 1 }}
                          >
                            {deletingFile[file.id]
                              ? <Loader style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                              : <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center', padding: '2.5rem 0',
                    border: `2px dashed ${cardBorder}`, borderRadius: '0.75rem',
                  }}>
                    <CloudUpload style={{ width: '2.5rem', height: '2.5rem', color: inputBorder, margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', color: textMuted, margin: 0 }}>No digital files linked to this book.</p>
                  </div>
                )}
              </div>

              {existingFiles.length < 5 && (
                <FileUploadSection
                  selectedFiles={selectedFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveNewFile}
                  error={uploadError}
                  loading={isUploading}
                  dark={dark}
                />
              )}
            </div>
          )}

          {/* Form Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem',
            borderTop: `1px solid ${headerBorder}`,
          }}>
            {isUploading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem', marginRight: 'auto' }}>
                <Loader style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                Uploading files...
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
                fontSize: '0.875rem', fontWeight: 500,
                color: textMuted, border: `1px solid ${inputBorder}`,
                background: 'transparent', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '0.5rem',
                fontSize: '0.875rem', fontWeight: 500,
                color: '#ffffff', background: '#2563eb', border: 'none',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {isUploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
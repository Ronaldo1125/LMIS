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
  Layers,
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

  const theme = {
    overlay: 'rgba(2, 6, 23, 0.8)',
    blur: 'backdrop-blur-md',
    container: dark ? 'bg-[#0f1f38]/95' : 'bg-white',
    header: dark ? 'bg-[#0d1d35]' : 'bg-slate-50',
    border: dark ? 'border-[#1a3356]' : 'border-slate-200',
    textPrimary: dark ? 'text-[#dde8f5]' : 'text-slate-900',
    textSecondary: dark ? 'text-[#6b8cae]' : 'text-slate-500',
    inputBg: dark ? 'bg-[#0d1d35]' : 'bg-white',
    inputBorder: dark ? 'border-[#1a3356]' : 'border-slate-200',
    inputFocus: 'focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
    card: dark ? 'bg-[#162a4a]' : 'bg-slate-50',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20',
    buttonSecondary: dark ? 'bg-slate-800 text-slate-300 border-[#1a3356]' : 'bg-white text-slate-700 border-slate-200'
  };

  useEffect(() => {
    if (isOpen && editBook?.id) {
      fetchExistingFiles(editBook.id);
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

    if (existingFiles.length + files.length > 5) {
      setUploadError(`Limit reached. You can only have 5 files total per book.`);
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

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.blur}`}
      style={{ backgroundColor: theme.overlay }}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border ${theme.container} ${theme.border} overflow-hidden`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${theme.header} ${theme.border}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Layers className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${theme.textPrimary}`}>
                Edit Resource Management
              </h2>
              <p className={`text-xs font-medium uppercase tracking-widest ${theme.textSecondary}`}>
                ID: {editBook?.id || 'N/A'} — System Update Mode
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-slate-500/10 transition-colors ${theme.textSecondary}`}
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex px-8 border-b ${theme.border}`}>
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'details' 
              ? 'border-blue-500 text-blue-500' 
              : `border-transparent ${theme.textSecondary} hover:text-blue-400`
            }`}
          >
            Book Metadata
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'assets' 
              ? 'border-blue-500 text-blue-500' 
              : `border-transparent ${theme.textSecondary} hover:text-blue-400`
            }`}
          >
            Digital Assets ({existingFiles.length})
          </button>
        </div>

        {/* Main Content Area */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Category Field */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Primary Classification *
                </label>
                <select
                  required
                  value={editBook.category}
                  onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Call Number */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Shelf Call Number
                </label>
                <input
                  type="text"
                  value={editBook.callNumber || ''}
                  onChange={(e) => setEditBook({ ...editBook, callNumber: e.target.value })}
                  placeholder="e.g., QA 76.73 .J3"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Official Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={editBook.title || ''}
                  onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                  placeholder="The Complete Reference..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Author & Editor */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Lead Author
                </label>
                <input
                  type="text"
                  value={editBook.author || ''}
                  onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Contributing Editor
                </label>
                <input
                  type="text"
                  value={editBook.editor || ''}
                  onChange={(e) => setEditBook({ ...editBook, editor: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Edition & Publisher */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Edition / Version
                </label>
                <input
                  type="text"
                  value={editBook.edition || ''}
                  onChange={(e) => setEditBook({ ...editBook, edition: e.target.value })}
                  placeholder="e.g., Global Edition"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Publisher / Press
                </label>
                <input
                  type="text"
                  value={editBook.publisher || ''}
                  onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Dates & Extent */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Publication Date
                </label>
                <input
                  type="date"
                  value={editBook.dateOfPublication || ''}
                  onChange={(e) => setEditBook({ ...editBook, dateOfPublication: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Extent (Pages/Size)
                </label>
                <input
                  type="text"
                  value={editBook.extent || ''}
                  onChange={(e) => setEditBook({ ...editBook, extent: e.target.value })}
                  placeholder="e.g., xiv, 1024 p."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Physical Details & Accompanying */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                    Physical Details
                  </label>
                  <input
                    type="text"
                    value={editBook.otherPhysicalDetails || ''}
                    onChange={(e) => setEditBook({ ...editBook, otherPhysicalDetails: e.target.value })}
                    placeholder="e.g., ill., maps, 24cm"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                    Accompanying Material
                  </label>
                  <input
                    type="text"
                    value={editBook.accompanyingMaterial || ''}
                    onChange={(e) => setEditBook({ ...editBook, accompanyingMaterial: e.target.value })}
                    placeholder="e.g., 1 CD-ROM"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                  />
                </div>
              </div>

              {/* ISBN / Copies */}
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Standard Number (ISBN)
                </label>
                <input
                  type="text"
                  value={editBook.isbn || ''}
                  onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                  placeholder="978-..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Available Copies
                </label>
                <input
                  type="number"
                  min="1"
                  value={editBook.copies || 1}
                  onChange={(e) => setEditBook({ ...editBook, copies: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
                />
              </div>

              {/* Subjects */}
              <div className="md:col-span-2 space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Subject Headings / Keywords
                </label>
                <textarea
                  rows="2"
                  value={editBook.subjects || ''}
                  onChange={(e) => setEditBook({ ...editBook, subjects: e.target.value })}
                  placeholder="Database Systems, SQL, Web Development..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus} resize-none`}
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2 space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Notes & Annotations
                </label>
                <textarea
                  rows="3"
                  value={editBook.notesArea || ''}
                  onChange={(e) => setEditBook({ ...editBook, notesArea: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus} resize-none`}
                />
              </div>

              {/* ✅ Access Level Toggle */}
              <div className="md:col-span-2 space-y-2">
                <label className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
                  Access Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'public' })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      (editBook.access_level || 'public') === 'public'
                        ? 'border-blue-500 bg-blue-500/10'
                        : `border-transparent ${theme.card} ${theme.border} hover:border-slate-500/50`
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      (editBook.access_level || 'public') === 'public'
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-bold ${theme.textPrimary}`}>Public</p>
                      <p className={`text-xs ${theme.textSecondary}`}>Visible to all users</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'staff_only' })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      editBook.access_level === 'staff_only'
                        ? 'border-amber-500 bg-amber-500/10'
                        : `border-transparent ${theme.card} ${theme.border} hover:border-slate-500/50`
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      editBook.access_level === 'staff_only'
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-bold ${theme.textPrimary}`}>Staff Only</p>
                      <p className={`text-xs ${theme.textSecondary}`}>Hidden from regular users</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className={`p-4 rounded-xl flex items-start gap-4 ${theme.card} border ${theme.border}`}>
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className={`font-bold ${theme.textPrimary}`}>Digital Library Configuration</p>
                  <p className={theme.textSecondary}>
                    You can upload up to 5 files. The "Primary" file is the one users see by default when clicking the download button.
                  </p>
                </div>
              </div>

              <div>
                <h4 className={`text-xs font-black uppercase tracking-tighter mb-4 ${theme.textSecondary}`}>
                  Stored Assets on Server
                </h4>
                
                {loadingFiles ? (
                  <div className="flex flex-col items-center py-12 gap-3">
                    <Loader className="w-10 h-10 animate-spin text-blue-500" />
                    <p className={`text-sm ${theme.textSecondary}`}>Synchronizing with cloud storage...</p>
                  </div>
                ) : existingFiles.length > 0 ? (
                  <div className="space-y-3">
                    {existingFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${theme.card} ${theme.border} hover:border-blue-500/50`}
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className={`p-3 rounded-xl bg-white/5 border ${theme.border}`}>
                            {getFileIcon(file.file_type)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-bold truncate ${theme.textPrimary}`}>
                                {file.original_name}
                              </p>
                              {file.is_primary && (
                                <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded-full border border-blue-500/30 uppercase font-black">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className={`text-[10px] ${theme.textSecondary}`}>
                              {file.file_type.toUpperCase()} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.download_count} DLs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!file.is_primary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(file.id)}
                              className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                              title="Set as Primary"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingFile(file.id)}
                            disabled={deletingFile[file.id]}
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors disabled:opacity-30"
                          >
                            {deletingFile[file.id] ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-3xl border-slate-700/50">
                    <CloudUpload className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className={`text-sm ${theme.textSecondary}`}>No digital copies linked to this record.</p>
                  </div>
                )}
              </div>

              {existingFiles.length < 5 && (
                <div className="pt-4">
                  <FileUploadSection
                    selectedFiles={selectedFiles}
                    onFileChange={handleFileChange}
                    onRemoveFile={handleRemoveNewFile}
                    error={uploadError}
                    loading={isUploading}
                    dark={dark}
                  />
                </div>
              )}
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className={`px-8 py-5 border-t flex items-center justify-between ${theme.header} ${theme.border}`}>
          <div className="flex items-center gap-2">
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-500 text-xs font-bold animate-pulse">
                <Loader className="w-4 h-4 animate-spin" />
                Processing Assets...
              </div>
            )}
            {uploadError && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm border transition-all ${theme.buttonSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleFormSubmit}
              disabled={isUploading}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${theme.buttonPrimary}`}
            >
              {isUploading ? 'Finalizing Sync...' : 'Commit Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditBookModal;
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

  // Mirrors CategorySelect's renderCategoryOptions exactly — parent/child with └─ arrows
  const renderCategoryOptions = () => {
    if (!categoryList || categoryList.length === 0) return null;

    const options = [];
    const parents = categoryList.filter(cat => !cat.parent_id);

    parents.forEach(parent => {
      options.push(
        <option key={parent.id} value={parent.name}>
          {parent.name}
        </option>
      );
      const children = categoryList.filter(cat => cat.parent_id === parent.id);
      children.forEach(child => {
        options.push(
          <option key={child.id} value={child.name}>
            &nbsp;&nbsp;&nbsp;&nbsp;└─ {child.name}
          </option>
        );
      });
    });

    return options;
  };

  // Matches AddBookModal's FormInput / CategorySelect styling exactly
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Book</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Book Details
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'assets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Digital Assets ({existingFiles.length})
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6">

          {/* Error Alert */}
          {uploadError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}

          {/* Book Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Category — hierarchy with └─ arrows, mirrors CategorySelect */}
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  required
                  value={editBook.category || ''}
                  onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {renderCategoryOptions()}
                </select>
              </div>

              {/* Call Number */}
              <div>
                <label className={labelClass}>Call Number</label>
                <input
                  type="text"
                  value={editBook.callNumber || ''}
                  onChange={(e) => setEditBook({ ...editBook, callNumber: e.target.value })}
                  placeholder="Enter call number"
                  className={inputClass}
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className={labelClass}>Title *</label>
                <input
                  type="text"
                  required
                  value={editBook.title || ''}
                  onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                  placeholder="Enter book title"
                  className={inputClass}
                />
              </div>

              {/* Author */}
              <div>
                <label className={labelClass}>Author</label>
                <input
                  type="text"
                  value={editBook.author || ''}
                  onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                  placeholder="Author name"
                  className={inputClass}
                />
              </div>

              {/* Editor */}
              <div>
                <label className={labelClass}>Editor</label>
                <input
                  type="text"
                  value={editBook.editor || ''}
                  onChange={(e) => setEditBook({ ...editBook, editor: e.target.value })}
                  placeholder="Editor name"
                  className={inputClass}
                />
              </div>

              {/* Edition */}
              <div>
                <label className={labelClass}>Edition</label>
                <input
                  type="text"
                  value={editBook.edition || ''}
                  onChange={(e) => setEditBook({ ...editBook, edition: e.target.value })}
                  placeholder="e.g., 2nd ed."
                  className={inputClass}
                />
              </div>

              {/* Publication */}
              <div>
                <label className={labelClass}>Publication</label>
                <input
                  type="text"
                  value={editBook.publication || ''}
                  onChange={(e) => setEditBook({ ...editBook, publication: e.target.value })}
                  placeholder="Place of publication"
                  className={inputClass}
                />
              </div>

              {/* Publisher */}
              <div>
                <label className={labelClass}>Publisher</label>
                <input
                  type="text"
                  value={editBook.publisher || ''}
                  onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                  placeholder="Publisher name"
                  className={inputClass}
                />
              </div>

              {/* Date of Publication */}
              <div>
                <label className={labelClass}>Date of Publication</label>
                <input
                  type="date"
                  value={editBook.dateOfPublication || ''}
                  onChange={(e) => setEditBook({ ...editBook, dateOfPublication: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Extent */}
              <div>
                <label className={labelClass}>Extent of Item</label>
                <input
                  type="text"
                  value={editBook.extent || ''}
                  onChange={(e) => setEditBook({ ...editBook, extent: e.target.value })}
                  placeholder="e.g., 120 pages"
                  className={inputClass}
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className={labelClass}>Dimensions</label>
                <input
                  type="text"
                  value={editBook.dimensions || ''}
                  onChange={(e) => setEditBook({ ...editBook, dimensions: e.target.value })}
                  placeholder="e.g., 21 cm"
                  className={inputClass}
                />
              </div>

              {/* Other Physical Details */}
              <div className="md:col-span-2">
                <label className={labelClass}>Other Physical Details</label>
                <textarea
                  rows={2}
                  value={editBook.otherPhysicalDetails || ''}
                  onChange={(e) => setEditBook({ ...editBook, otherPhysicalDetails: e.target.value })}
                  placeholder="e.g., illustrations, maps"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Accompanying Material */}
              <div className="md:col-span-2">
                <label className={labelClass}>Accompanying Material</label>
                <textarea
                  rows={2}
                  value={editBook.accompanyingMaterial || ''}
                  onChange={(e) => setEditBook({ ...editBook, accompanyingMaterial: e.target.value })}
                  placeholder="e.g., 1 CD-ROM, 1 map"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* ISBN */}
              <div>
                <label className={labelClass}>ISBN</label>
                <input
                  type="text"
                  value={editBook.isbn || ''}
                  onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                  placeholder="978-X-XXX-XXXXX-X"
                  className={inputClass}
                />
              </div>

              {/* ISSN */}
              <div>
                <label className={labelClass}>ISSN</label>
                <input
                  type="text"
                  value={editBook.issn || ''}
                  onChange={(e) => setEditBook({ ...editBook, issn: e.target.value })}
                  placeholder="XXXX-XXXX"
                  className={inputClass}
                />
              </div>

              {/* Notes Area */}
              <div className="md:col-span-2">
                <label className={labelClass}>Notes Area</label>
                <textarea
                  rows={3}
                  value={editBook.notesArea || ''}
                  onChange={(e) => setEditBook({ ...editBook, notesArea: e.target.value })}
                  placeholder="Additional notes"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Subjects */}
              <div className="md:col-span-2">
                <label className={labelClass}>Subjects</label>
                <textarea
                  rows={2}
                  value={editBook.subjects || ''}
                  onChange={(e) => setEditBook({ ...editBook, subjects: e.target.value })}
                  placeholder="Comma-separated subjects"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Number of Copies */}
              <div>
                <label className={labelClass}>Number of Copies *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editBook.copies || 1}
                  onChange={(e) => setEditBook({ ...editBook, copies: e.target.value })}
                  placeholder="1"
                  className={inputClass}
                />
              </div>

              {/* Access Level — matches BookFormFields exactly */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Access Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'public' })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      (editBook.access_level || 'public') === 'public'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      (editBook.access_level || 'public') === 'public' ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Public</p>
                      <p className="text-xs text-slate-500">Visible to all users</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditBook({ ...editBook, access_level: 'staff_only' })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      editBook.access_level === 'staff_only'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      editBook.access_level === 'staff_only' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Staff Only</p>
                      <p className="text-xs text-slate-500">Hidden from regular users</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Digital Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-6">

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  You can upload up to 5 files. The <strong>Primary</strong> file is shown by default when users click download.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Stored Files</h4>

                {loadingFiles ? (
                  <div className="flex flex-col items-center py-10 gap-2">
                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Loading files...</p>
                  </div>
                ) : existingFiles.length > 0 ? (
                  <div className="space-y-2">
                    {existingFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all bg-gray-50"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-white border border-gray-200">
                            {getFileIcon(file.file_type)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {file.original_name}
                              </p>
                              {file.is_primary && (
                                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">
                              {file.file_type.toUpperCase()} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.download_count} downloads
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!file.is_primary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(file.id)}
                              className="p-1.5 hover:bg-blue-100 text-blue-500 rounded-lg transition-colors"
                              title="Set as Primary"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingFile(file.id)}
                            disabled={deletingFile[file.id]}
                            className="p-1.5 hover:bg-red-100 text-red-400 rounded-lg transition-colors disabled:opacity-30"
                          >
                            {deletingFile[file.id]
                              ? <Loader className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <CloudUpload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No digital files linked to this book.</p>
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
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-500 text-sm mr-auto">
                <Loader className="w-4 h-4 animate-spin" />
                Uploading files...
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
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
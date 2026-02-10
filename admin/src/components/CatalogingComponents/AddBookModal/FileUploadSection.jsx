import { Upload, X, FileText, File } from 'lucide-react'

const FileUploadSection = ({ selectedFiles, onFileChange, onRemoveFile, error, loading }) => {
  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Helper to get file icon
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    const iconClass = "w-5 h-5"
    
    switch(ext) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />
      case 'epub':
        return <File className={`${iconClass} text-blue-500`} />
      case 'mobi':
      case 'azw3':
        return <File className={`${iconClass} text-orange-500`} />
      case 'djvu':
        return <File className={`${iconClass} text-green-500`} />
      default:
        return <File className={iconClass} />
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Digital Files (Optional)
      </label>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.epub,.mobi,.azw3,.djvu"
          onChange={onFileChange}
          disabled={loading}
          className="hidden"
        />
        
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-700 mb-1">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-gray-500">
            PDF, EPUB, MOBI, AZW3, DJVU (Max 100MB, up to 5 files)
          </span>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length})
          </p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                    {index === 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
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
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploadSection
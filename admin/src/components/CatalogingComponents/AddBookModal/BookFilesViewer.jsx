import { useState, useEffect } from 'react'
import axios from 'axios'
import { Download, FileText, File, CheckCircle, Loader } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const BookFilesViewer = ({ bookId }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState({})

  useEffect(() => {
    if (bookId) {
      fetchFiles()
    }
  }, [bookId])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/uploads/book/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setFiles(response.data)
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (uploadId, fileName) => {
    setDownloading(prev => ({ ...prev, [uploadId]: true }))
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(
        `${API_URL}/uploads/${uploadId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob' // Important for file downloads
        }
      )

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      // Refresh files to update download count
      fetchFiles()
    } catch (err) {
      console.error('Error downloading file:', err)
      alert(err.response?.data?.message || 'Error downloading file')
    } finally {
      setDownloading(prev => ({ ...prev, [uploadId]: false }))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    const iconClass = "w-6 h-6"
    
    switch(fileType) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No digital files available for this book</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Digital Files ({files.length})
      </h3>
      
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(file.file_type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.original_name}
                </p>
                {file.is_primary && (
                  <span className="flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-500" title="Primary file" />
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span>{formatFileSize(file.file_size)}</span>
                <span>{file.file_type.toUpperCase()}</span>
                {file.download_count > 0 && (
                  <span>
                    {file.download_count} download{file.download_count !== 1 ? 's' : ''}
                  </span>
                )}
                <span>Uploaded {formatDate(file.upload_date)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleDownload(file.id, file.original_name)}
            disabled={downloading[file.id]}
            className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {downloading[file.id] ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

export default BookFilesViewer
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StatsOverview from './AccessionsComponents/StatsOverview'
import SearchAndFilter from './AccessionsComponents/SearchAndFilter'
import AccessionsTable from './AccessionsComponents/AccessionsTable'
import AddAccessionModal from './AccessionsComponents/AddAccessionModal'
import ViewAccessionModal from './AccessionsComponents/ViewAccessionModal'
import EditAccessionModal from './AccessionsComponents/EditAccessionModal'
import ArchivesModal from './AccessionsComponents/ArchivesModal'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const emptyAccessionForm = {
  accession_no: '',
  date_accessioned: '',
  book_id: null,
  title: '',
  author: '',
  editor: '',
  edition: '',
  publication: '',
  publisher: '',
  date_of_publication: '',
  extent: '',
  other_physical_details: '',
  dimensions: '',
  accompanying_material: '',
  isbn: '',
  issn: '',
  notes_area: '',
  subjects: '',
}

const Accessions = () => {
  const [accessions, setAccessions] = useState([])
  const [archivedAccessions, setArchivedAccessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isArchivesOpen, setIsArchivesOpen] = useState(false)

  const [selectedAccession, setSelectedAccession] = useState(null)
  const [newAccession, setNewAccession] = useState(emptyAccessionForm)
  const [editAccession, setEditAccession] = useState({ id: null, ...emptyAccessionForm })

  // ── Fetch all active accessions ──────────────────────────────────────────────
  const fetchAccessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.get(`${API_BASE}/accessions`, {
        headers: getAuthHeaders(),
      })
      setAccessions(data)
    } catch (err) {
      console.error('Failed to fetch accessions:', err)
      setError('Failed to load accessions.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Fetch archived accessions ────────────────────────────────────────────────
  const fetchArchivedAccessions = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/accessions/archived`, {
        headers: getAuthHeaders(),
      })
      setArchivedAccessions(data)
    } catch (err) {
      console.error('Failed to fetch archived accessions:', err)
    }
  }, [])

  useEffect(() => {
    fetchAccessions()
  }, [fetchAccessions])

  // ── Filtering ────────────────────────────────────────────────────────────────
  const statuses = ['all', 'Pending Review', 'Cataloged']

  const filteredAccessions = accessions.filter((item) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      (item.accession_no || '').toLowerCase().includes(search) ||
      (item.title || '').toLowerCase().includes(search) ||
      (item.author || '').toLowerCase().includes(search)
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // ── Add accession ────────────────────────────────────────────────────────────
  const handleAddAccession = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_BASE}/accessions`, newAccession, {
        headers: getAuthHeaders(),
      })
      setNewAccession(emptyAccessionForm)
      setIsAddModalOpen(false)
      fetchAccessions()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create accession.'
      alert(msg)
    }
  }

  // ── Archive accession ────────────────────────────────────────────────────────
  const handleArchiveAccession = async (id) => {
    if (!confirm('Archive this accession?')) return
    try {
      await axios.delete(`${API_BASE}/accessions/${id}`, {
        headers: getAuthHeaders(),
        data: { archived_by: 'admin' },
      })
      fetchAccessions()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to archive accession.')
    }
  }

  // ── Restore accession ────────────────────────────────────────────────────────
  const handleRestoreAccession = async (id) => {
    try {
      await axios.patch(
        `${API_BASE}/accessions/${id}/restore`,
        {},
        { headers: getAuthHeaders() }
      )
      fetchArchivedAccessions()
      fetchAccessions()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore accession.')
    }
  }

  // ── Edit accession ───────────────────────────────────────────────────────────
  const handleEditAccession = (item) => {
    setEditAccession({
      id: item.id,
      accession_no: item.accession_no || '',
      date_accessioned: item.date_accessioned?.slice(0, 10) || '',
      book_id: item.book_id || null,
      title: item.title || '',
      author: item.author || '',
      editor: item.editor || '',
      edition: item.edition || '',
      publication: item.publication || '',
      publisher: item.publisher || '',
      date_of_publication: item.date_of_publication?.slice(0, 10) || '',
      extent: item.extent || '',
      other_physical_details: item.other_physical_details || '',
      dimensions: item.dimensions || '',
      accompanying_material: item.accompanying_material || '',
      isbn: item.isbn || '',
      issn: item.issn || '',
      notes_area: item.notes_area || '',
      subjects: item.subjects || '',
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateAccession = async () => {
    try {
      await axios.put(
        `${API_BASE}/accessions/${editAccession.id}`,
        editAccession,
        { headers: getAuthHeaders() }
      )
      setIsEditModalOpen(false)
      setEditAccession({ id: null, ...emptyAccessionForm })
      fetchAccessions()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update accession.')
    }
  }

  // ── View accession ───────────────────────────────────────────────────────────
  const handleViewAccession = (item) => {
    setSelectedAccession(item)
    setIsViewModalOpen(true)
  }

  // ── Open archives modal ──────────────────────────────────────────────────────
  const handleOpenArchives = () => {
    fetchArchivedAccessions()
    setIsArchivesOpen(true)
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-blue-1)' }}>
          Accessions
        </h1>
        <p className="text-gray-600">Track new acquisitions and intake workflow</p>
      </div>

      <StatsOverview accessions={accessions} />

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statuses={statuses}
        onAddClick={() => setIsAddModalOpen(true)}
        onArchiveClick={handleOpenArchives}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading accessions...
        </div>
      ) : (
        <AccessionsTable
          accessions={filteredAccessions}
          onArchive={handleArchiveAccession}
          onEdit={handleEditAccession}
          onView={handleViewAccession}
        />
      )}

      <AddAccessionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setNewAccession(emptyAccessionForm)
        }}
        onSubmit={handleAddAccession}
        newAccession={newAccession}
        setNewAccession={setNewAccession}
      />

      <ViewAccessionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedAccession(null)
        }}
        accession={selectedAccession}
      />

      <EditAccessionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditAccession({ id: null, ...emptyAccessionForm })
        }}
        onSubmit={handleUpdateAccession}
        editAccession={editAccession}
        setEditAccession={setEditAccession}
      />

      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        archivedAccessions={archivedAccessions}
        onRestore={handleRestoreAccession}
      />
    </div>
  )
}

export default Accessions
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Package } from 'lucide-react'
import StatsOverview from './AccessionsComponents/StatsOverview'
import SearchAndFilter from './AccessionsComponents/SearchAndFilter'
import AccessionsTable from './AccessionsComponents/AccessionsTable'
import AddAccessionModal from './AccessionsComponents/AddAccessionModal'
import ViewAccessionModal from './AccessionsComponents/ViewAccessionModal'
import EditAccessionModal from './AccessionsComponents/EditAccessionModal'
import ArchivesModal from './AccessionsComponents/ArchivesModal'
import ConfirmationModal from './AccessionsComponents/ConfirmationModal'

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

const Accessions = ({ dark }) => {
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

  // Confirmation modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'archive', // 'archive' or 'delete'
    item: null,
    loading: false
  })

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

  // Open archive confirmation modal
  const handleArchiveClick = (item) => {
    setModalState({
      isOpen: true,
      type: 'archive',
      item: item,
      loading: false
    })
  }

  // Open delete confirmation modal
  const handleDeleteClick = (item) => {
    setModalState({
      isOpen: true,
      type: 'delete',
      item: item,
      loading: false
    })
  }

  // Close confirmation modal
  const handleModalClose = () => {
    if (!modalState.loading) {
      setModalState({
        isOpen: false,
        type: 'archive',
        item: null,
        loading: false
      })
    }
  }

  // Confirm archive action
  const handleConfirmArchive = async () => {
    if (!modalState.item) return

    setModalState(prev => ({ ...prev, loading: true }))

    try {
      await axios.patch(
        `${API_BASE}/accessions/${modalState.item.id}/archive`,
        { archived_by: 'admin' },
        { headers: getAuthHeaders() }
      )

      // Remove from list
      setAccessions(prev => prev.filter(acc => acc.id !== modalState.item.id))
      
      // Close modal
      setModalState({
        isOpen: false,
        type: 'archive',
        item: null,
        loading: false
      })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to archive accession.')
      setModalState(prev => ({ ...prev, loading: false }))
    }
  }

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!modalState.item) return

    setModalState(prev => ({ ...prev, loading: true }))

    try {
      await axios.delete(
        `${API_BASE}/accessions/${modalState.item.id}`,
        { headers: getAuthHeaders() }
      )

      // Remove from list
      setAccessions(prev => prev.filter(acc => acc.id !== modalState.item.id))
      
      // Close modal
      setModalState({
        isOpen: false,
        type: 'delete',
        item: null,
        loading: false
      })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete accession.')
      setModalState(prev => ({ ...prev, loading: false }))
    }
  }

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

  const handleViewAccession = (item) => {
    setSelectedAccession(item)
    setIsViewModalOpen(true)
  }

  const handleOpenArchives = () => {
    fetchArchivedAccessions()
    setIsArchivesOpen(true)
  }

  const pageBg       = dark ? '#0a1628' : '#f1f5f9'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const border       = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const iconBoxBg    = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor    = dark ? '#93c5fd' : '#2563eb'
  const errorBg      = dark ? 'rgba(220,38,38,0.1)' : '#fef2f2'
  const errorBorder  = dark ? 'rgba(220,38,38,0.2)' : '#fecaca'
  const errorText    = dark ? '#fca5a5' : '#dc2626'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Header */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
            <Package style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>Accessions</h1>
            <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease' }}>
              Track new acquisitions and intake workflow
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        <StatsOverview accessions={accessions} dark={dark} />

        {/* ✅ Sticky Search and Filter */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: pageBg, paddingBottom: '1rem', transition: 'background 0.45s ease' }}>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statuses={statuses}
            onAddClick={() => setIsAddModalOpen(true)}
            onArchiveClick={handleOpenArchives}
            dark={dark}
          />
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: errorBg, border: `1px solid ${errorBorder}`, color: errorText, borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', transition: 'background 0.45s ease' }}>
            <div style={{ display: 'inline-block', width: '2rem', height: '2rem', borderRadius: '50%', border: `2px solid transparent`, borderBottomColor: iconColor, animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
            <p style={{ color: textSecondary, margin: 0 }}>Loading accessions...</p>
          </div>
        ) : (
          <AccessionsTable
            accessions={filteredAccessions}
            onArchive={handleArchiveClick}
            onDelete={handleDeleteClick}
            onEdit={handleEditAccession}
            onView={handleViewAccession}
            dark={dark}
          />
        )}
      </div>

      <AddAccessionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setNewAccession(emptyAccessionForm)
        }}
        onSubmit={handleAddAccession}
        newAccession={newAccession}
        setNewAccession={setNewAccession}
        dark={dark}
      />

      <ViewAccessionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedAccession(null)
        }}
        accession={selectedAccession}
        dark={dark}
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
        dark={dark}
      />

      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        archivedAccessions={archivedAccessions}
        onRestore={handleRestoreAccession}
        dark={dark}
      />

      {/* Confirmation Modal for Archive and Delete */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={modalState.type === 'archive' ? handleConfirmArchive : handleConfirmDelete}
        type={modalState.type}
        itemName={modalState.item?.accession_no}
        loading={modalState.loading}
        dark={dark}
      />
    </div>
  )
}

export default Accessions
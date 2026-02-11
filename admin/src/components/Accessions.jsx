import { useState } from 'react'
import { Package } from 'lucide-react'
import StatsOverview from './AccessionsComponents/StatsOverview'
import SearchAndFilter from './AccessionsComponents/SearchAndFilter'
import AccessionsTable from './AccessionsComponents/AccessionsTable'
import AddAccessionModal from './AccessionsComponents/AddAccessionModal'
import ViewAccessionModal from './AccessionsComponents/ViewAccessionModal'
import EditAccessionModal from './AccessionsComponents/EditAccessionModal'
import ArchivesModal from './AccessionsComponents/ArchivesModal'

const Accessions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isArchivesOpen, setIsArchivesOpen] = useState(false)
  const [selectedAccession, setSelectedAccession] = useState(null)
  const [editAccession, setEditAccession] = useState({
    id: null,
    accessionNumber: '',
    title: '',
    category: '',
    sourceType: '',
    sourceName: '',
    dateReceived: '',
    quantity: '',
    condition: '',
    status: '',
    notes: '',
  })

  const [accessions, setAccessions] = useState([
    {
      id: 1,
      accessionNumber: 'ACC-2026-001',
      title: 'National Development Plan 2026',
      category: 'Reports',
      sourceType: 'Donation',
      sourceName: 'Ministry of Planning',
      dateReceived: '2026-01-12',
      quantity: 6,
      condition: 'Good',
      status: 'Pending Review',
      notes: 'Includes annex volume and map insert.'
    },
    {
      id: 2,
      accessionNumber: 'ACC-2026-002',
      title: 'Annual Statistics Yearbook 2025',
      category: 'Reference',
      sourceType: 'Purchase',
      sourceName: 'Govt Printing Office',
      dateReceived: '2026-01-20',
      quantity: 10,
      condition: 'New',
      status: 'Cataloged',
      notes: ''
    },
    {
      id: 3,
      accessionNumber: 'ACC-2026-003',
      title: 'Coastal Risk Assessment',
      category: 'Research',
      sourceType: 'Transfer',
      sourceName: 'Department of Environment',
      dateReceived: '2026-01-28',
      quantity: 3,
      condition: 'Fair',
      status: 'Pending Review',
      notes: 'Missing two appendices, follow up needed.'
    },
  ])

  const [newAccession, setNewAccession] = useState({
    accessionNumber: '',
    title: '',
    category: '',
    sourceType: '',
    sourceName: '',
    dateReceived: '',
    quantity: '',
    condition: '',
    notes: '',
  })

  const statuses = [
    'all',
    'Pending Review',
    'Cataloged'
  ]

  const archivedAccessions = accessions.filter(item => item.status === 'Archived')

  const filteredAccessions = accessions.filter(item => {
    if (item.status === 'Archived') return false
    const search = searchTerm.toLowerCase()
    const matchesSearch = item.accessionNumber.toLowerCase().includes(search) ||
      item.title.toLowerCase().includes(search) ||
      item.sourceName.toLowerCase().includes(search)
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddAccession = (e) => {
    e.preventDefault()
    const quantityValue = newAccession.quantity === '' ? null : parseInt(newAccession.quantity, 10)
    const accessionToAdd = {
      id: accessions.length + 1,
      ...newAccession,
      quantity: quantityValue,
      status: 'Pending Review'
    }
    setAccessions([...accessions, accessionToAdd])
    setNewAccession({
      accessionNumber: '',
      title: '',
      category: '',
      sourceType: '',
      sourceName: '',
      dateReceived: '',
      quantity: '',
      condition: '',
      notes: '',
    })
    setIsAddModalOpen(false)
  }

  const handleArchiveAccession = (id) => {
    setAccessions(accessions.map(item => (
      item.id === id ? { ...item, status: 'Archived' } : item
    )))
  }

  const handleRestoreAccession = (id) => {
    setAccessions(accessions.map(item => (
      item.id === id ? { ...item, status: 'Cataloged' } : item
    )))
  }

  const handleEditAccession = (item) => {
    setEditAccession({
      id: item.id,
      accessionNumber: item.accessionNumber || '',
      title: item.title || '',
      category: item.category || '',
      sourceType: item.sourceType || '',
      sourceName: item.sourceName || '',
      dateReceived: item.dateReceived || '',
      quantity: item.quantity ?? '',
      condition: item.condition || '',
      status: item.status || '',
      notes: item.notes || '',
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateAccession = () => {
    const quantityValue = editAccession.quantity === '' ? null : parseInt(editAccession.quantity, 10)
    const updatedAccession = {
      ...editAccession,
      quantity: quantityValue,
    }
    setAccessions(accessions.map(item => (
      item.id === updatedAccession.id ? updatedAccession : item
    )))
    setIsEditModalOpen(false)
    setEditAccession({
      id: null,
      accessionNumber: '',
      title: '',
      category: '',
      sourceType: '',
      sourceName: '',
      dateReceived: '',
      quantity: '',
      condition: '',
      status: '',
      notes: '',
    })
  }

  const handleViewAccession = (item) => {
    setSelectedAccession(item)
    setIsViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedAccession(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Accessions</h1>
            <p className="text-sm text-gray-600">Track new acquisitions and intake workflow</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <StatsOverview accessions={accessions} />

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statuses={statuses}
          onAddClick={() => setIsAddModalOpen(true)}
          onArchiveClick={() => setIsArchivesOpen(true)}
        />

        <AccessionsTable
          accessions={filteredAccessions}
          onArchive={handleArchiveAccession}
          onEdit={handleEditAccession}
          onView={handleViewAccession}
        />
      </div>

      <AddAccessionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAccession}
        newAccession={newAccession}
        setNewAccession={setNewAccession}
      />

      <ViewAccessionModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        accession={selectedAccession}
      />

      <EditAccessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
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

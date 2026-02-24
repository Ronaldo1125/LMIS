import { XMarkIcon } from '@heroicons/react/24/outline'

const ViewAccessionModal = ({ isOpen, onClose, accession }) => {
  if (!isOpen || !accession) return null

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    // Format dates nicely
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    }
    return value
  }

  const accessionFields = [
    { label: 'Accession No.', value: accession.accession_no },
    { label: 'Date Accessioned', value: accession.date_accessioned },
  ]

  const bibliographicFields = [
    { label: 'Title', value: accession.title, wide: true },
    { label: 'Author', value: accession.author },
    { label: 'Editor', value: accession.editor },
    { label: 'Edition', value: accession.edition },
    { label: 'Publication', value: accession.publication },
    { label: 'Publisher', value: accession.publisher },
    { label: 'Date of Publication', value: accession.date_of_publication },
    { label: 'Extent', value: accession.extent },
    { label: 'Dimensions', value: accession.dimensions },
    { label: 'ISBN', value: accession.isbn },
    { label: 'ISSN', value: accession.issn },
    { label: 'Other Physical Details', value: accession.other_physical_details, wide: true },
    { label: 'Accompanying Material', value: accession.accompanying_material, wide: true },
    { label: 'Subjects', value: accession.subjects, wide: true },
    { label: 'Notes Area', value: accession.notes_area, wide: true },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
              Accession Details
            </h2>
            {accession.accession_no && (
              <p className="text-sm text-gray-400 mt-0.5">{accession.accession_no}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Accession Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Accession Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accessionFields.map((field) => (
                <div key={field.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">{field.label}</p>
                  <p className="text-gray-800 font-medium text-sm">{renderValue(field.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bibliographic Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Bibliographic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bibliographicFields.map((field) => (
                <div
                  key={field.label}
                  className={`bg-gray-50 rounded-lg p-3 ${field.wide ? 'md:col-span-2' : ''}`}
                >
                  <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">{field.label}</p>
                  <p className="text-gray-800 font-medium text-sm">{renderValue(field.value)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewAccessionModal
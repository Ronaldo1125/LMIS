import { XMarkIcon } from '@heroicons/react/24/outline'

const FormField = ({ label, required, children, colSpan }) => (
  <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
)

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white'

const readOnlyInputClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed'

const EditAccessionModal = ({ isOpen, onClose, onSubmit, editAccession, setEditAccession }) => {
  if (!isOpen) return null

  const set = (field) => (e) =>
    setEditAccession({ ...editAccession, [field]: e.target.value })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            Edit Accession
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Accession Info ─────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
              Accession Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Accession Number" required>
                <input
                  type="text"
                  required
                  value={editAccession.accession_no}
                  onChange={set('accession_no')}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Date Accessioned" required>
                <input
                  type="date"
                  required
                  value={editAccession.date_accessioned}
                  onChange={set('date_accessioned')}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          {/* ── Bibliographic Details (Read-only) ──────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
              Bibliographic Details
              <span className="ml-2 text-xs font-normal text-blue-500 normal-case tracking-normal">
                — from catalog (read-only)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Title" required colSpan={2}>
                <input
                  type="text"
                  value={editAccession.title}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Author">
                <input
                  type="text"
                  value={editAccession.author}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Editor">
                <input
                  type="text"
                  value={editAccession.editor}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Edition">
                <input
                  type="text"
                  value={editAccession.edition}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Publication">
                <input
                  type="text"
                  value={editAccession.publication}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Publisher">
                <input
                  type="text"
                  value={editAccession.publisher}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Date of Publication">
                <input
                  type="date"
                  value={editAccession.date_of_publication}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Extent">
                <input
                  type="text"
                  value={editAccession.extent}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Dimensions">
                <input
                  type="text"
                  value={editAccession.dimensions}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="ISBN">
                <input
                  type="text"
                  value={editAccession.isbn}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="ISSN">
                <input
                  type="text"
                  value={editAccession.issn}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Other Physical Details" colSpan={2}>
                <input
                  type="text"
                  value={editAccession.other_physical_details}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Accompanying Material" colSpan={2}>
                <input
                  type="text"
                  value={editAccession.accompanying_material}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Subjects" colSpan={2}>
                <input
                  type="text"
                  value={editAccession.subjects}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

              <FormField label="Notes Area" colSpan={2}>
                <textarea
                  rows={3}
                  value={editAccession.notes_area}
                  readOnly
                  className={readOnlyInputClass}
                />
              </FormField>

            </div>
          </div>

          {/* ── Info Note ──────────────────────────────────────────────────── */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Bibliographic data is locked</p>
                <p className="text-xs text-blue-600 mt-1">
                  To update bibliographic details, edit the original book record in the catalog. Accession records reference the catalog and cannot modify book data directly.
                </p>
              </div>
            </div>
          </div>

          {/* ── Actions ────────────────────────────────────────────────────── */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-sm"
              style={{ backgroundColor: 'var(--secondary-3-medium)' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditAccessionModal
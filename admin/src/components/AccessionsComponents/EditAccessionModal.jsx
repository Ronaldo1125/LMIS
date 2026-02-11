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

          {/* ── Bibliographic Details ──────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
              Bibliographic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Title" required colSpan={2}>
                <input
                  type="text"
                  required
                  value={editAccession.title}
                  onChange={set('title')}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Author">
                <input type="text" value={editAccession.author} onChange={set('author')} className={inputClass} />
              </FormField>

              <FormField label="Editor">
                <input type="text" value={editAccession.editor} onChange={set('editor')} className={inputClass} />
              </FormField>

              <FormField label="Edition">
                <input type="text" value={editAccession.edition} onChange={set('edition')} className={inputClass} placeholder="e.g. 3rd edition" />
              </FormField>

              <FormField label="Publication">
                <input type="text" value={editAccession.publication} onChange={set('publication')} className={inputClass} placeholder="Place of publication" />
              </FormField>

              <FormField label="Publisher">
                <input type="text" value={editAccession.publisher} onChange={set('publisher')} className={inputClass} />
              </FormField>

              <FormField label="Date of Publication">
                <input type="date" value={editAccession.date_of_publication} onChange={set('date_of_publication')} className={inputClass} />
              </FormField>

              <FormField label="Extent">
                <input type="text" value={editAccession.extent} onChange={set('extent')} className={inputClass} placeholder="e.g. 320 p." />
              </FormField>

              <FormField label="Dimensions">
                <input type="text" value={editAccession.dimensions} onChange={set('dimensions')} className={inputClass} placeholder="e.g. 23 cm" />
              </FormField>

              <FormField label="ISBN">
                <input type="text" value={editAccession.isbn} onChange={set('isbn')} className={inputClass} />
              </FormField>

              <FormField label="ISSN">
                <input type="text" value={editAccession.issn} onChange={set('issn')} className={inputClass} />
              </FormField>

              <FormField label="Other Physical Details" colSpan={2}>
                <input type="text" value={editAccession.other_physical_details} onChange={set('other_physical_details')} className={inputClass} placeholder="Illustrations, maps, etc." />
              </FormField>

              <FormField label="Accompanying Material" colSpan={2}>
                <input type="text" value={editAccession.accompanying_material} onChange={set('accompanying_material')} className={inputClass} />
              </FormField>

              <FormField label="Subjects" colSpan={2}>
                <input type="text" value={editAccession.subjects} onChange={set('subjects')} className={inputClass} />
              </FormField>

              <FormField label="Notes Area" colSpan={2}>
                <textarea
                  rows={3}
                  value={editAccession.notes_area}
                  onChange={set('notes_area')}
                  className={inputClass}
                />
              </FormField>

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
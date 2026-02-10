import FormInput from './FormInput'
import FormTextarea from './FormTextArea'
import CategorySelect from './CategorySelect'

const BookFormFields = ({ formData, onChange, categories, loading }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...formData, [field]: e.target.value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Dropdown */}
      <CategorySelect
        categories={categories}
        value={formData.category}
        onChange={handleChange('category')}
        disabled={loading}
        required
      />

      <FormInput
        label="Call Number"
        value={formData.callNumber}
        onChange={handleChange('callNumber')}
        placeholder="Enter call number"
        disabled={loading}
      />

      <FormInput
        label="Title"
        value={formData.title}
        onChange={handleChange('title')}
        placeholder="Enter book title"
        disabled={loading}
        required
        className="md:col-span-2"
      />

      <FormInput
        label="Author"
        value={formData.author}
        onChange={handleChange('author')}
        placeholder="Author name"
        disabled={loading}
        required
      />

      <FormInput
        label="Editor"
        value={formData.editor}
        onChange={handleChange('editor')}
        placeholder="Editor name"
        disabled={loading}
      />

      <FormInput
        label="Edition"
        value={formData.edition}
        onChange={handleChange('edition')}
        placeholder="e.g., 2nd ed."
        disabled={loading}
      />

      <FormInput
        label="Publication"
        value={formData.publication}
        onChange={handleChange('publication')}
        placeholder="Place of publication"
        disabled={loading}
      />

      <FormInput
        label="Publisher"
        value={formData.publisher}
        onChange={handleChange('publisher')}
        placeholder="Publisher name"
        disabled={loading}
        required
      />

      <FormInput
        label="Date of Publication"
        type="date"
        value={formData.dateOfPublication}
        onChange={handleChange('dateOfPublication')}
        disabled={loading}
      />

      <FormInput
        label="Extent of Item"
        value={formData.extent}
        onChange={handleChange('extent')}
        placeholder="e.g., 120 pages"
        disabled={loading}
      />

      <FormInput
        label="Dimensions"
        value={formData.dimensions}
        onChange={handleChange('dimensions')}
        placeholder="e.g., 21 cm"
        disabled={loading}
      />

      <FormTextarea
        label="Other Physical Details"
        rows={2}
        value={formData.otherPhysicalDetails}
        onChange={handleChange('otherPhysicalDetails')}
        placeholder="e.g., illustrations, maps"
        disabled={loading}
        className="md:col-span-2"
      />

      <FormTextarea
        label="Accompanying Material"
        rows={2}
        value={formData.accompanyingMaterial}
        onChange={handleChange('accompanyingMaterial')}
        placeholder="e.g., 1 CD-ROM, 1 map"
        disabled={loading}
        className="md:col-span-2"
      />

      <FormInput
        label="ISBN"
        value={formData.isbn}
        onChange={handleChange('isbn')}
        placeholder="978-X-XXX-XXXXX-X"
        disabled={loading}
        required
      />

      <FormInput
        label="ISSN"
        value={formData.issn}
        onChange={handleChange('issn')}
        placeholder="XXXX-XXXX"
        disabled={loading}
      />

      <FormTextarea
        label="Notes Area"
        rows={3}
        value={formData.notesArea}
        onChange={handleChange('notesArea')}
        placeholder="Additional notes"
        disabled={loading}
        className="md:col-span-2"
      />

      <FormTextarea
        label="Subjects"
        rows={2}
        value={formData.subjects}
        onChange={handleChange('subjects')}
        placeholder="Comma-separated subjects"
        disabled={loading}
        className="md:col-span-2"
      />

      <FormInput
        label="Number of Copies"
        type="number"
        value={formData.copies}
        onChange={handleChange('copies')}
        placeholder="1"
        min="1"
        disabled={loading}
        required
      />
    </div>
  )
}

export default BookFormFields
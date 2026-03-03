const CategorySelect = ({ 
  categories, 
  value, 
  onChange, 
  disabled = false,
  required = false 
}) => {
  const renderCategoryOptions = () => {
    const options = []

    // Get parents and sort by display_order
    const parents = categories
      .filter(cat => !cat.parent_id)
      .sort((a, b) => a.display_order - b.display_order)

    parents.forEach(parent => {
      options.push(
        <option key={parent.id} value={parent.name}>
          {parent.name}
        </option>
      )

      // Get children of this parent, sorted by display_order
      const children = categories
        .filter(cat => cat.parent_id === parent.id)
        .sort((a, b) => a.display_order - b.display_order)

      children.forEach(child => {
        options.push(
          <option key={child.id} value={child.name}>
            &nbsp;&nbsp;&nbsp;&nbsp;└─ {child.name}
          </option>
        )
      })
    })

    return options
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category {required && '*'}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
        disabled={disabled}
      >
        <option value="">Select category</option>
        {renderCategoryOptions()}
      </select>
    </div>
  )
}

export default CategorySelect
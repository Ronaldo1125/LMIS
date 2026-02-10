const FormTextarea = ({ 
  label, 
  required = false, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  rows = 3,
  name,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        rows={rows}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        {...props}
      />
    </div>
  )
}

export default FormTextarea
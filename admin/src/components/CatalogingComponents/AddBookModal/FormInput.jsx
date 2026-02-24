const FormInput = ({ 
  label, 
  required = false, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  name,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
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

export default FormInput
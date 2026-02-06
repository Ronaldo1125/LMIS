function UsernameField({ value, onChange }) {
  return (
    <div>
      <label 
        htmlFor="username" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        required
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        placeholder="Enter your username"
      />
    </div>
  )
}

export default UsernameField
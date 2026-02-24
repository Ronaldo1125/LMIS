function RememberMeSection() {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Remember me</span>
      </label>
      <a 
        href="#" 
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Forgot password?
      </a>
    </div>
  )
}

export default RememberMeSection
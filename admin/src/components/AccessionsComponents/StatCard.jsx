const StatCard = ({ label, value, subValue, icon, color = 'var(--dark-blue-1)', bgColor = 'var(--secondary-3-light)' }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {typeof icon === 'string' ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <div style={{ color }}>{icon}</div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-1xl font-bold" style={{ color }}>
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard

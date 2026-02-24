const StatCard = ({ label, value, subValue, icon, color = 'var(--dark-blue-1)', bgColor = 'var(--secondary-3-light)' }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-24 flex items-center">
      <div className="flex items-center gap-3 w-full">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {typeof icon === 'string' ? (
            <span className="text-xl">{icon}</span>
          ) : (
            <div style={{ color }}>{icon}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 mb-0.5 truncate">{label}</p>
          <p 
            className="font-bold break-words leading-tight"
            style={{ 
              color,
              fontSize: 'clamp(0.75rem, 1.2vw, 1.25rem)'
            }}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard
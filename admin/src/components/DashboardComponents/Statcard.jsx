const StatCard = ({ title, value, icon: Icon, colorVar = 'var(--dark-blue-2)' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div 
          className="p-3 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${colorVar}15` }}
        >
          <Icon 
            className="w-8 h-8"
            style={{ color: colorVar }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--dark-blue-1)' }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatCard
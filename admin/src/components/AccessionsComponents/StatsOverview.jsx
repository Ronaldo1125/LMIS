import {
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'

const StatsOverview = ({ accessions }) => {
  const totalAccessions = accessions.length

  // Count unique titles as a proxy for unique works
  const uniqueTitles = new Set(accessions.map((item) => item.title).filter(Boolean)).size

  // Accessions from this month
  const now = new Date()
  const thisMonthCount = accessions.filter((item) => {
    if (!item.date_accessioned) return false
    const d = new Date(item.date_accessioned)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  // Unique publishers
  const uniquePublishers = new Set(
    accessions.map((item) => item.publisher).filter(Boolean)
  ).size

  const stats = [
    {
      label: 'Total Accessions',
      value: totalAccessions.toLocaleString(),
      icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#0F61F7]',
      borderColor: 'border-l-[#0F61F7]'
    },
    {
      label: 'Unique Titles',
      value: uniqueTitles.toLocaleString(),
      icon: <DocumentArrowDownIcon className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-[#3F1BD2]',
      borderColor: 'border-l-[#3F1BD2]'
    },
    {
      label: 'This Month',
      value: thisMonthCount.toLocaleString(),
      subValue: 'New accessions',
      icon: <ClockIcon className="w-6 h-6" />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FFA602]',
      borderColor: 'border-l-[#FFA602]'
    },
    {
      label: 'Unique Publishers',
      value: uniquePublishers.toLocaleString(),
      icon: <BuildingLibraryIcon className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-[#FFD002]',
      borderColor: 'border-l-[#FFD002]'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white p-3 rounded-xl shadow-sm border-l-4 ${stat.borderColor}
            h-20 flex gap-2.5 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
        >
          <div
            className={`w-9 h-9 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ${stat.iconColor}`}
          >
            <div className="w-5 h-5">{stat.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-0.5 truncate">
              {stat.label}
            </p>
            <h3 
              className="font-bold text-[#154A9A] mb-0.5 break-words leading-tight line-clamp-2"
              style={{ fontSize: 'clamp(0.7rem, 1vw, 1rem)' }}
            >
              {stat.value}
            </h3>
            {stat.subValue && (
              <span className="text-[10px] text-gray-500 font-medium truncate block">{stat.subValue}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsOverview
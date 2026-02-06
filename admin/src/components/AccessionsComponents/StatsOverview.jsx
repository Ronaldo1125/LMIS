import {
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'

const StatsOverview = ({ accessions }) => {
  const totalAccessions = accessions.length
  const totalItems = accessions.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const pendingReview = accessions.filter(item => item.status === 'Pending Review').length
  const uniqueSources = new Set(accessions.map(item => item.sourceName || 'Unknown')).size

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
      label: 'Items Received',
      value: totalItems.toLocaleString(),
      icon: <DocumentArrowDownIcon className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-[#3F1BD2]',
      borderColor: 'border-l-[#3F1BD2]'
    },
    {
      label: 'Pending Review',
      value: pendingReview.toLocaleString(),
      subValue: 'Awaiting cataloging',
      icon: <ClockIcon className="w-6 h-6" />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FFA602]',
      borderColor: 'border-l-[#FFA602]'
    },
    {
      label: 'Unique Sources',
      value: uniqueSources.toLocaleString(),
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
          className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${stat.borderColor} 
            flex gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
        >
          <div className={`w-[52px] h-[52px] ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ${stat.iconColor}`}>
            {stat.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-[#154A9A] mb-1">
              {stat.value}
            </h3>
            {stat.subValue && (
              <span className="text-xs text-gray-500 font-medium">
                {stat.subValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsOverview

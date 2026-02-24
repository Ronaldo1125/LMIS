import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#0F61F7]',
      borderColor: 'border-l-[#0F61F7]'
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      bgColor: 'bg-purple-50',
      iconColor: 'text-[#3F1BD2]',
      borderColor: 'border-l-[#3F1BD2]'
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FFA602]',
      borderColor: 'border-l-[#FFA602]'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 border-l-4 ${card.borderColor} 
            flex gap-2.5 items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
        >
          <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-medium text-gray-600 mb-0.5">
              {card.title}
            </p>
            <h3 className="text-lg font-bold text-[#154A9A]">
              {card.count.toLocaleString()}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards



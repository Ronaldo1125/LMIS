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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${card.borderColor} 
            flex gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
        >
          <div className={`w-[52px] h-[52px] ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconColor}`}>
            <card.icon className="w-6 h-6" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-[#154A9A]">
              {card.count.toLocaleString()}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
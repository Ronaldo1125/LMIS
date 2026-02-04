import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      iconBg: 'var(--secondary-3-light)', // match Cataloging StatCard bgColor
      iconColor: 'var(--dark-blue-1)',
      textColor: 'var(--dark-blue-1)'
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      iconBg: 'var(--secondary-1-light)',
      iconColor: 'var(--secondary-1-dark)',
      textColor: 'var(--secondary-1-dark)'
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      iconBg: 'var(--secondary-2-light)',
      iconColor: 'var(--secondary-2-darkest)',
      textColor: 'var(--secondary-2-darkest)'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: card.iconBg }}
            >
              <card.icon className="w-7 h-7" strokeWidth={2.2} color={card.iconColor} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-1xl font-bold" style={{ color: card.textColor }}>
                {card.count}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
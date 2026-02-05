import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      bg: 'var(--white)',
      iconBg: 'var(--dark-blue-1)', // strong contrast for white icon
      iconColor: 'var(--white)',
      textColor: 'var(--dark-blue-4)'
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      bg: 'var(--white)',
      iconBg: 'var(--secondary-1-dark)', // strong contrast for white icon
      iconColor: 'var(--white)',
      textColor: 'var(--secondary-1-darker)'
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      bg: 'var(--white)',
      iconBg: 'var(--secondary-2-darkest)', // strong contrast for white icon
      iconColor: 'var(--white)',
      textColor: 'var(--dark-blue-4)'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl p-4 flex flex-col justify-between min-h-[110px] border border-gray-200 bg-white"
          style={{
            background: card.bg,
            color: card.textColor,
            fontFamily: 'var(--font-family, Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif)',
            boxShadow: '0 2px 8px 0 rgba(21,74,154,0.04)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg flex items-center justify-center" style={{ background: card.iconBg, opacity: 1, width: 36, height: 36 }}>
              <card.icon className="w-5 h-5" strokeWidth={2.2} color={card.iconColor} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ fontFamily: 'inherit', color: card.textColor }}>
                {card.count}
              </div>
            </div>
          </div>
          <h3 className="text-base font-semibold opacity-95" style={{ fontFamily: 'inherit', letterSpacing: '0.01em', color: card.textColor }}>
            {card.title}
          </h3>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
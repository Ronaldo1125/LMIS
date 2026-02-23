import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats, dark = false }) {
  // ── Colors ────────────────────────────────────────────────
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const borderColors = [dark ? '#2563eb' : '#0F61F7', dark ? '#a855f7' : '#3F1BD2', dark ? '#f59e0b' : '#FFA602']
  const iconBgColors = [dark ? 'rgba(37,99,235,0.15)' : '#dbeafe', dark ? 'rgba(168,85,247,0.15)' : '#ede9fe', dark ? 'rgba(251,191,36,0.15)' : '#fef3c7']
  const iconColors   = [dark ? '#60a5fa' : '#0F61F7', dark ? '#c084fc' : '#3F1BD2', dark ? '#fbbf24' : '#FFA602']
  const titleColor   = dark ? '#6b8cae' : '#64748b'
  const countColor   = dark ? '#f8fafc' : '#154A9A'

  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      borderColor: borderColors[0],
      iconBg: iconBgColors[0],
      iconColor: iconColors[0],
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      borderColor: borderColors[1],
      iconBg: iconBgColors[1],
      iconColor: iconColors[1],
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      borderColor: borderColors[2],
      iconBg: iconBgColors[2],
      iconColor: iconColors[2],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: cardBg,
            boxShadow: dark ? '0 2px 8px rgba(16, 37, 70, 0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${card.borderColor}`,
            display: 'flex', gap: 16, alignItems: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          className="p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 duration-200"
          onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 4px 16px rgba(37,99,235,0.18)' : '0 4px 16px rgba(0,0,0,0.13)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 2px 8px rgba(16, 37, 70, 0.25)' : '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none'; }}
        >
          <div style={{ background: card.iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="w-[52px] h-[52px]">
            <card.icon style={{ width: 24, height: 24, color: card.iconColor }} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p style={{ color: titleColor }} className="text-xs font-semibold uppercase tracking-wider mb-1.5">{card.title}</p>
            <h3 style={{ color: countColor }} className="text-2xl font-bold">{card.count.toLocaleString()}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
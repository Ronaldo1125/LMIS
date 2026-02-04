import { Users, UserCog, BookUser } from 'lucide-react'

function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Staff Members',
      count: stats.staff,
      icon: Users,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
    {
      title: 'Librarians',
      count: stats.librarians,
      icon: UserCog,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)'
    },
    {
      title: 'Patrons',
      count: stats.patrons,
      icon: BookUser,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgPattern: 'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.12) 0%, transparent 50%)'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            background: card.gradient,
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <div 
            className="absolute inset-0 opacity-30"
            style={{ background: card.bgPattern }}
          />
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <card.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="text-right">
                <div 
                  className="text-5xl font-bold text-white"
                  style={{ 
                    fontFamily: '"Playfair Display", serif',
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {card.count}
                </div>
              </div>
            </div>
            
            <h3 
              className="text-lg font-semibold text-white opacity-95"
              style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.02em' }}
            >
              {card.title}
            </h3>
          </div>
        </div>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default StatsCards
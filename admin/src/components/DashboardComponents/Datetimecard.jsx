import { CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Add a subtle flip animation every minute
      if (new Date().getSeconds() === 0) {
        setIsFlipping(true)
        setTimeout(() => setIsFlipping(false), 600)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  // Fun quirk: pulse the seconds colon
  const seconds = currentTime.getSeconds()
  const shouldPulse = seconds % 2 === 0

  return (
    <div 
      className={`rounded-2xl shadow-lg p-4 text-gray-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-gray-300/60 ${isFlipping ? 'animate-pulse' : ''}`}
      style={{ 
        backgroundColor: '#e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative corner accent */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-20"
        style={{
          background: 'radial-gradient(circle at top right, #ffffff 0%, transparent 70%)'
        }}
      />
      
      {/* Quirky rotating icon */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-300/60 hover:rotate-12 transition-transform duration-300"
        >
          <CalendarIcon className="w-5 h-5 text-gray-700" />
        </div>
        <p className="text-xs font-bold tracking-widest opacity-80 uppercase text-gray-700">
          Right Now
        </p>
      </div>
      
      <div className="space-y-1 relative z-10">
        <p className="text-sm font-medium opacity-80 text-gray-700">
          {formatDate(currentTime)}
        </p>
        <p 
  className="text-2xl font-normal tracking-tight"
  style={{ 
    letterSpacing: '-0.02em',
    fontFeatureSettings: '"tnum"' // Tabular numbers for consistent width
  }}
>
  {formatTime(currentTime).split(':').map((part, idx) => (
    <span key={idx}>
      {part}
      {idx < 2 && (
        <span 
          className={`inline-block transition-opacity duration-200 ${shouldPulse ? 'opacity-100' : 'opacity-40'}`}
        >
          :
        </span>
      )}
    </span>
  ))}
</p>
      </div>

      {/* Fun ticking indicator */}
      <div className="flex gap-1 mt-3">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < (seconds / 5) ? '#4b5563' : '#9ca3af',
              opacity: i < (seconds / 5) ? 0.9 : 0.4
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DateTimeCard

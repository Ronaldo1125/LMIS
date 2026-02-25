import { UsersIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import DashboardHeader from './DashboardComponents/Dashboardheader'
import StatCard from './DashboardComponents/StatCard'
import DateTimeCard from './DashboardComponents/Datetimecard'
import CollectionByCategory from './DashboardComponents/CollectionByCategory'
import RecentAcquisitions from './DashboardComponents/RecentAcquisitions'
import MostDownloadedStats from './DashboardComponents/MostDownloadedStats'
import WebsiteAnalytics from './DashboardComponents/WebsiteAnalytics'
import LoginNotification from './DashboardComponents/LoginNotification'

// ✅ Accept user and setCurrentView from App.jsx
const Dashboard = ({ user, setCurrentView, dark }) => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    {
      title: 'Patrons',
      value: '1,284',
      icon: UsersIcon,
      colorVar: 'var(--dark-blue-2)'
    },
    {
      title: 'Downloads',
      value: '5,432',
      icon: ArrowDownTrayIcon,
      colorVar: 'var(--secondary-1-medium)'
    },
    {
      title: 'Site Visits',
      value: '12,543',
      icon: EyeIcon,
      colorVar: 'var(--secondary-3-medium)'
    },
  ]

  const pageBg  = dark ? '#0a1628' : '#f1f5f9'
  const headerBg = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      {/* Login Success Notification */}
      <LoginNotification />

      {/* Header — ✅ forward both props so navigation and account details work */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: headerBg,
        borderBottom: isSticky ? `1px solid ${headerBorder}` : 'none',
        boxShadow: isSticky ? (dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.08)') : 'none',
        transition: 'background 0.45s ease, box-shadow 0.3s ease, border-color 0.45s ease',
      }}>
        <DashboardHeader user={user} setCurrentView={setCurrentView} dark={dark} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginTop: '1.5rem' }}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorVar={stat.colorVar}
            dark={dark}
          />
        ))}
        <DateTimeCard dark={dark} />
      </div>

      {/* Collection & Acquisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
        <CollectionByCategory dark={dark} />
        <RecentAcquisitions dark={dark} />
      </div>

      {/* Download Stats */}
      <div style={{ marginTop: '1.5rem' }}>
        <MostDownloadedStats dark={dark} />
      </div>

      {/* Website Analytics */}
      <div style={{ marginTop: '1.5rem' }}>
        <WebsiteAnalytics dark={dark} />
      </div>
    </div>
  )
}

export default Dashboard
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
const Dashboard = ({ user, setCurrentView }) => {
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

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white dark:bg-gray-800 transition-colors duration-300">
      {/* Login Success Notification */}
      <LoginNotification />

      {/* Header — ✅ forward both props so navigation and account details work */}
      <div className={`sticky top-0 z-30 bg-white dark:bg-gray-800 ${isSticky ? 'shadow-md' : ''} transition-colors duration-300`}>
        <DashboardHeader user={user} setCurrentView={setCurrentView} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorVar={stat.colorVar}
          />
        ))}
        <DateTimeCard />
      </div>

      {/* Collection & Acquisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionByCategory />
        <RecentAcquisitions />
      </div>

      {/* Download Stats */}
      <MostDownloadedStats />

      {/* Website Analytics */}
      <WebsiteAnalytics />
    </div>
  )
}

export default Dashboard
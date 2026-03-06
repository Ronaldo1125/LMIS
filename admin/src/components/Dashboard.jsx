import { UsersIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import DashboardHeader from './DashboardComponents/Dashboardheader'
import StatCard from './DashboardComponents/Statcard'
import DateTimeCard from './DashboardComponents/Datetimecard'
import CollectionByCategory from './DashboardComponents/CollectionByCategory'
import RecentAcquisitions from './DashboardComponents/RecentAcquisitions'
import MostDownloadedStats from './DashboardComponents/MostDownloadedStats'
import LoginNotification from './DashboardComponents/LoginNotification'
import SearchAnalytics from './DashboardComponents/SearchAnalytics'

const API_BASE_URL = 'http://localhost:5000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

const Dashboard = ({ user, setCurrentView, dark }) => {
  const [isSticky, setIsSticky] = useState(false)
  const [totalDownloads, setTotalDownloads] = useState('—')
  const [patronCount, setPatronCount] = useState('—')

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const token = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_BASE_URL}/api/uploads/meta/statistics`, { headers })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const total = data.summary?.totalDownloads ?? 0
        setTotalDownloads(total.toLocaleString())
      } catch (err) {
        console.error('[Dashboard] Failed to fetch download stats:', err)
        setTotalDownloads('—')
      }
    }
    fetchDownloads()
  }, [])

  useEffect(() => {
    const fetchPatronCount = async () => {
      try {
        const token = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_BASE_URL}/api/usertype/patrons/count`, { headers })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setPatronCount((data.count ?? 0).toLocaleString())
      } catch (err) {
        console.error('[Dashboard] Failed to fetch patron count:', err)
        setPatronCount('—')
      }
    }
    fetchPatronCount()
  }, [])

  const stats = [
    {
      title: 'Patrons',
      value: patronCount,
      icon: UsersIcon,
      colorVar: 'var(--dark-blue-2)'
    },
    {
      title: 'Downloads',
      value: totalDownloads,
      icon: ArrowDownTrayIcon,
      colorVar: 'var(--secondary-1-medium)'
    },
  ]

  const pageBg       = dark ? '#0a1628' : '#f1f5f9'
  const headerBg     = dark ? '#0d1d35' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e2e8f0'

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: pageBg, transition: 'background 0.45s ease' }}>
      <LoginNotification />

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

      {/* Search Analytics */}
      <div style={{ marginTop: '1.5rem' }}>
        <SearchAnalytics dark={dark} />
      </div>
    </div>
  )
}

export default Dashboard
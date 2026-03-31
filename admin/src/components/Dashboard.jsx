import { UsersIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DashboardHeader from './DashboardComponents/Dashboardheader'
import StatCard from './DashboardComponents/Statcard'
import DateTimeCard from './DashboardComponents/Datetimecard'
import CollectionByCategory from './DashboardComponents/CollectionByCategory'
import RecentAcquisitions from './DashboardComponents/RecentAcquisitions'
import MostDownloadedStats from './DashboardComponents/MostDownloadedStats'
import LoginNotification from './DashboardComponents/LoginNotification'
import DuplicateTitlesDetector from './DashboardComponents/DuplicateTitlesDetector'
import CurrencyOfCollection from './DashboardComponents/CurrencyOfCollection'
import BookmarkStatistics from './DashboardComponents/BookmarkStatistics'

const API_BASE_URL = 'http://localhost:5000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null
}

// ── Section divider label ─────────────────────────────────────────────────────
const SectionLabel = ({ label, gradientFrom, gradientTo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
    <div style={{
      width: 3, height: 14, borderRadius: 99,
      background: `linear-gradient(180deg, ${gradientFrom}, ${gradientTo})`,
      flexShrink: 0,
    }} />
    <span style={{
      fontSize: '0.625rem', fontWeight: 700,
      letterSpacing: '0.11em', textTransform: 'uppercase',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </span>
  </div>
)

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

  // ── Unified tokens ──────────────────────────────────────────────────────
  const pageBg       = dark ? '#07111f' : '#f0f4fa'
  const headerBg     = dark ? '#0c1c34' : '#ffffff'
  const headerBorder = dark ? '#1a3356' : '#e8edf5'
  const labelColor   = dark ? '#2e4d70' : '#94a3b8'

  return (
    <div style={{
      padding: '1.5rem',
      minHeight: '100vh',
      background: pageBg,
      transition: 'background 0.35s ease',
      backgroundImage: dark
        ? 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)'
        : 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '38vw', height: '38vh',
        background: dark
          ? 'radial-gradient(ellipse at top left, rgba(37,99,235,0.07) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at top left, rgba(37,99,235,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: 0, right: 0, width: '32vw', height: '32vh',
        background: dark
          ? 'radial-gradient(ellipse at bottom right, rgba(124,58,237,0.06) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at bottom right, rgba(124,58,237,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-section {
          animation: dashFadeUp 0.45s ease both;
          position: relative;
          z-index: 1;
        }
        .dash-section:nth-child(1) { animation-delay: 0.04s }
        .dash-section:nth-child(2) { animation-delay: 0.08s }
        .dash-section:nth-child(3) { animation-delay: 0.13s }
        .dash-section:nth-child(4) { animation-delay: 0.18s }
        .dash-section:nth-child(5) { animation-delay: 0.23s }
        .dash-section:nth-child(6) { animation-delay: 0.28s }
        .dash-section:nth-child(7) { animation-delay: 0.33s }
      `}</style>

      {/* Login Notification - portaled to body to avoid stacking context issues */}
      {createPortal(<LoginNotification />, document.body)}

      {/* ── Header wrapper — must sit ABOVE all .dash-section children ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,                          /* ← KEY FIX: higher than .dash-section (z-index:1) */
        background: headerBg,
        borderBottom: isSticky ? `1px solid ${headerBorder}` : 'none',
        boxShadow: isSticky
          ? (dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.08)')
          : 'none',
        backdropFilter: isSticky ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isSticky ? 'blur(16px)' : 'none',
        transition: 'background 0.35s ease, box-shadow 0.3s ease, border-color 0.35s ease',
      }}>
        <DashboardHeader user={user} setCurrentView={setCurrentView} dark={dark} />
      </div>

      {/* Stats Row */}
      <div
        className="dash-section"
        style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}
      >
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
      <div className="dash-section" style={{ marginTop: '2rem' }}>
        <div
          style={{
            '--label-c': labelColor,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ '--section-label-color': labelColor }}>
            <CollectionByCategory dark={dark} />
            <RecentAcquisitions dark={dark} />
          </div>
        </div>
      </div>

      {/* Download Stats */}
      <div className="dash-section" style={{ marginTop: '2rem' }}>
        <MostDownloadedStats dark={dark} />
      </div>

      {/* New Widgets */}
      <div className="dash-section" style={{ marginTop: '2rem', paddingBottom: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        <DuplicateTitlesDetector dark={dark} />
        <CurrencyOfCollection dark={dark} />
      </div>=
<BookmarkStatistics dark={dark} />
    </div>
  )
}

export default Dashboard
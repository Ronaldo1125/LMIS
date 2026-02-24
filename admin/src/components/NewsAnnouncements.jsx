import { useState } from 'react'
import NewsManager from './NewsComponents/NewsManager'
import AnnouncementManager from './NewsComponents/AnnouncementManager'
import { NewspaperIcon, MegaphoneIcon } from '@heroicons/react/24/outline'

// Font only — colors unchanged from original
export const FONT_DISPLAY = '"Sora", -apple-system, BlinkMacSystemFont, sans-serif'
export const FONT_BODY    = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
export const INTER = FONT_BODY

const NewsAnnouncements = ({ dark }) => {
  const [activeTab, setActiveTab] = useState('news')

  // ── Original colors — untouched ───────────────────────────────────────────
  const bg          = dark ? '#0d1b2e' : '#ffffff'
  const pageBg      = dark ? '#07111f' : '#f1f5f9'
  const border      = dark ? '#1c2f4a' : '#e2e8f0'
  const textPrimary = dark ? '#e8edf5' : '#0f172a'
  const textMuted   = dark ? '#5a7a99' : '#94a3b8'
  const accent      = '#154A9A'

  const tabs = [
    { id: 'news',          label: 'News Links',    Icon: NewspaperIcon },
    { id: 'announcements', label: 'Announcements', Icon: MegaphoneIcon },
  ]

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />

      <div style={{
        minHeight: '100vh',
        padding: '2.5rem 2.5rem 2.5rem 0',
        background: pageBg,
        fontFamily: FONT_BODY,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transition: 'background 0.4s ease',
      }}>

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{
            margin: '0 0 0.25rem',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accent,
            fontFamily: FONT_BODY,
          }}>
            Content Management
          </p>
          <h1 style={{
            margin: 0,
            fontSize: '1.625rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: textPrimary,
            lineHeight: 1.2,
            fontFamily: FONT_DISPLAY,
          }}>
            News &amp; Announcements
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: textMuted, fontFamily: FONT_BODY }}>
            Publish external news links and send announcements to library patrons and staff.
          </p>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: 'inline-flex',
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '0.625rem',
          padding: '0.3rem',
          marginBottom: '1.75rem',
          boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.07)',
          gap: '0.25rem',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}>
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1.125rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  background: isActive ? (dark ? '#1c3461' : accent) : 'transparent',
                  color: isActive ? '#ffffff' : textMuted,
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 1px 6px rgba(21,74,154,0.35)' : 'none',
                  fontFamily: FONT_BODY,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(21,74,154,0.06)'
                    e.currentTarget.style.color = textPrimary
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = textMuted
                  }
                }}
              >
                <Icon style={{ width: '0.9rem', height: '0.9rem' }} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ fontFamily: FONT_BODY }}>
          {activeTab === 'news'
            ? <NewsManager dark={dark} />
            : <AnnouncementManager dark={dark} />
          }
        </div>
      </div>
    </>
  )
}

export default NewsAnnouncements
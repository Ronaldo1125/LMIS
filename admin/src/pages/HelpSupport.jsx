import { useState } from 'react'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  WrenchScrewdriverIcon,
  Squares2X2Icon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

/* ALL GUIDE CONTENT */
const guideContent = {
  dashboard: [
    { text: 'Dashboard overview and system statistics.' },
    { text: 'Navigate modules using the sidebar menu.' }
  ],
  cataloging: [
    { text: 'Click Add Book to catalog new materials.' },
    { text: 'Fill in ISBN, title, author and classification.' }
  ],
  accessions: [
    { text: 'Record newly arrived books in Accessions.' },
    { text: 'Ensure acquisition date and supplier are correct.' }
  ],
  acquisitions: [
    { text: 'Manage purchase requests and approvals.' },
    { text: 'Track acquisition budget and suppliers.' }
  ],
  usermanagement: [
    { text: 'Add new users and assign roles.' },
    { text: 'Modify permissions and deactivate accounts.' }
  ],
  security: [
    { text: 'Update password policies and access control.' },
    { text: 'Monitor login history and suspicious activity.' }
  ],
  loginproblem: [
    { text: 'Ensure your username and password are correct. Passwords are case-sensitive.' },
    { text: 'If you forgot your password, use the "Forgot Password" link on the login page.' }
  ],
  performanceslowdown: [
    { text: 'Check your internet connection speed. A slow connection can affect system performance.' },
    { text: 'Clear your browser cache and cookies, then reload the page.' }
  ],
  datasync: [
    { text: 'Data Synchronization Errors occur when local and server data conflict.' },
    { text: 'Try refreshing the page or logging out and back in to force a re-sync.' }
  ]
}

const guideLabels = {
  dashboard: 'Dashboard', cataloging: 'Cataloging', accessions: 'Accessions',
  acquisitions: 'Acquisitions', usermanagement: 'User Management', security: 'Security',
  loginproblem: 'Login Problem', performanceslowdown: 'Performance Slowdown',
  datasync: 'Data Synchronization Errors'
}

const systemGuides = [
  { key: 'dashboard',      label: 'Dashboard Guide',       accent: '#0F61F7' },
  { key: 'cataloging',     label: 'Cataloging Guide',      accent: '#3F1BD2' },
  { key: 'accessions',     label: 'Accessions Guide',      accent: '#0891b2' },
  { key: 'acquisitions',   label: 'Acquisitions Guide',    accent: '#059669' },
  { key: 'usermanagement', label: 'User Management Guide', accent: '#d97706' },
  { key: 'security',       label: 'Security Guide',        accent: '#dc2626' },
]

const troubleshootingGuides = [
  { key: 'loginproblem',        label: 'Login Problem',               accent: '#dc2626' },
  { key: 'performanceslowdown', label: 'Performance Slowdown',        accent: '#d97706' },
  { key: 'datasync',            label: 'Data Synchronization Errors', accent: '#7c3aed' },
]

const HelpSupport = ({ setCurrentView, dark }) => {
  const [activeGuide, setActiveGuide] = useState(null)
  const [pageIndex,   setPageIndex]   = useState(0)

  const openGuideModal = (key) => { setActiveGuide(key); setPageIndex(0) }
  const closeModal     = ()    => { setActiveGuide(null); setPageIndex(0) }
  const nextPage = () => { if (pageIndex < guideContent[activeGuide].length - 1) setPageIndex(p => p + 1) }
  const prevPage = () => { if (pageIndex > 0) setPageIndex(p => p - 1) }

  // ── Colors ────────────────────────────────────────────────
  const pageBg        = dark ? '#0a1628' : '#f1f5f9'
  const cardBg        = dark ? '#0f1f38' : '#ffffff'
  const cardBorder    = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5' : '#1e293b'
  const textSecondary = dark ? '#6b8cae' : '#64748b'
  const textMuted     = dark ? '#2e4d70' : '#94a3b8'
  const hoverBg       = dark ? '#0d1d35' : '#f8fafc'
  const divider       = dark ? '#1a3356' : '#e2e8f0'
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const iconColor     = dark ? '#93c5fd' : '#2563eb'
  const imageBg       = dark ? '#081422' : '#f1f5f9'
  const imageText     = dark ? '#2e4d70' : '#94a3b8'
  const modalBg       = dark ? '#0f1f38' : '#ffffff'
  const modalFooterBg = dark ? '#0d1d35' : '#f8fafc'
  const navColor      = dark ? '#6b8cae' : '#9ca3af'
  const navHover      = dark ? '#dde8f5' : '#374151'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '1.5rem', transition: 'background 0.45s ease' }}>

      {/* Back button */}
      <button
        onClick={() => setCurrentView('dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: textSecondary, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, transition: 'color 0.2s ease' }}
        onMouseEnter={e => e.currentTarget.style.color = iconColor}
        onMouseLeave={e => e.currentTarget.style.color = textSecondary}
      >
        <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
        Back to Dashboard
      </button>

      {/* Hero banner */}
      <div style={{
        background: dark
          ? 'linear-gradient(135deg, #0d1d35 0%, #0f1f38 60%, #1a3356 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 60%, #2563eb 100%)',
        borderRadius: '1rem', padding: '2rem', marginBottom: '1.75rem',
        position: 'relative', overflow: 'hidden',
        border: dark ? '1px solid #1a3356' : 'none',
      }}>
        <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '8rem', height: '8rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-1rem', right: '4rem', width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpenIcon style={{ width: '1.5rem', height: '1.5rem', color: '#ffffff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>Help & Support</h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', margin: '0.25rem 0 0' }}>
              Browse guides and troubleshooting resources
            </p>
          </div>
        </div>
      </div>

      {/* Two-column guide cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* System Guide */}
        <GuideCard
          icon={<Squares2X2Icon style={{ width: '1.125rem', height: '1.125rem', color: iconColor }} />}
          title="System Guide"
          subtitle="Step-by-step walkthroughs for each module"
          guides={systemGuides}
          onOpen={openGuideModal}
          dark={dark}
          cardBg={cardBg} cardBorder={cardBorder}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted}
          hoverBg={hoverBg} divider={divider} iconBoxBg={iconBoxBg}
        />

        {/* Troubleshooting */}
        <GuideCard
          icon={<WrenchScrewdriverIcon style={{ width: '1.125rem', height: '1.125rem', color: iconColor }} />}
          title="Troubleshooting"
          subtitle="Solutions to common issues and errors"
          guides={troubleshootingGuides}
          onOpen={openGuideModal}
          dark={dark}
          cardBg={cardBg} cardBorder={cardBorder}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted}
          hoverBg={hoverBg} divider={divider} iconBoxBg={iconBoxBg}
        />

      </div>

      {/* GUIDE MODAL */}
      {activeGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{
            background: modalBg,
            border: dark ? `1px solid ${divider}` : 'none',
            borderRadius: '1rem',
            boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.2)',
            width: '100%', maxWidth: '56rem', height: '85vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'background 0.45s ease',
          }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.125rem 1.5rem', background: dark ? '#0d1d35' : '#1a4f8a', flexShrink: 0 }}>
              <h2 style={{ fontWeight: 600, color: '#ffffff', fontSize: '1rem', margin: 0 }}>
                {guideLabels[activeGuide]} Guide
              </h2>
              <button
                onClick={closeModal}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '0.25rem', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* Image placeholder */}
            <div style={{ margin: '1.25rem 1.5rem 0', flexShrink: 0, height: '22rem', background: imageBg, borderRadius: '0.75rem', border: `1px solid ${divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: imageText, transition: 'background 0.45s ease, border-color 0.45s ease' }}>
              Image Placeholder (Page {pageIndex + 1})
            </div>

            {/* Instruction text */}
            <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto', fontSize: '1rem', color: textPrimary, lineHeight: 1.7, transition: 'color 0.45s ease' }}>
              {guideContent[activeGuide][pageIndex].text}
            </div>

            {/* Navigation footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: `1px solid ${divider}`, flexShrink: 0, background: modalFooterBg, transition: 'background 0.45s ease, border-color 0.45s ease' }}>
              <NavArrow onClick={prevPage} disabled={pageIndex === 0} color={navColor} hoverColor={navHover}>
                <ArrowLeftCircleIcon style={{ width: '2.25rem', height: '2.25rem' }} />
              </NavArrow>
              <span style={{ fontSize: '0.875rem', color: textMuted, fontWeight: 500 }}>
                {pageIndex + 1} / {guideContent[activeGuide].length}
              </span>
              <NavArrow onClick={nextPage} disabled={pageIndex === guideContent[activeGuide].length - 1} color={navColor} hoverColor={navHover}>
                <ArrowRightCircleIcon style={{ width: '2.25rem', height: '2.25rem' }} />
              </NavArrow>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

/* ── Guide Card ───────────────────────────────────────────── */
const GuideCard = ({ icon, title, subtitle, guides, onOpen, dark, cardBg, cardBorder, textPrimary, textSecondary, textMuted, hoverBg, divider, iconBoxBg }) => (
  <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '0.875rem', overflow: 'hidden', boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)', transition: 'background 0.45s ease, border-color 0.45s ease' }}>

    {/* Card header */}
    <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${divider}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: iconBoxBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.45s ease' }}>
        {icon}
      </div>
      <div>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>{title}</h2>
        <p style={{ fontSize: '0.75rem', color: textMuted, margin: '0.125rem 0 0', transition: 'color 0.45s ease' }}>{subtitle}</p>
      </div>
    </div>

    {/* Guide rows */}
    <div>
      {guides.map(({ key, label, accent }, i) => (
        <GuideRow
          key={key}
          label={label}
          accent={accent}
          onClick={() => onOpen(key)}
          isLast={i === guides.length - 1}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          hoverBg={hoverBg}
          divider={divider}
          dark={dark}
        />
      ))}
    </div>
  </div>
)

/* ── Guide Row ────────────────────────────────────────────── */
const GuideRow = ({ label, accent, onClick, isLast, textPrimary, textSecondary, hoverBg, divider, dark }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        width: '100%', textAlign: 'left',
        padding: '0.875rem 1.5rem',
        background: hovered ? hoverBg : 'transparent',
        border: 'none',
        borderBottom: isLast ? 'none' : `1px solid ${divider}`,
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Colored accent pill */}
      <div style={{ width: '0.25rem', height: '1.75rem', borderRadius: '999px', background: accent, flexShrink: 0, opacity: hovered ? 1 : 0.45, transition: 'opacity 0.2s ease' }} />

      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: hovered ? textPrimary : textSecondary, transition: 'color 0.15s ease' }}>
        {label}
      </span>

      <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: hovered ? accent : (dark ? '#2e4d70' : '#d1d5db'), flexShrink: 0, transition: 'color 0.15s ease' }} />
    </button>
  )
}

/* ── Nav Arrow ────────────────────────────────────────────── */
const NavArrow = ({ onClick, disabled, color, hoverColor, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ background: 'transparent', border: 'none', cursor: disabled ? 'default' : 'pointer', color, opacity: disabled ? 0.3 : 1, padding: 0, transition: 'color 0.2s ease' }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = hoverColor }}
    onMouseLeave={e => { e.currentTarget.style.color = color }}
  >
    {children}
  </button>
)

export default HelpSupport
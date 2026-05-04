import { useState } from 'react'
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  ServerStackIcon,
  CodeBracketIcon,
  ChevronRightIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const PDF_PATH = '/src/assets/LMIS_UserManual.pdf'

const HelpSupport = ({ dark = false }) => {
  const [pdfHover, setPdfHover]           = useState(false)
  const [viewHover, setViewHover]         = useState(false)
  const [backendHover, setBackendHover]   = useState(false)
  const [frontendHover, setFrontendHover] = useState(false)
  const [pdfOpen, setPdfOpen]             = useState(false)

  // ── Color tokens ──────────────────────────────────────────────────────────
  const bg            = dark ? '#0a1628'  : '#f0f4fa'
  const cardBg        = dark ? '#0f1f38'  : '#ffffff'
  const cardBorder    = dark ? '#1a3356'  : '#e2e8f0'
  const textPrimary   = dark ? '#dde8f5'  : '#1e293b'
  const textSecondary = dark ? '#6b8cae'  : '#64748b'
  const accent        = '#154A9A'
  const divider       = dark ? '#1a3356'  : '#e2e8f0'
  const badgeBg       = dark ? 'rgba(21,74,154,0.35)' : 'rgba(21,74,154,0.10)'
  const badgeColor    = dark ? '#93c5fd'  : '#154A9A'
  const overlayBg     = dark ? 'rgba(5,12,24,0.92)' : 'rgba(15,31,56,0.82)'

  const cardStyle = (hovered) => ({
    background: cardBg,
    border: `1px solid ${hovered ? accent : cardBorder}`,
    borderRadius: '0.875rem',
    padding: '1.375rem 1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s, background 0.45s',
    boxShadow: hovered
      ? dark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 8px 24px -4px rgba(21,74,154,0.18)'
      : dark ? '0 2px 12px rgba(0,0,0,0.3)'  : '0 1px 4px rgba(0,0,0,0.06)',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    textDecoration: 'none',
  })

  const iconWrap = (color) => ({
    width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
    background: color, display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      transition: 'background 0.45s ease',
      fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
    }}>

      {/* ── PDF Viewer Modal ────────────────────────────────────────────────── */}
      {pdfOpen && (
        <div
          onClick={() => setPdfOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: overlayBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '960px',
              height: '88vh',
              background: dark ? '#0f1f38' : '#ffffff',
              borderRadius: '1rem',
              border: `1px solid ${cardBorder}`,
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: dark
                ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)'
                : 'linear-gradient(135deg, #154A9A 0%, #1d6abf 100%)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <BookOpenIcon style={{ width: '1.125rem', height: '1.125rem', color: '#ffffff' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>
                  LMIS User Manual
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <a
                  href={PDF_PATH}
                  download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.75rem', borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff', fontSize: '0.75rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <ArrowDownTrayIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                  Download
                </a>
                <button
                  onClick={() => setPdfOpen(false)}
                  style={{
                    width: '2rem', height: '2rem', borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <XMarkIcon style={{ width: '1rem', height: '1rem', color: '#ffffff' }} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <iframe
              src={PDF_PATH}
              title="LMIS User Manual"
              style={{ flex: 1, border: 'none', width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: dark
          ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)'
          : 'linear-gradient(135deg, #154A9A 0%, #1d6abf 100%)',
        padding: '2.5rem 2rem 3rem',
        transition: 'background 0.45s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.25rem 0.75rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.15)',
            color: '#ffffff', fontSize: '0.7rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: '0.875rem',
          }}>
            LMIS
          </span>
          <h1 style={{
            margin: '0 0 0.5rem',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Help &amp; Support
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Find answers in the user manual or reach out to the right team.
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '-1.5rem auto 0', padding: '0 2rem 3rem' }}>

        {/* ── Two-column grid ─────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Documentation ─────────────────────────────────────── */}
          <section>
            <SectionLabel label="Documentation" textSecondary={textSecondary} />

            {/* Info card */}
            <div style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: '0.875rem',
              overflow: 'hidden',
              boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'background 0.45s, border-color 0.45s',
            }}>
              {/* Card header strip */}
              <div style={{
                background: dark
                  ? 'linear-gradient(135deg, #0d1d35 0%, #1a3356 100%)'
                  : 'linear-gradient(135deg, #154A9A 0%, #1d6abf 100%)',
                padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={iconWrap('rgba(255,255,255,0.18)')}>
                  <BookOpenIcon style={{ width: '1.375rem', height: '1.375rem', color: '#ffffff' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>
                      LMIS User Manual
                    </span>
                    <span style={{
                      padding: '0.1rem 0.5rem', borderRadius: '999px',
                      background: 'rgba(255,255,255,0.2)',
                      color: '#ffffff', fontSize: '0.6rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>PDF</span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                    Complete guide for all roles &amp; workflows
                  </p>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.8375rem', color: textSecondary, lineHeight: 1.65 }}>
                  This manual covers every feature of the Library Management &amp; Information System —
                  from cataloging and circulation to user management, reports, and administrative settings.
                </p>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPdfOpen(true)}
                    onMouseEnter={() => setViewHover(true)}
                    onMouseLeave={() => setViewHover(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.625rem 1.125rem', borderRadius: '0.625rem',
                      background: viewHover ? (dark ? '#1a3356' : '#154A9A') : accent,
                      color: '#ffffff', fontSize: '0.8125rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.15s',
                      transform: viewHover ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: viewHover ? '0 4px 12px rgba(21,74,154,0.35)' : 'none',
                    }}
                  >
                    <EyeIcon style={{ width: '1rem', height: '1rem' }} />
                    View Manual
                  </button>

                  <a
                    href={PDF_PATH}
                    download
                    onMouseEnter={() => setPdfHover(true)}
                    onMouseLeave={() => setPdfHover(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.625rem 1.125rem', borderRadius: '0.625rem',
                      background: pdfHover
                        ? (dark ? '#1a3356' : '#f1f5f9')
                        : (dark ? '#0f1f38' : '#f8fafc'),
                      color: textPrimary, fontSize: '0.8125rem', fontWeight: 600,
                      border: `1px solid ${cardBorder}`,
                      cursor: 'pointer', textDecoration: 'none',
                      transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                      transform: pdfHover ? 'translateY(-1px)' : 'translateY(0)',
                    }}
                  >
                    <ArrowDownTrayIcon style={{ width: '1rem', height: '1rem', color: textSecondary }} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── RIGHT: Contact Support ───────────────────────────────────── */}
          <section>
            <SectionLabel label="Contact Support" textSecondary={textSecondary} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

              {/* Backend */}
              <a
                href="mailto:anzelbotin@gmail.com"
                style={cardStyle(backendHover)}
                onMouseEnter={() => setBackendHover(true)}
                onMouseLeave={() => setBackendHover(false)}
              >
                <div style={iconWrap(dark ? '#0d2a1a' : '#dcfce7')}>
                  <ServerStackIcon style={{ width: '1.375rem', height: '1.375rem', color: '#16a34a' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
                      Backend Support
                    </span>
                    <span style={{
                      padding: '0.1rem 0.5rem', borderRadius: '999px',
                      background: dark ? 'rgba(22,163,74,0.2)' : '#dcfce7',
                      color: '#16a34a', fontSize: '0.65rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>Server / API</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: textSecondary, lineHeight: 1.55 }}>
                    Database, server errors, authentication, and API-related issues.
                  </p>
                  <ContactEmail email="anzelbotin@gmail.com" hovered={backendHover} accent={accent} textSecondary={textSecondary} />
                </div>
                <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: backendHover ? accent : textSecondary, transition: 'color 0.2s', flexShrink: 0, marginTop: '0.125rem' }} />
              </a>

              {/* Frontend */}
              <a
                href="mailto:jakemacua0561@gmail.com"
                style={cardStyle(frontendHover)}
                onMouseEnter={() => setFrontendHover(true)}
                onMouseLeave={() => setFrontendHover(false)}
              >
                <div style={iconWrap(dark ? '#1e1432' : '#ede9fe')}>
                  <CodeBracketIcon style={{ width: '1.375rem', height: '1.375rem', color: '#7c3aed' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
                      Frontend Support
                    </span>
                    <span style={{
                      padding: '0.1rem 0.5rem', borderRadius: '999px',
                      background: dark ? 'rgba(124,58,237,0.2)' : '#ede9fe',
                      color: '#7c3aed', fontSize: '0.65rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>UI / UX</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: textSecondary, lineHeight: 1.55 }}>
                    Interface bugs, display issues, and user experience concerns.
                  </p>
                  <ContactEmail email="jakemacua0561@gmail.com" hovered={frontendHover} accent="#7c3aed" textSecondary={textSecondary} />
                </div>
                <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: frontendHover ? '#7c3aed' : textSecondary, transition: 'color 0.2s', flexShrink: 0, marginTop: '0.125rem' }} />
              </a>

            </div>
          </section>

        </div>

        {/* ── Footer note ───────────────────────────────────────────────────── */}
        <p style={{
          marginTop: '2.5rem', textAlign: 'center',
          fontSize: '0.75rem', color: textSecondary,
          transition: 'color 0.45s',
        }}>
          Library Management &amp; Information System · LMIS
        </p>
      </div>
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

const SectionLabel = ({ label, textSecondary }) => (
  <p style={{
    margin: '0 0 0.875rem',
    fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: textSecondary, transition: 'color 0.45s',
  }}>
    {label}
  </p>
)

const ContactEmail = ({ email, hovered, accent, textSecondary }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
    <EnvelopeIcon style={{ width: '0.875rem', height: '0.875rem', color: hovered ? accent : textSecondary, transition: 'color 0.2s', flexShrink: 0 }} />
    <span style={{ fontSize: '0.8rem', color: hovered ? accent : textSecondary, fontWeight: 500, transition: 'color 0.2s' }}>
      {email}
    </span>
  </div>
)

export default HelpSupport
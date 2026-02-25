import { useState } from 'react';
import NewsManager from './NewsComponents/NewsManager';
import AnnouncementManager from './NewsComponents/AnnouncementManager';
import { NewspaperIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { Megaphone } from 'lucide-react';

export const FONT_DISPLAY = '"Sora", -apple-system, BlinkMacSystemFont, sans-serif';
export const FONT_BODY    = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const INTER = FONT_BODY;

const NewsAnnouncements = ({ dark }) => {
  const [activeTab, setActiveTab] = useState('news');

  // ── Same tokens as Acquisitions/Accessions header ─────────────────────────
  const pageBg        = dark ? '#07111f' : '#f1f5f9';
  const headerBg      = dark ? '#0d1b2e' : '#ffffff';
  const headerBorder  = dark ? '#1c2f4a' : '#e2e8f0';
  const cardBg        = dark ? '#0f1f38' : '#ffffff';
  const border        = dark ? '#1c2f4a' : '#e2e8f0';
  const textPrimary   = dark ? '#e8edf5' : '#0f172a';
  const textSecondary = dark ? '#5a7a99' : '#64748b';
  const textMuted     = dark ? '#5a7a99' : '#94a3b8';
  const iconBoxBg     = dark ? 'rgba(30,64,175,0.15)' : '#dbeafe';
  const iconColor     = dark ? '#93c5fd' : '#2563eb';
  const accent        = '#154A9A';

  const tabs = [
    { id: 'news',          label: 'News Links',    Icon: NewspaperIcon },
    { id: 'announcements', label: 'Announcements', Icon: MegaphoneIcon },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />

      <div style={{
        minHeight: '100vh',
        background: pageBg,
        fontFamily: FONT_BODY,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transition: 'background 0.45s ease',
      }}>

        {/* ── Header — matches Acquisitions style ──────────────────────────── */}
        <div style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: iconBoxBg, borderRadius: '0.5rem', transition: 'background 0.45s ease' }}>
              <Megaphone style={{ width: '1.5rem', height: '1.5rem', color: iconColor }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease', fontFamily: FONT_DISPLAY }}>
                News & Announcements
              </h1>
              <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, transition: 'color 0.45s ease', fontFamily: FONT_BODY }}>
                Publish external news links and send announcements to library patrons and staff
              </p>
            </div>
          </div>
        </div>

        {/* ── Body — aligned like Acquisitions ─────────────────────────────── */}
        <div className="px-6">
          {/* Sticky tab bar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 40,
            background: pageBg, paddingTop: '1rem', paddingBottom: '1rem',
            transition: 'background 0.45s ease',
          }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
          >
            <div style={{
              display: 'inline-flex',
              background: headerBg,
              border: `1px solid ${border}`,
              borderRadius: '0.625rem',
              padding: '0.3rem',
              boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.07)',
              gap: '0.25rem',
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}>
              {tabs.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.45rem',
                      padding: '0.5rem 1.125rem',
                      borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                      fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.01em',
                      fontFamily: FONT_BODY,
                      background: isActive ? (dark ? '#1c3461' : accent) : 'transparent',
                      color: isActive ? '#ffffff' : textMuted,
                      boxShadow: isActive ? '0 1px 6px rgba(21,74,154,0.35)' : 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Icon style={{ width: '0.9rem', height: '0.9rem' }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div style={{ fontFamily: FONT_BODY }}>
            {activeTab === 'news'
              ? <NewsManager dark={dark} />
              : <AnnouncementManager dark={dark} />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsAnnouncements;
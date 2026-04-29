// C:\Users\Laptop\Desktop\LMIS\admin\src\components\PrivacyTermsComponents\SectionTabs.jsx

import { SECTIONS, FONT_BODY } from './constants'

const SectionTabs = ({ activeSection, onSectionChange, dark, theme }) => {
  const { headerBg, border, textMuted, accent } = theme

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: dark ? '#07111f' : '#f1f5f9',
      paddingTop: '1rem', paddingBottom: '1rem',
      transition: 'background 0.45s ease',
    }}>
      <div style={{
        display: 'flex',           /* ← was inline-flex, now flex so it fills the row */
        width: '100%',             /* ← stretches to the card's column width           */
        background: headerBg,
        border: `1px solid ${border}`,
        borderRadius: '0.625rem',
        padding: '0.3rem',
        boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.07)',
        gap: '0.25rem',
        boxSizing: 'border-box',
        transition: 'background 0.45s ease, border-color 0.45s ease',
      }}>
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              style={{
                flex: 1,                  /* ← each tab shares the space equally */
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.45rem',
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
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SectionTabs
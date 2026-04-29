// C:\Users\Laptop\Desktop\LMIS\admin\src\components\PrivacyTermsComponents\constants.js

export const SECTIONS = [
  { id: 'privacy_policy',      label: 'Privacy Policy',    description: 'Manage your privacy policy content' },
  { id: 'terms_and_conditions', label: 'Terms & Conditions', description: 'Manage terms and conditions content' },
]

export const FONT_DISPLAY = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
export const FONT_BODY    = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export const getTheme = (dark) => ({
  pageBg:        dark ? '#07111f' : '#f1f5f9',
  headerBg:      dark ? '#0d1b2e' : '#ffffff',
  headerBorder:  dark ? '#1c2f4a' : '#e2e8f0',
  cardBg:        dark ? '#0f1f38' : '#ffffff',
  inputBg:       dark ? '#1a3356' : '#f1f5f9',
  border:        dark ? '#1c2f4a' : '#e2e8f0',
  textPrimary:   dark ? '#e8edf5' : '#0f172a',
  textSecondary: dark ? '#5a7a99' : '#64748b',
  textMuted:     dark ? '#5a7a99' : '#94a3b8',
  iconBoxBg:     dark ? 'rgba(30,64,175,0.15)' : '#dbeafe',
  iconColor:     dark ? '#93c5fd' : '#2563eb',
  accent:        '#154A9A',
  danger:        '#ef4444',
  success:       '#059669',
})

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const WebsiteAnalytics = ({ dark }) => {
  const [timeRange, setTimeRange] = useState('week');

  // Data organized by time range
  const analyticsData = {
    week: {
      activityData: [
        { date: 'Mon', views: 245, downloads: 145, searches: 189 },
        { date: 'Tue', views: 298, downloads: 178, searches: 223 },
        { date: 'Wed', views: 356, downloads: 203, searches: 267 },
        { date: 'Thu', views: 312, downloads: 189, searches: 234 },
        { date: 'Fri', views: 387, downloads: 225, searches: 298 },
        { date: 'Sat', views: 267, downloads: 167, searches: 198 },
        { date: 'Sun', views: 198, downloads: 134, searches: 156 }
      ],
      hourlyData: [
        { hour: '12AM', users: 12 },
        { hour: '3AM', users: 8 },
        { hour: '6AM', users: 23 },
        { hour: '9AM', users: 156 },
        { hour: '12PM', users: 234 },
        { hour: '3PM', users: 198 },
        { hour: '6PM', users: 145 },
        { hour: '9PM', users: 89 }
      ],
      metrics: {
        pageViews: '12,847', pageViewsChange: '+18.2%',
        registrations: '234', registrationsChange: '+12.5%',
        searches: '1,687', searchesChange: '+9.4%',
        avgTime: '6m 45s', avgTimeChange: '+2m 18s'
      },
      topSearches: [
        { query: 'economic development plan', count: 234, trend: 'up' },
        { query: 'infrastructure statistics', count: 198, trend: 'up' },
        { query: 'regional development', count: 167, trend: 'down' },
        { query: 'poverty indicators', count: 145, trend: 'up' },
        { query: 'investment policies', count: 123, trend: 'stable' }
      ],
      deviceStats: [
        { device: 'Desktop', percentage: 58, count: 1247, color: '#0F61F7' },
        { device: 'Mobile', percentage: 32, count: 687, color: '#3F1BD2' },
        { device: 'Tablet', percentage: 10, count: 215, color: '#9CA3AF' }
      ]
    },
    month: {
      activityData: [
        { date: 'Week 1', views: 1845, downloads: 1245, searches: 1589 },
        { date: 'Week 2', views: 2198, downloads: 1578, searches: 1823 },
        { date: 'Week 3', views: 2456, downloads: 1803, searches: 2067 },
        { date: 'Week 4', views: 2612, downloads: 1989, searches: 2234 }
      ],
      hourlyData: [
        { hour: '12AM', users: 89 }, { hour: '3AM', users: 56 },
        { hour: '6AM', users: 167 }, { hour: '9AM', users: 1234 },
        { hour: '12PM', users: 1876 }, { hour: '3PM', users: 1543 },
        { hour: '6PM', users: 1098 }, { hour: '9PM', users: 678 }
      ],
      metrics: {
        pageViews: '54,328', pageViewsChange: '+24.7%',
        registrations: '1,056', registrationsChange: '+18.3%',
        searches: '7,234', searchesChange: '+15.8%',
        avgTime: '8m 23s', avgTimeChange: '+3m 45s'
      },
      topSearches: [
        { query: 'digital transformation guide', count: 1876, trend: 'up' },
        { query: 'annual budget reports', count: 1654, trend: 'up' },
        { query: 'policy framework 2026', count: 1432, trend: 'up' },
        { query: 'statistical yearbook', count: 1298, trend: 'stable' },
        { query: 'investment opportunities', count: 1154, trend: 'down' }
      ],
      deviceStats: [
        { device: 'Desktop', percentage: 62, count: 8934, color: '#0F61F7' },
        { device: 'Mobile', percentage: 28, count: 4032, color: '#3F1BD2' },
        { device: 'Tablet', percentage: 10, count: 1440, color: '#9CA3AF' }
      ]
    },
    year: {
      activityData: [
        { date: 'Jan', views: 8234, downloads: 5432, searches: 6789 },
        { date: 'Feb', views: 8876, downloads: 5876, searches: 7234 },
        { date: 'Mar', views: 9432, downloads: 6234, searches: 7876 },
        { date: 'Apr', views: 10123, downloads: 6789, searches: 8432 },
        { date: 'May', views: 10876, downloads: 7234, searches: 9087 },
        { date: 'Jun', views: 11234, downloads: 7654, searches: 9543 },
        { date: 'Jul', views: 10987, downloads: 7432, searches: 9234 },
        { date: 'Aug', views: 11543, downloads: 7876, searches: 9876 },
        { date: 'Sep', views: 12098, downloads: 8234, searches: 10234 },
        { date: 'Oct', views: 12654, downloads: 8654, searches: 10765 },
        { date: 'Nov', views: 13234, downloads: 9087, searches: 11234 },
        { date: 'Dec', views: 13876, downloads: 9543, searches: 11876 }
      ],
      hourlyData: [
        { hour: '12AM', users: 432 }, { hour: '3AM', users: 289 },
        { hour: '6AM', users: 876 }, { hour: '9AM', users: 6543 },
        { hour: '12PM', users: 9876 }, { hour: '3PM', users: 8234 },
        { hour: '6PM', users: 5876 }, { hour: '9PM', users: 3654 }
      ],
      metrics: {
        pageViews: '687,432', pageViewsChange: '+32.4%',
        registrations: '14,567', registrationsChange: '+28.9%',
        searches: '98,234', searchesChange: '+22.6%',
        avgTime: '9m 54s', avgTimeChange: '+4m 32s'
      },
      topSearches: [
        { query: 'comprehensive development plan', count: 23456, trend: 'up' },
        { query: 'annual statistical report', count: 21234, trend: 'up' },
        { query: 'government transparency', count: 19876, trend: 'up' },
        { query: 'economic indicators 2026', count: 18543, trend: 'stable' },
        { query: 'public procurement data', count: 17234, trend: 'up' }
      ],
      deviceStats: [
        { device: 'Desktop', percentage: 65, count: 123456, color: '#0F61F7' },
        { device: 'Mobile', percentage: 25, count: 47543, color: '#3F1BD2' },
        { device: 'Tablet', percentage: 10, count: 19017, color: '#9CA3AF' }
      ]
    }
  };

  const currentData = analyticsData[timeRange];
  const dailyActivityData = currentData.activityData;
  const hourlyTrafficData = currentData.hourlyData;
  const topSearches = currentData.topSearches;
  const deviceStats = currentData.deviceStats;

  // ── Colors ────────────────────────────────────────────────
  const pageBg       = dark ? '#0a1628' : '#f1f5f9'
  const cardBg       = dark ? '#0f1f38' : '#ffffff'
  const cardBorder   = dark ? '#1a3356' : '#e2e8f0'
  const textPrimary  = dark ? '#dde8f5' : '#154A9A'
  const textSecondary = dark ? '#6b8cae' : '#4b5563'
  const textMuted    = dark ? '#2e4d70' : '#6b7280'
  const gridColor    = dark ? '#1a3356' : '#e5e7eb'
  const axisColor    = dark ? '#2e4d70' : '#6b7280'
  const tooltipBg    = dark ? '#0d1d35' : '#ffffff'
  const tooltipBorder = dark ? '#1a3356' : '#e5e7eb'
  const searchRowBg  = dark ? '#081422' : '#f3f4f6'
  const searchRowHover = dark ? '#0d1d35' : '#e5e7eb'
  const trackBg      = dark ? '#1a3356' : '#d1d5db'
  const toggleBg     = dark ? '#081422' : '#ffffff'
  const toggleBorder = dark ? '#1a3356' : '#e2e8f0'

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'background 0.45s ease, border-color 0.45s ease',
  }

  const engagementMetrics = [
    {
      label: 'Total Page Views', value: currentData.metrics.pageViews,
      change: currentData.metrics.pageViewsChange, isPositive: true,
      iconBg: dark ? 'rgba(15,97,247,0.15)' : '#eff6ff',
      iconColor: '#0F61F7', accent: '#0F61F7',
      icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    },
    {
      label: 'New Registrations', value: currentData.metrics.registrations,
      change: currentData.metrics.registrationsChange, isPositive: true,
      iconBg: dark ? 'rgba(63,27,210,0.15)' : '#f5f3ff',
      iconColor: '#3F1BD2', accent: '#3F1BD2',
      icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
    },
    {
      label: 'Search Queries', value: currentData.metrics.searches,
      change: currentData.metrics.searchesChange, isPositive: true,
      iconBg: dark ? 'rgba(255,208,2,0.12)' : '#fefce8',
      iconColor: dark ? '#fde047' : '#ca8a04', accent: '#FFD002',
      icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    },
    {
      label: 'Avg. Time on Site', value: currentData.metrics.avgTime,
      change: currentData.metrics.avgTimeChange, isPositive: true,
      iconBg: dark ? 'rgba(255,166,2,0.15)' : '#fff7ed',
      iconColor: dark ? '#fdba74' : '#ea580c', accent: '#FFA602',
      icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    }
  ];

  return (
    <div style={{ padding: '1.5rem', background: pageBg, minHeight: '100%', transition: 'background 0.45s ease' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>
            Website Analytics Overview
          </h2>
          <p style={{ fontSize: '0.875rem', color: textSecondary, margin: '0.25rem 0 0', transition: 'color 0.45s ease' }}>
            Real-time insights into library usage and engagement
          </p>
        </div>

        {/* Time range toggle */}
        <div style={{
          display: 'flex', gap: '0.375rem',
          background: toggleBg,
          border: `1px solid ${toggleBorder}`,
          borderRadius: '0.5rem',
          padding: '0.25rem',
          boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }}>
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500,
                background: timeRange === range ? '#0F61F7' : 'transparent',
                color: timeRange === range ? '#ffffff' : textSecondary,
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { if (timeRange !== range) e.currentTarget.style.background = dark ? '#1a3356' : '#f1f5f9' }}
              onMouseLeave={e => { if (timeRange !== range) e.currentTarget.style.background = 'transparent' }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {engagementMetrics.map((metric, index) => (
          <div
            key={index}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderLeft: `4px solid ${metric.accent}`,
              borderRadius: '0.75rem',
              padding: '1.25rem',
              display: 'flex', gap: '1rem', alignItems: 'center',
              boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'background 0.45s ease, border-color 0.45s ease, transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = dark ? '0 6px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div style={{
              width: '3.25rem', height: '3.25rem',
              background: metric.iconBg, borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: metric.iconColor,
              transition: 'background 0.45s ease',
            }}>
              {metric.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.375rem' }}>
                {metric.label}
              </p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, margin: '0 0 0.25rem', transition: 'color 0.45s ease' }}>
                {metric.value}
              </h3>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600,
                padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                background: dark ? 'rgba(34,197,94,0.12)' : '#f0fdf4',
                color: dark ? '#86efac' : '#16a34a',
              }}>
                ↑ {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

        {/* Daily Activity Trend */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {timeRange === 'week' ? 'Daily Activity Trends' : timeRange === 'month' ? 'Weekly Activity Trends' : 'Monthly Activity Trends'}
            </h3>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              {[['#0F61F7', 'Views'], ['#3F1BD2', 'Downloads'], [dark ? '#6b8cae' : '#6b7280', 'Searches']].map(([color, label]) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: textSecondary, fontWeight: 500 }}>
                  <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyActivityData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F61F7" stopOpacity={dark ? 0.2 : 0.3} />
                  <stop offset="95%" stopColor="#0F61F7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F1BD2" stopOpacity={dark ? 0.2 : 0.3} />
                  <stop offset="95%" stopColor="#3F1BD2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={axisColor} style={{ fontSize: '12px' }} />
              <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem', color: dark ? '#dde8f5' : '#1e293b', boxShadow: dark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="views" stroke="#0F61F7" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="downloads" stroke="#3F1BD2" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
              <Line type="monotone" dataKey="searches" stroke={dark ? '#6b8cae' : '#6B7280'} strokeWidth={2} dot={{ fill: dark ? '#6b8cae' : '#6B7280', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Traffic Pattern */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: textPrimary, margin: '0 0 1.25rem' }}>
            Peak Usage Hours
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="hour" stroke={axisColor} style={{ fontSize: '11px' }} />
              <YAxis stroke={axisColor} style={{ fontSize: '11px' }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem', color: dark ? '#dde8f5' : '#1e293b' }} />
              <Line type="monotone" dataKey="users" stroke="#0F61F7" strokeWidth={3} dot={{ fill: '#0F61F7', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Top Search Queries */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: textPrimary, margin: '0 0 1.25rem' }}>
            Top Search Queries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topSearches.map((search, index) => (
              <div
                key={index}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem', borderRadius: '0.5rem',
                  background: searchRowBg,
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = searchRowHover}
                onMouseLeave={e => e.currentTarget.style.background = searchRowBg}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <span style={{
                    width: '1.75rem', height: '1.75rem',
                    background: '#0F61F7', color: '#ffffff',
                    borderRadius: '0.375rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: textPrimary, margin: 0, transition: 'color 0.45s ease' }}>
                      {search.query}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: textMuted }}>
                      {search.count.toLocaleString()} searches
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '0.375rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  background: search.trend === 'up' ? (dark ? 'rgba(34,197,94,0.12)' : '#f0fdf4') : search.trend === 'down' ? (dark ? 'rgba(239,68,68,0.12)' : '#fef2f2') : (dark ? '#1a3356' : '#e5e7eb'),
                  color: search.trend === 'up' ? (dark ? '#86efac' : '#16a34a') : search.trend === 'down' ? (dark ? '#fca5a5' : '#dc2626') : (dark ? '#6b8cae' : '#6b7280'),
                }}>
                  {search.trend === 'up' ? (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ) : search.trend === 'down' ? (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  ) : (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: textPrimary, margin: '0 0 1.25rem' }}>
            Access by Device
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {deviceStats.map((device, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary, transition: 'color 0.45s ease' }}>
                    {device.device}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: textSecondary }}>
                    {device.percentage}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', background: trackBg, borderRadius: '999px', overflow: 'hidden', transition: 'background 0.45s ease' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    width: `${device.percentage}%`,
                    background: device.color,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: textMuted }}>
                  {device.count.toLocaleString()} users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteAnalytics;
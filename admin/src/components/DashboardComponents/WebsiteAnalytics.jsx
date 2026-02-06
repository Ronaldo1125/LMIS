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

const WebsiteAnalytics = () => {
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
        pageViews: '12,847',
        pageViewsChange: '+18.2%',
        registrations: '234',
        registrationsChange: '+12.5%',
        searches: '1,687',
        searchesChange: '+9.4%',
        avgTime: '6m 45s',
        avgTimeChange: '+2m 18s'
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
        { hour: '12AM', users: 89 },
        { hour: '3AM', users: 56 },
        { hour: '6AM', users: 167 },
        { hour: '9AM', users: 1234 },
        { hour: '12PM', users: 1876 },
        { hour: '3PM', users: 1543 },
        { hour: '6PM', users: 1098 },
        { hour: '9PM', users: 678 }
      ],
      metrics: {
        pageViews: '54,328',
        pageViewsChange: '+24.7%',
        registrations: '1,056',
        registrationsChange: '+18.3%',
        searches: '7,234',
        searchesChange: '+15.8%',
        avgTime: '8m 23s',
        avgTimeChange: '+3m 45s'
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
        { hour: '12AM', users: 432 },
        { hour: '3AM', users: 289 },
        { hour: '6AM', users: 876 },
        { hour: '9AM', users: 6543 },
        { hour: '12PM', users: 9876 },
        { hour: '3PM', users: 8234 },
        { hour: '6PM', users: 5876 },
        { hour: '9PM', users: 3654 }
      ],
      metrics: {
        pageViews: '687,432',
        pageViewsChange: '+32.4%',
        registrations: '14,567',
        registrationsChange: '+28.9%',
        searches: '98,234',
        searchesChange: '+22.6%',
        avgTime: '9m 54s',
        avgTimeChange: '+4m 32s'
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

  // Get current data based on selected time range
  const currentData = analyticsData[timeRange];
  const dailyActivityData = currentData.activityData;
  const hourlyTrafficData = currentData.hourlyData;
  const topSearches = currentData.topSearches;
  const deviceStats = currentData.deviceStats;

  // User engagement metrics with dynamic data
  const engagementMetrics = [
    { 
      label: 'Total Page Views', 
      value: currentData.metrics.pageViews, 
      change: currentData.metrics.pageViewsChange,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#0F61F7]',
      borderColor: 'border-l-[#0F61F7]'
    },
    { 
      label: 'New Registrations', 
      value: currentData.metrics.registrations, 
      change: currentData.metrics.registrationsChange,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      iconColor: 'text-[#3F1BD2]',
      borderColor: 'border-l-[#3F1BD2]'
    },
    { 
      label: 'Search Queries', 
      value: currentData.metrics.searches, 
      change: currentData.metrics.searchesChange,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-[#FFD002]',
      borderColor: 'border-l-[#FFD002]'
    },
    { 
      label: 'Avg. Time on Site', 
      value: currentData.metrics.avgTime, 
      change: currentData.metrics.avgTimeChange,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FFA602]',
      borderColor: 'border-l-[#FFA602]'
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-7 gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[#154A9A] mb-1">
            Website Analytics Overview
          </h2>
          <p className="text-sm text-gray-600">
            Real-time insights into library usage and engagement
          </p>
        </div>
        <div className="flex gap-1.5 bg-white p-1 rounded-lg shadow-sm">
          <button 
            className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
              timeRange === 'week' 
                ? 'bg-[#0F61F7] text-white' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-[#154A9A]'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
              timeRange === 'month' 
                ? 'bg-[#0F61F7] text-white' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-[#154A9A]'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
              timeRange === 'year' 
                ? 'bg-[#0F61F7] text-white' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-[#154A9A]'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {engagementMetrics.map((metric, index) => (
          <div 
            key={index} 
            className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${metric.borderColor} 
              flex gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
          >
            <div className={`w-[52px] h-[52px] ${metric.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ${metric.iconColor}`}>
              {metric.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                {metric.label}
              </p>
              <h3 className="text-2xl font-bold text-[#154A9A] mb-1">
                {metric.value}
              </h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                metric.isPositive 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-red-600 bg-red-50'
              }`}>
                {metric.isPositive ? '↑' : '↓'} {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Daily Activity Trend */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-[#154A9A]">
              {timeRange === 'week' ? 'Daily Activity Trends' : timeRange === 'month' ? 'Weekly Activity Trends' : 'Monthly Activity Trends'}
            </h3>
            <div className="flex gap-5">
              <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F61F7]"></span>
                Views
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3F1BD2]"></span>
                Downloads
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                Searches
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyActivityData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F61F7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0F61F7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F1BD2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3F1BD2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#0F61F7" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area 
                type="monotone" 
                dataKey="downloads" 
                stroke="#3F1BD2" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDownloads)"
              />
              <Line 
                type="monotone" 
                dataKey="searches" 
                stroke="#6B7280" 
                strokeWidth={2}
                dot={{ fill: '#6B7280', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Traffic Pattern */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#154A9A] mb-5">
            Peak Usage Hours
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
              <XAxis 
                dataKey="hour" 
                stroke="#6B7280"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#0F61F7" 
                strokeWidth={3}
                dot={{ fill: '#0F61F7', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Search Queries */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#154A9A] mb-5">
            Top Search Queries
          </h3>
          <div className="space-y-3">
            {topSearches.map((search, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-7 h-7 bg-[#0F61F7] text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-[#154A9A]">
                      {search.query}
                    </p>
                    <span className="text-xs text-gray-500">
                      {search.count.toLocaleString()} searches
                    </span>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold ${
                  search.trend === 'up' 
                    ? 'bg-green-50 text-green-600' 
                    : search.trend === 'down' 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {search.trend === 'up' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : search.trend === 'down' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#154A9A] mb-5">
            Access by Device
          </h3>
          <div className="space-y-5">
            {deviceStats.map((device, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#154A9A]">
                    {device.device}
                  </span>
                  <span className="text-base font-bold text-gray-600">
                    {device.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: device.color
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">
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

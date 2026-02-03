import { UsersIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'
import DashboardHeader from './DashboardComponents/DashboardHeader'
import StatCard from './DashboardComponents/StatCard'
import DateTimeCard from './DashboardComponents/Datetimecard'
import CollectionByCategory from './DashboardComponents/CollectionByCategory'
import RecentAcquisitions from './DashboardComponents/RecentAcquisitions'
import MostDownloadedStats from './DashboardComponents/MostDownloadedStats'
import WebsiteAnalytics from './DashboardComponents/WebsiteAnalytics'

const Dashboard = () => {
  const stats = [
    {
      title: 'Patrons',
      value: '1,284',
      icon: UsersIcon,
      colorVar: 'var(--dark-blue-2)'
    },
    {
      title: 'Downloads',
      value: '5,432',
      icon: ArrowDownTrayIcon,
      colorVar: 'var(--secondary-1-medium)'
    },
    {
      title: 'Site Visits',
      value: '12,543',
      icon: EyeIcon,
      colorVar: 'var(--secondary-3-medium)'
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorVar={stat.colorVar}
          />
        ))}
        
        {/* Date & Time Card */}
        <DateTimeCard />
      </div>

      {/* Collection & Acquisitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionByCategory />
        <RecentAcquisitions />
      </div>
      {/* Download Stats */}
        <MostDownloadedStats />     
      {/* Website Charts */}
        <WebsiteAnalytics />    
    </div>
  )
}

export default Dashboard
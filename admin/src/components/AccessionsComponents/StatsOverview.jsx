import {
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'
import StatCard from './StatCard'

const StatsOverview = ({ accessions }) => {
  const totalAccessions = accessions.length
  const totalItems = accessions.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const pendingReview = accessions.filter(item => item.status === 'Pending Review').length
  const uniqueSources = new Set(accessions.map(item => item.sourceName || 'Unknown')).size

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Accessions"
        value={totalAccessions}
        icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />

      <StatCard
        label="Items Received"
        value={totalItems}
        icon={<DocumentArrowDownIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />

      <StatCard
        label="Pending Review"
        value={pendingReview}
        subValue="Awaiting cataloging"
        icon={<ClockIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />

      <StatCard
        label="Unique Sources"
        value={uniqueSources}
        icon={<BuildingLibraryIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />
    </div>
  )
}

export default StatsOverview

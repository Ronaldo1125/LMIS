import { 
  BookOpenIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import StatCard from './StatCard'

const StatsOverview = ({ books }) => {
  // Items without ISBN/ISSN
  const itemsWithoutIdentifiers = books.filter(
    book => !book.isbn && !book.issn
  ).length

  // Most common publisher
  const publisherCounts = books.reduce((acc, book) => {
    const publisher = book.publisher || 'Unknown'
    acc[publisher] = (acc[publisher] || 0) + 1
    return acc
  }, {})
  
  const mostCommonPublisher = Object.entries(publisherCounts).length > 0
    ? Object.entries(publisherCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    : 'N/A'
  
  const mostCommonPublisherCount = publisherCounts[mostCommonPublisher] || 0

  // Recently cataloged (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentlyCataloged = books.filter(book => {
    const catalogDate = new Date(book.catalogDate || book.dateAdded)
    return catalogDate >= thirtyDaysAgo
  }).length

  // Total books
  const totalBooks = books.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Books"
        value={totalBooks}
        icon={<BookOpenIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />
      
      <StatCard
        label="Missing ISBN/ISSN"
        value={itemsWithoutIdentifiers}
        icon={<ExclamationTriangleIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />
      
      <StatCard
        label="Most Common Publisher"
        value={mostCommonPublisher}
        subValue={`${mostCommonPublisherCount} titles`}
        icon={<BuildingLibraryIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />
      
      <StatCard
        label="Recently Cataloged"
        value={recentlyCataloged}
        subValue="Last 30 days"
        icon={<ClockIcon className="w-6 h-6" />}
        color="var(--secondary-1-dark)"
        bgColor="var(--secondary-2-light)"
      />
    </div>
  )
}

export default StatsOverview
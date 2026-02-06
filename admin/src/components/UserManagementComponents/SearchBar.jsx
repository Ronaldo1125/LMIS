import { Search, Filter, UserPlus, UserCog } from 'lucide-react'

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  roleFilter, 
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onAddStaff,
  onAddLibrarian,
  isAdmin 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            style={{ fontFamily: '"Inter", sans-serif' }}
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Filter 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            size={18}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
            style={{ fontFamily: '"Inter", sans-serif', minWidth: '150px' }}
          >
            <option value="All">All Roles</option>
            <option value="Staff">Staff</option>
            <option value="Librarian">Librarian</option>
            <option value="Patron">Patron</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
            style={{ fontFamily: '"Inter", sans-serif', minWidth: '150px' }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons - Only visible to admins */}
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={onAddStaff}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: 'var(--dark-blue-1)',
                color: 'var(--white)',
                fontFamily: '"Inter", sans-serif',
                border: '1px solid var(--dark-blue-2)'
              }}
            >
              <UserPlus size={18} />
              Add Staff
            </button>

            <button
              onClick={onAddLibrarian}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: 'var(--secondary-1-medium)',
                color: 'var(--white)',
                fontFamily: '"Inter", sans-serif',
                border: '1px solid var(--secondary-1-dark)'
              }}
            >
              <UserCog size={18} />
              Add Librarian
            </button>
          </div>
        )}
      </div>

      <style>{`
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23154A9A' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          color: var(--dark-blue-4);
        }
        select:focus {
          border-color: var(--secondary-2-light);
          box-shadow: 0 0 0 2px var(--secondary-2-light);
        }
        button:hover {
          background-color: var(--dark-blue-3) !important;
        }
      `}</style>
    </div>
  )
}

export default SearchBar
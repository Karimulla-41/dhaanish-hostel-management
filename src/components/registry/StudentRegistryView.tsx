import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Building, 
  Eye, 
  HardHat, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import type { AttendanceStatus } from '../../types';

export const StudentRegistryView: React.FC = () => {
  const { 
    students, 
    blocks, 
    filters, 
    setFilters, 
    activeBlockFilter, 
    setActiveBlockFilter,
    quickStatusFilter,
    setQuickStatusFilter,
    setSelectedStudent,
    setIsFilterModalOpen,
    setActiveView,
    resetFilters
  } = useAuth();

  // Filter computation logic
  const filteredStudents = students.filter(student => {
    // Search matching: Name, Reg No, Hostel ID, Room
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchReg = student.regNo.toLowerCase().includes(q);
      const matchHostelId = student.hostelId.toLowerCase().includes(q);
      const matchRoom = student.room.toLowerCase().includes(q);
      if (!matchName && !matchReg && !matchHostelId && !matchRoom) return false;
    }

    // Active Block Pill filter
    if (activeBlockFilter !== 'All' && student.block !== activeBlockFilter) {
      return false;
    }

    // Quick Status Pill filter
    if (quickStatusFilter !== 'All' && student.status !== quickStatusFilter) {
      return false;
    }

    // Advanced Modal Filters
    if (filters.block && student.block !== filters.block) return false;
    if (filters.department && student.department !== filters.department) return false;
    if (filters.year && student.year !== filters.year) return false;
    if (filters.attendanceStatus && student.status !== filters.attendanceStatus) return false;
    if (filters.verificationStatus && student.verificationStatus !== filters.verificationStatus) return false;
    if (filters.floor && student.floor !== filters.floor) return false;
    if (filters.room && !student.room.toLowerCase().includes(filters.room.toLowerCase())) return false;

    return true;
  });

  const statusBadgeClasses: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Absent: 'bg-red-100 text-red-800 border-red-300',
    Outing: 'bg-amber-100 text-amber-900 border-amber-300',
    Leave: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* PAGE HEADING & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-neutral-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-navy-900 tracking-tight">
              Student Registry
            </h1>
            <span className="bg-navy-100 text-navy-800 text-xs px-2.5 py-0.5 rounded font-bold border border-navy-200">
              {filteredStudents.length} Records
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Manage and monitor hostel student records across active residential blocks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-white hover:bg-neutral-100 text-navy-900 border border-neutral-300 text-xs font-semibold px-3 py-2 rounded flex items-center space-x-1.5 shadow-sm transition"
          >
            <Filter className="w-3.5 h-3.5 text-navy-700" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => setActiveView('signup')}
            className="bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold px-3.5 py-2 rounded flex items-center space-x-1.5 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Registration</span>
          </button>
        </div>
      </div>

      {/* TOP SEARCH BAR */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-subtle space-y-4">
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name, Register Number, Hostel ID or Room Number..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-neutral-50 text-navy-900 placeholder-neutral-400 text-xs sm:text-sm rounded-md pl-11 pr-4 py-2.5 border border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent transition"
          />
        </div>

        {/* QUICK STATUS FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-neutral-500 mr-2 shrink-0">Quick Status:</span>
            {['All', 'Present', 'Absent', 'Outing', 'Leave'].map((status) => (
              <button
                key={status}
                onClick={() => setQuickStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 ${
                  quickStatusFilter === status
                    ? 'bg-navy-700 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                {status === 'All' ? 'All Students' : status}
              </button>
            ))}
          </div>

          {(filters.search || filters.block || filters.department || filters.year || activeBlockFilter !== 'All' || quickStatusFilter !== 'All') && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-red-700 hover:underline font-semibold flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}

        </div>

        {/* HOSTEL BLOCKS SELECTOR PILLS */}
        <div className="pt-2 border-t border-neutral-100">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Hostel Blocks Selector:
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs">
            
            {/* All Blocks */}
            <button
              onClick={() => setActiveBlockFilter('All')}
              className={`px-3 py-1.5 rounded font-semibold transition border ${
                activeBlockFilter === 'All'
                  ? 'bg-navy-800 text-white border-navy-900 font-bold'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300'
              }`}
            >
              All Blocks (A–E)
            </button>

            {/* Blocks A to E Active */}
            {blocks.map(b => {
              const isUnderConstruction = b.status === 'Under Construction';

              if (isUnderConstruction) {
                return (
                  <div
                    key={b.name}
                    className="px-3 py-1.5 rounded bg-neutral-100 text-neutral-400 border border-neutral-200 font-medium flex items-center space-x-1.5 cursor-not-allowed opacity-75"
                    title="Block F is currently under construction and not selectable for student allocation"
                  >
                    <HardHat className="w-3.5 h-3.5 text-amber-600" />
                    <span>{b.name}</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                      Under Construction
                    </span>
                  </div>
                );
              }

              const isSelected = activeBlockFilter === b.name;
              return (
                <button
                  key={b.name}
                  onClick={() => setActiveBlockFilter(b.name)}
                  className={`px-3 py-1.5 rounded font-semibold transition border flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-navy-700 text-white border-navy-800'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{b.name}</span>
                </button>
              );
            })}

          </div>
        </div>

      </div>

      {/* STUDENT DATA TABLE (DESKTOP) & CARDS (MOBILE) */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-subtle overflow-hidden">
        
        {/* Table Header Info */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
          <span className="font-bold text-navy-900">
            Showing {filteredStudents.length} Hostel Residents
          </span>
          <span className="text-neutral-500 text-[11px]">
            Click any record to inspect complete profile & activity timeline
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-3">
            <Building className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="font-semibold text-sm text-navy-900">No student records match the applied filters.</p>
            <button
              onClick={resetFilters}
              className="bg-navy-700 text-white text-xs font-semibold px-4 py-2 rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-navy-700 text-white font-semibold tracking-wider text-[11px] uppercase border-b border-navy-800">
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Register No.</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Block</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Hostel ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="table-row-hover cursor-pointer transition text-neutral-800"
                    >
                      <td className="py-2.5 px-4">
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-300 shadow-sm"
                        />
                      </td>

                      <td className="py-2.5 px-4 font-bold text-navy-900">
                        {s.name}
                        {s.verificationStatus === 'Pending Verification' && (
                          <span className="block text-[9px] text-amber-700 font-semibold">
                            ⚠️ Pending Approval
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-4 font-mono text-neutral-700">
                        {s.regNo}
                      </td>

                      <td className="py-2.5 px-4 font-medium text-neutral-700">
                        {s.department}
                      </td>

                      <td className="py-2.5 px-4 text-neutral-600">
                        {s.year}
                      </td>

                      <td className="py-2.5 px-4 font-semibold text-navy-800">
                        {s.block}
                      </td>

                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-700">
                        {s.room}
                      </td>

                      <td className="py-2.5 px-4 font-mono text-amber-800 font-semibold">
                        {s.hostelId}
                      </td>

                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeClasses[s.status]}`}>
                          ● {s.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(s);
                          }}
                          className="bg-navy-50 hover:bg-navy-100 text-navy-800 px-2.5 py-1 rounded text-[11px] font-semibold border border-navy-200 inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="md:hidden divide-y divide-neutral-200">
              {filteredStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="p-4 hover:bg-neutral-50 cursor-pointer space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm">{s.name}</h4>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          {s.regNo} • {s.hostelId}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeClasses[s.status]}`}>
                      ● {s.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200">
                    <div>
                      <span className="text-neutral-400">Block/Room:</span>{' '}
                      <strong className="text-navy-900">{s.block} ({s.room})</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Dept/Year:</span>{' '}
                      <strong className="text-neutral-800">{s.department} ({s.year})</strong>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <span className="text-[11px] text-navy-700 font-semibold flex items-center space-x-1">
                      <span>View Full Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  );
};

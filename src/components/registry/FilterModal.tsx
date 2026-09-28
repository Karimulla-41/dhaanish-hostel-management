import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, RotateCcw, Filter, Check } from 'lucide-react';

export const FilterModal: React.FC = () => {
  const { isFilterModalOpen, setIsFilterModalOpen, filters, setFilters, resetFilters } = useAuth();

  if (!isFilterModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-neutral-300 overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-navy-700 text-white px-5 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-300" />
            <span>Advanced Student Registry Filters</span>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="text-neutral-300 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Form Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Hostel Block */}
          <div>
            <label className="block font-bold text-navy-900 mb-1.5">Hostel Block</label>
            <select
              value={filters.block}
              onChange={(e) => setFilters(prev => ({ ...prev, block: e.target.value }))}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
            >
              <option value="">All Blocks (Block A to Block E)</option>
              <option value="Block A">Block A (Senior Boys)</option>
              <option value="Block B">Block B (Junior Boys)</option>
              <option value="Block C">Block C (Girls Block 1)</option>
              <option value="Block D">Block D (Girls Block 2)</option>
              <option value="Block E">Block E (International Wing)</option>
              <option value="Block F" disabled>Block F (Under Construction - Disabled)</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block font-bold text-navy-900 mb-1.5">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
            >
              <option value="">All Departments</option>
              {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'EEE'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block font-bold text-navy-900 mb-1.5">Academic Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
            >
              <option value="">All Academic Years</option>
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Attendance Status */}
          <div>
            <label className="block font-bold text-navy-900 mb-1.5">Attendance Status</label>
            <select
              value={filters.attendanceStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, attendanceStatus: e.target.value }))}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
            >
              <option value="">All Statuses (Present, Absent, Outing, Leave)</option>
              <option value="Present">Present (In Hostel)</option>
              <option value="Absent">Absent (Unexcused)</option>
              <option value="Outing">Outing (Authorized Pass)</option>
              <option value="Leave">Leave (Home Visit)</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block font-bold text-navy-900 mb-1.5">Verification Status</label>
            <select
              value={filters.verificationStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, verificationStatus: e.target.value }))}
              className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
            >
              <option value="">All Registration Statuses</option>
              <option value="Active">Active (Verified Resident)</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>
          </div>

          {/* Floor & Room Filter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-navy-900 mb-1">Floor</label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters(prev => ({ ...prev, floor: e.target.value }))}
                className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
              >
                <option value="">All Floors</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="4th Floor">4th Floor</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-navy-900 mb-1">Room Number</label>
              <input
                type="text"
                placeholder="e.g. A-204"
                value={filters.room}
                onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
                className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-between items-center">
          <button
            onClick={resetFilters}
            className="text-neutral-600 hover:text-navy-900 font-semibold flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-4 py-2 rounded flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>

      </div>
    </div>
  );
};

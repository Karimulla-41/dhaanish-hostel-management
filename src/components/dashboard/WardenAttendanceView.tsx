import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Home, 
  RotateCcw,
  Building,
  GraduationCap,
  Eye,
  Filter
} from 'lucide-react';
import type { AttendanceStatus, Department, HostelBlock } from '../../types';

interface WardenAttendanceViewProps {
  onBack: () => void;
}

export const WardenAttendanceView: React.FC<WardenAttendanceViewProps> = ({ onBack }) => {
  const { students, updateStudentAttendanceStatus, setSelectedStudent } = useAuth();

  // Local state for Attendance View filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AttendanceStatus>('All');
  const [blockFilter, setBlockFilter] = useState<'All' | HostelBlock>('All');
  const [deptFilter, setDeptFilter] = useState<'All' | Department>('All');

  // Filter computation
  const filteredStudents = students.filter(student => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = student.name.toLowerCase().includes(q);
      const matchReg = student.regNo.toLowerCase().includes(q);
      const matchRoom = student.room.toLowerCase().includes(q);
      const matchHostelId = student.hostelId.toLowerCase().includes(q);
      if (!matchName && !matchReg && !matchRoom && !matchHostelId) return false;
    }

    // 2. Status Filter
    if (statusFilter !== 'All' && student.status !== statusFilter) {
      return false;
    }

    // 3. Block Filter
    if (blockFilter !== 'All' && student.block !== blockFilter) {
      return false;
    }

    // 4. Dept Filter
    if (deptFilter !== 'All' && student.department !== deptFilter) {
      return false;
    }

    return true;
  });

  // Calculate live statistics
  const totalCount = students.length;
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const leaveCount = students.filter(s => s.status === 'Leave').length;
  const outingCount = students.filter(s => s.status === 'Outing').length;

  const filteredPresent = filteredStudents.filter(s => s.status === 'Present').length;
  const filteredAbsent = filteredStudents.filter(s => s.status === 'Absent').length;
  const filteredLeave = filteredStudents.filter(s => s.status === 'Leave').length;
  const filteredOuting = filteredStudents.filter(s => s.status === 'Outing').length;

  const statusBadgeClasses: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Absent: 'bg-red-100 text-red-800 border-red-300',
    Outing: 'bg-amber-100 text-amber-900 border-amber-300',
    Leave: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || blockFilter !== 'All' || deptFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setBlockFilter('All');
    setDeptFilter('All');
  };

  return (
    <div className="max-w-6xl mx-auto w-full my-auto space-y-6 py-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Back to Options</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-navy-700" />
              <span>1. ATTENDANCE ROLL CALL REGISTRY</span>
            </h1>
            <p className="text-xs text-neutral-500">
              Hostel Night Roll Call & Residency Status Management — Dhaanish Chennai
            </p>
          </div>
        </div>

        <div className="bg-navy-50 border border-navy-200 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2 shrink-0">
          <span className="font-bold text-navy-900">Total Hostellers:</span>
          <span className="bg-navy-700 text-white font-bold px-2 py-0.5 rounded text-[11px]">
            {totalCount} Students
          </span>
        </div>
      </div>

      {/* STATS OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {/* ALL */}
        <button
          onClick={() => setStatusFilter('All')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'All'
              ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-navy-600'
              : 'bg-white text-navy-900 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-80 uppercase">Total Roster</div>
          <div className="text-xl font-bold mt-1">{statusFilter === 'All' ? filteredStudents.length : totalCount}</div>
          <div className="text-[10px] opacity-70 mt-0.5">Filter matching count</div>
        </button>

        {/* PRESENT */}
        <button
          onClick={() => setStatusFilter('Present')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'Present'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-800 uppercase flex items-center justify-between">
            <span>Present</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold mt-1 text-emerald-900">{statusFilter === 'Present' ? filteredPresent : presentCount}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">In Room / Hostel</div>
        </button>

        {/* ABSENT */}
        <button
          onClick={() => setStatusFilter('Absent')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'Absent'
              ? 'bg-red-800 text-white border-red-900 shadow-md ring-2 ring-red-600'
              : 'bg-red-50 text-red-950 border-red-200 hover:bg-red-100'
          }`}
        >
          <div className="text-[11px] font-semibold text-red-800 uppercase flex items-center justify-between">
            <span>Absent</span>
            <XCircle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="text-xl font-bold mt-1 text-red-900">{statusFilter === 'Absent' ? filteredAbsent : absentCount}</div>
          <div className="text-[10px] text-red-700 mt-0.5">Unexcused Absence</div>
        </button>

        {/* LEAVE */}
        <button
          onClick={() => setStatusFilter('Leave')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'Leave'
              ? 'bg-blue-800 text-white border-blue-900 shadow-md ring-2 ring-blue-600'
              : 'bg-blue-50 text-blue-950 border-blue-200 hover:bg-blue-100'
          }`}
        >
          <div className="text-[11px] font-semibold text-blue-800 uppercase flex items-center justify-between">
            <span>Home Leave</span>
            <Home className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold mt-1 text-blue-900">{statusFilter === 'Leave' ? filteredLeave : leaveCount}</div>
          <div className="text-[10px] text-blue-700 mt-0.5">Official Permission</div>
        </button>

        {/* OUTING */}
        <button
          onClick={() => setStatusFilter('Outing')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'Outing'
              ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-600'
              : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-900 uppercase flex items-center justify-between">
            <span>Local Outing</span>
            <Clock className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-xl font-bold mt-1 text-amber-950">{statusFilter === 'Outing' ? filteredOuting : outingCount}</div>
          <div className="text-[10px] text-amber-800 mt-0.5">Timed Gate Pass</div>
        </button>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-xl border border-neutral-300 shadow-md p-4 space-y-4 text-xs">
        
        {/* Top Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Top Search Bar — Search by Student Name, Register Number (e.g. 23CSE1045), Room (e.g. A-204), or Hostel ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-2 focus:ring-navy-600 focus:outline-none bg-neutral-50 focus:bg-white transition"
          />
        </div>

        {/* Filter Rows: Status, Block, Department */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-600 px-2 flex items-center space-x-1">
                <Filter className="w-3 h-3 text-navy-700" />
                <span>Status:</span>
              </span>
              {(['All', 'Present', 'Absent', 'Leave', 'Outing'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded font-bold text-[11px] transition ${
                    statusFilter === st
                      ? 'bg-navy-700 text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Block-Wise Filter Dropdown */}
            <div className="flex items-center space-x-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-300">
              <Building className="w-3.5 h-3.5 text-navy-700" />
              <label className="font-bold text-navy-900 text-[11px]">Block:</label>
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value as any)}
                className="bg-white border border-neutral-300 rounded px-2 py-1 font-bold text-navy-900 text-xs focus:ring-1 focus:ring-navy-600"
              >
                <option value="All">All Blocks (A–F)</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
                <option value="Block E">Block E</option>
                <option value="Block F" disabled>Block F (Under Construction)</option>
              </select>
            </div>

            {/* Dept-Wise Filter Dropdown */}
            <div className="flex items-center space-x-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-300">
              <GraduationCap className="w-3.5 h-3.5 text-navy-700" />
              <label className="font-bold text-navy-900 text-[11px]">Department:</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value as any)}
                className="bg-white border border-neutral-300 rounded px-2 py-1 font-bold text-navy-900 text-xs focus:ring-1 focus:ring-navy-600"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AI&DS">AI&DS</option>
                <option value="IT">IT</option>
                <option value="EEE">EEE</option>
              </select>
            </div>

          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

        </div>
      </div>

      {/* REGISTRY LIST TABLE (DOWN REGISTRY LIST) */}
      <div className="bg-white rounded-xl border border-neutral-300 shadow-xl overflow-hidden text-xs">
        
        {/* Table Header Info */}
        <div className="px-5 py-3 bg-navy-50 border-b border-neutral-200 flex justify-between items-center">
          <span className="font-bold text-navy-900">
            Showing {filteredStudents.length} Students in Registry
          </span>
          <span className="text-neutral-500 text-[11px]">
            Warden Attendance Control: Click any status button to update student roll call
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-3">
            <Users className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="font-bold text-navy-900 text-sm">No student registry records match your selected filters.</p>
            <p className="text-xs text-neutral-500">Try adjusting your search term, block filter, or department filter.</p>
            <button
              onClick={resetAllFilters}
              className="bg-navy-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-navy-700 text-white font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-3">Student Info</th>
                  <th className="p-3">Register No.</th>
                  <th className="p-3">Dept & Year</th>
                  <th className="p-3">Block & Room</th>
                  <th className="p-3">Parent Contact</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Quick Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-neutral-50 transition">
                    
                    {/* Student Info */}
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={student.photoUrl} 
                          alt={student.name} 
                          className="w-9 h-9 rounded-full object-cover border border-neutral-300 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-navy-900 text-sm flex items-center space-x-1">
                            <span>{student.name}</span>
                          </div>
                          <div className="text-[10px] text-amber-800 font-mono font-semibold">
                            ID: {student.hostelId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Register No */}
                    <td className="p-3 font-mono font-semibold text-neutral-800">
                      {student.regNo}
                    </td>

                    {/* Dept & Year */}
                    <td className="p-3 text-neutral-700 font-medium">
                      {student.department} • <span className="text-neutral-500">{student.year}</span>
                    </td>

                    {/* Block & Room */}
                    <td className="p-3">
                      <div className="font-bold text-navy-900">{student.block}</div>
                      <div className="text-[11px] font-mono text-neutral-600">Room {student.room} (Bed {student.bedNo.slice(-1)})</div>
                    </td>

                    {/* Parent Contact */}
                    <td className="p-3">
                      <div className="font-semibold text-neutral-800">{student.parentName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{student.parentContact}</div>
                    </td>

                    {/* Current Status Badge */}
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border inline-block ${statusBadgeClasses[student.status]}`}>
                        ● {student.status}
                      </span>
                    </td>

                    {/* Quick Mark Attendance Action Buttons */}
                    <td className="p-3 text-right">
                      <div className="inline-flex space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                        {(['Present', 'Absent', 'Leave', 'Outing'] as AttendanceStatus[]).map(st => {
                          const isActive = student.status === st;
                          return (
                            <button
                              key={st}
                              onClick={() => updateStudentAttendanceStatus(student.id, st)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                                isActive
                                  ? st === 'Present' ? 'bg-emerald-700 text-white shadow-sm'
                                    : st === 'Absent' ? 'bg-red-700 text-white shadow-sm'
                                    : st === 'Leave' ? 'bg-blue-700 text-white shadow-sm'
                                    : 'bg-amber-700 text-white shadow-sm'
                                  : 'text-neutral-600 hover:text-navy-900 hover:bg-neutral-200'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="ml-2 bg-navy-50 text-navy-800 hover:bg-navy-100 p-1.5 rounded border border-navy-200 inline-flex items-center text-[10px] font-semibold"
                        title="View Full Student Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

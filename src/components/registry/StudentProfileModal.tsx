import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  User, 
  Users, 
  Clock, 
  Activity, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ClipboardCheck,
  Building2
} from 'lucide-react';
import type { AttendanceStatus } from '../../types';

export const StudentProfileModal: React.FC = () => {
  const { 
    selectedStudent, 
    setSelectedStudent, 
    updateStudentAttendanceStatus, 
    approveStudentVerification 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'all' | 'attendance' | 'outing' | 'requests' | 'complaints'>('all');

  if (!selectedStudent) return null;

  const s = selectedStudent;

  const statusBadges: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Absent: 'bg-red-100 text-red-800 border-red-300',
    Outing: 'bg-amber-100 text-amber-900 border-amber-300',
    Leave: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const filteredHistory = s.activityHistory.filter(act => {
    if (activeTab === 'all') return true;
    if (activeTab === 'attendance') return act.type === 'Attendance';
    if (activeTab === 'outing') return act.type === 'Outing';
    if (activeTab === 'requests') return act.type === 'Request';
    if (activeTab === 'complaints') return act.type === 'Complaint';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-neutral-300 overflow-hidden my-auto text-xs">
        
        {/* Header Bar */}
        <div className="bg-navy-700 text-white p-4 sm:p-5 flex justify-between items-start border-b-4 border-crimson-800">
          <div className="flex items-center space-x-4">
            <img
              src={s.photoUrl}
              alt={s.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{s.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${statusBadges[s.status]}`}>
                  ● {s.status}
                </span>
                {s.verificationStatus === 'Pending Verification' && (
                  <span className="bg-amber-400 text-navy-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Reg No: <span className="font-semibold text-white">{s.regNo}</span> | Hostel ID: <span className="font-semibold text-amber-300">{s.hostelId}</span>
              </p>
              <p className="text-[11px] text-neutral-300">
                {s.department} • {s.year} • {s.block} (Room {s.room}, Bed {s.bedNo})
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedStudent(null)}
            className="text-neutral-300 hover:text-white p-1 rounded bg-navy-800 hover:bg-navy-600 border border-navy-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Action Banner if Pending */}
        {s.verificationStatus === 'Pending Verification' && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>This student profile requires official Warden Verification.</span>
            </div>
            <button
              onClick={() => approveStudentVerification(s.id)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded text-xs flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Activate Resident</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Grid Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Section 1: Personal Information */}
            <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200">
              <h3 className="font-bold text-navy-900 uppercase text-[11px] tracking-wider mb-2 flex items-center space-x-1.5 border-b border-neutral-200 pb-1">
                <User className="w-3.5 h-3.5 text-navy-700" />
                <span>Personal Information</span>
              </h3>
              <div className="space-y-1.5 text-neutral-700 text-[11px]">
                <div><span className="font-semibold text-neutral-500">Name:</span> {s.name}</div>
                <div><span className="font-semibold text-neutral-500">Reg No:</span> {s.regNo}</div>
                <div><span className="font-semibold text-neutral-500">Dept:</span> {s.department}</div>
                <div><span className="font-semibold text-neutral-500">Year:</span> {s.year}</div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center space-x-1 truncate">
                  <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Hostel Information */}
            <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200">
              <h3 className="font-bold text-navy-900 uppercase text-[11px] tracking-wider mb-2 flex items-center space-x-1.5 border-b border-neutral-200 pb-1">
                <Building2 className="w-3.5 h-3.5 text-navy-700" />
                <span>Hostel Information</span>
              </h3>
              <div className="space-y-1.5 text-neutral-700 text-[11px]">
                <div><span className="font-semibold text-neutral-500">Block:</span> <strong className="text-navy-900">{s.block}</strong></div>
                <div><span className="font-semibold text-neutral-500">Floor:</span> {s.floor}</div>
                <div><span className="font-semibold text-neutral-500">Room:</span> {s.room}</div>
                <div><span className="font-semibold text-neutral-500">Bed No:</span> {s.bedNo}</div>
                <div><span className="font-semibold text-neutral-500">Hostel ID:</span> <strong className="text-amber-800">{s.hostelId}</strong></div>
                <div><span className="font-semibold text-neutral-500">Join Date:</span> {s.joinDate}</div>
              </div>
            </div>

            {/* Section 3: Parent / Guardian & Current Status Quick Action */}
            <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy-900 uppercase text-[11px] tracking-wider mb-2 flex items-center space-x-1.5 border-b border-neutral-200 pb-1">
                  <Users className="w-3.5 h-3.5 text-navy-700" />
                  <span>Parent / Guardian</span>
                </h3>
                <div className="space-y-1.5 text-neutral-700 text-[11px]">
                  <div><span className="font-semibold text-neutral-500">Guardian Name:</span> {s.parentName}</div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-emerald-600 font-bold" />
                    <span className="font-semibold text-navy-900">{s.parentContact}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Button */}
              <div className="mt-3 pt-2 border-t border-neutral-200">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Update Resident Status:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {(['Present', 'Absent', 'Outing', 'Leave'] as AttendanceStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateStudentAttendanceStatus(s.id, st)}
                      className={`py-1 px-1.5 rounded text-[10px] font-bold border text-center transition ${
                        s.status === st
                          ? 'bg-navy-700 text-white border-navy-800'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Section 5: Activity History */}
          <div className="bg-white rounded border border-neutral-200">
            <div className="p-3 bg-neutral-100 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-navy-900 text-xs uppercase tracking-wide flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-navy-700" />
                <span>Activity & Outing Log History</span>
              </h3>

              {/* Filter Tabs */}
              <div className="flex space-x-1 text-[10px]">
                {[
                  { id: 'all', label: 'All Logs' },
                  { id: 'attendance', label: 'Attendance' },
                  { id: 'outing', label: 'Outings' },
                  { id: 'requests', label: 'Requests' },
                  { id: 'complaints', label: 'Complaints' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-2 py-1 rounded font-semibold transition ${
                      activeTab === t.id
                        ? 'bg-navy-700 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Table */}
            <div className="divide-y divide-neutral-100">
              {filteredHistory.length === 0 ? (
                <div className="p-6 text-center text-neutral-400 text-xs">
                  No activity logs found for selected category.
                </div>
              ) : (
                filteredHistory.map(act => (
                  <div key={act.id} className="p-3 hover:bg-neutral-50 flex items-start space-x-3 text-xs">
                    <div className="mt-0.5">
                      {act.type === 'Attendance' && <ClipboardCheck className="w-4 h-4 text-emerald-600" />}
                      {act.type === 'Outing' && <Clock className="w-4 h-4 text-amber-600" />}
                      {act.type === 'Request' && <FileText className="w-4 h-4 text-blue-600" />}
                      {act.type === 'Complaint' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-navy-900">{act.title}</p>
                        <span className="text-[10px] text-neutral-400">{act.timestamp}</span>
                      </div>
                      <p className="text-neutral-600 text-[11px] mt-0.5">{act.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
                      {act.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => setSelectedStudent(null)}
            className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-4 py-1.5 rounded text-xs"
          >
            Close Student Profile
          </button>
        </div>

      </div>
    </div>
  );
};

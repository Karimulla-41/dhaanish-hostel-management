import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  PhoneCall, 
  FileCheck, 
  ArrowLeft, 
  ShieldCheck, 
  LogOut, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus
} from 'lucide-react';
import type { Department } from '../../types';

interface ParentCallRecord {
  id: string;
  studentName: string;
  regNo: string;
  dept: Department;
  parentName: string;
  parentPhone: string;
  discussionReason: string;
  outcome: string;
  date: string;
}

export const CCDashboard: React.FC = () => {
  const { students, logout, outingRequests, ccApproveOutingRequest, ccRejectOutingRequest } = useAuth();

  const [selectedDept, setSelectedDept] = useState<Department>('CSE');
  const [activeTab, setActiveTab] = useState<'requests' | 'callLog' | 'reports' | null>(null);

  // 2. Parent Call Log State
  const [parentLogs, setParentLogs] = useState<ParentCallRecord[]>([
    {
      id: 'LOG-01',
      studentName: 'Arun Kumar',
      regNo: '23CSE1045',
      dept: 'CSE',
      parentName: 'R. Senthil Kumar',
      parentPhone: '+91 98765 43210',
      discussionReason: 'Leave permission verification & semester mini-project progress update.',
      outcome: 'Parent confirmed family event dates and granted approval for leave.',
      date: 'Today, 11:30 AM'
    },
    {
      id: 'LOG-02',
      studentName: 'Karthik S',
      regNo: '23CSE1012',
      dept: 'CSE',
      parentName: 'S. Sundaram',
      parentPhone: '+91 91234 56789',
      discussionReason: 'Informed parent regarding 2 consecutive roll call absences.',
      outcome: 'Parent advised student and requested Warden call follow-up.',
      date: '26 Sep 2026'
    }
  ]);

  const [showCallModal, setShowCallModal] = useState(false);
  const [newCallStudent, setNewCallStudent] = useState('');
  const [newCallRegNo, setNewCallRegNo] = useState('');
  const [newCallParent, setNewCallParent] = useState('');
  const [newCallPhone, setNewCallPhone] = useState('');
  const [newCallReason, setNewCallReason] = useState('');
  const [newCallOutcome, setNewCallOutcome] = useState('');

  // 3. Report Generation State
  const [reportType, setReportType] = useState<'Daily Roster' | 'Outing Summary' | 'Absence Summary'>('Daily Roster');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Handlers
  const handleApproveRequest = (id: string) => {
    ccApproveOutingRequest(id);
    alert('Request recommended and forwarded to Warden for final gate pass approval.');
  };

  const handleRejectRequest = (id: string) => {
    ccRejectOutingRequest(id);
    alert('Request rejected by Class Coordinator.');
  };

  const handleCreateCallLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCallStudent || !newCallReason) return;
    const newLog: ParentCallRecord = {
      id: `LOG-${Date.now()}`,
      studentName: newCallStudent,
      regNo: newCallRegNo || '23CSE' + Math.floor(100 + Math.random() * 900),
      dept: selectedDept,
      parentName: newCallParent || 'Guardian',
      parentPhone: newCallPhone || '+91 90000 00000',
      discussionReason: newCallReason,
      outcome: newCallOutcome || 'Call logged successfully.',
      date: 'Just Now'
    };
    setParentLogs([newLog, ...parentLogs]);
    setShowCallModal(false);
    setNewCallStudent('');
    setNewCallRegNo('');
    setNewCallParent('');
    setNewCallPhone('');
    setNewCallReason('');
    setNewCallOutcome('');
    alert('Parent call log saved successfully!');
  };

  const deptStudents = students.filter(s => s.department === selectedDept);

  return (
    <div className="min-h-screen bg-transparent text-navy-950 p-4 sm:p-8 flex flex-col justify-between selection:bg-navy-700 selection:text-white font-sans">
      
      {/* Top Header Utility Bar */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center text-xs pb-4 border-b border-navy-900/20 bg-white/95 px-4 py-2.5 rounded-xl border shadow-lg">
        <div className="flex items-center space-x-2 font-bold text-navy-900">
          <ShieldCheck className="w-4 h-4 text-navy-700" />
          <span>CLASS COORDINATOR (CC) ACADEMIC PORTAL</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={logout}
            className="text-red-700 font-bold flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* LANDING PAGE: PURE WHITE BACKGROUND + CENTERED LOGO + EXACTLY 3 OPTIONS */}
      {activeTab === null && (
        <div className="my-auto py-8 max-w-4xl mx-auto w-full text-center space-y-8 animate-fade-in">
          
          {/* Centered Institutional Logo Shield */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-4 border-navy-700 flex items-center justify-center">
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/60 shadow-lg">
              <h1 className="text-2xl font-bold tracking-tight text-navy-950 uppercase">
                DHAANISH CHENNAI
              </h1>
              <p className="text-xs text-red-700 font-bold tracking-widest uppercase">
                AUTONOMOUS | NAAC A+ ACCREDITED
              </p>
              <p className="text-sm font-bold text-neutral-700 mt-1">
                HOSTEL MANAGEMENT SYSTEM — CLASS COORDINATOR PORTAL
              </p>
            </div>
          </div>

          {/* Department Selector */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-navy-300 shadow-md">
            <label className="font-bold text-navy-900 text-xs">Selected Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as Department)}
              className="bg-white p-1.5 rounded border border-navy-400 font-bold text-navy-800 text-xs focus:ring-1 focus:ring-navy-600"
            >
              {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'EEE'].map(d => (
                <option key={d} value={d}>{d} Department</option>
              ))}
            </select>
          </div>

          <div className="h-0.5 w-24 bg-navy-700 mx-auto" />

          {/* Subheading Prompt */}
          <div>
            <h2 className="text-base font-bold text-navy-950 uppercase tracking-wide bg-white/75 backdrop-blur-md inline-block px-4 py-1 rounded-full border border-white/60 shadow-sm">
              Select Class Coordinator Action Option
            </h2>
            <p className="text-xs text-neutral-700 mt-1 font-semibold">
              Select one of the 3 action buttons below:
            </p>
          </div>

          {/* THE EXACT 3 CC BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* OPTION 1: REQUEST APPROVALS */}
            <button
              onClick={() => setActiveTab('requests')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-8 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-navy-700 text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <FileCheck className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-navy-700">
                  1. REQUEST APPROVALS
                </h3>
                <p className="text-xs text-neutral-600 mt-1">Academic Leave & Outing Pass Queue</p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm">
                Open Requests
              </span>
            </button>

            {/* OPTION 2: PARENT CALL LOGS */}
            <button
              onClick={() => setActiveTab('callLog')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-8 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-navy-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <PhoneCall className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-navy-700">
                  2. PARENT CALL LOGS
                </h3>
                <p className="text-xs text-neutral-600 mt-1">Counseling & Telephone History</p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm">
                Open Call Logs
              </span>
            </button>

            {/* OPTION 3: REPORT GENERATION */}
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-8 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-navy-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <FileText className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-navy-700">
                  3. REPORT GENERATION
                </h3>
                <p className="text-xs text-neutral-600 mt-1">Export Attendance & Hostel Reports</p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm">
                Generate Reports
              </span>
            </button>

          </div>

        </div>
      )}

      {/* VIEW 1: REQUEST APPROVALS */}
      {activeTab === 'requests' && (
        <div className="max-w-4xl mx-auto w-full my-auto space-y-5 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">
              1. Student Leave & Outing Academic Recommendation Queue ({selectedDept})
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-5 space-y-4">
            <p className="text-xs text-neutral-600">
              Review student academic pass requests. Recommending a request forwards it to the Chief Warden for physical gate pass printing.
            </p>

            <div className="space-y-4">
              {outingRequests.filter(r => r.dept === selectedDept || selectedDept === 'CSE').map(req => (
                <div key={req.id} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-navy-900 text-sm">{req.studentName}</span>
                        <span className="text-xs font-mono text-neutral-500">({req.regNo})</span>
                        <span className="bg-navy-100 text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          {req.year} • Room {req.room} ({req.block})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-700 mt-1">
                        Type: <span className="text-navy-800">{req.type}</span> | Destination: <span className="font-semibold text-navy-900">{req.destination}</span>
                      </p>
                    </div>

                    <div>
                      {req.status === 'Pending CC' && (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded text-[11px] border border-amber-300 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending CC Review</span>
                        </span>
                      )}
                      {(req.status === 'Pending Warden' || req.status === 'Approved') && (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded text-[11px] border border-emerald-300 flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{req.status === 'Approved' ? 'Warden Approved' : 'Recommended (Sent to Warden)'}</span>
                        </span>
                      )}
                      {req.status === 'CC Rejected' && (
                        <span className="bg-red-100 text-red-900 font-bold px-2.5 py-1 rounded text-[11px] border border-red-300 flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected by CC</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-neutral-200 text-xs space-y-1">
                    <p className="text-neutral-700"><strong>Reason:</strong> {req.reason}</p>
                    <p className="text-neutral-600"><strong>Parent Contact:</strong> {req.parentPhone}</p>
                    <p className="text-neutral-500 text-[10px]">Timing: Out: {req.outTime} ➔ Return: {req.returnTime}</p>
                  </div>

                  {req.status === 'Pending CC' && (
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold px-3 py-1.5 rounded text-xs transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Request</span>
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-4 py-1.5 rounded text-xs shadow transition flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                        <span>Recommend to Warden</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PARENT CALL LOGS */}
      {activeTab === 'callLog' && (
        <div className="max-w-4xl mx-auto w-full my-auto space-y-5 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">
              2. Parent Call Log Registry ({selectedDept})
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-600">
                Official logs of telephone communication with student parents or guardians.
              </p>
              <button
                onClick={() => setShowCallModal(true)}
                className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-2 rounded text-xs flex items-center space-x-1 shadow"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Log New Parent Call</span>
              </button>
            </div>

            <div className="divide-y divide-neutral-200 border rounded-xl overflow-hidden">
              {parentLogs.map(log => (
                <div key={log.id} className="p-4 bg-white hover:bg-neutral-50 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-navy-900 text-sm">{log.studentName}</span>
                      <span className="font-mono text-neutral-500 text-xs ml-2">({log.regNo})</span>
                      <div className="text-neutral-600 mt-0.5">
                        Parent: <strong>{log.parentName}</strong> ({log.parentPhone})
                      </div>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">{log.date}</span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200 space-y-1">
                    <p className="text-neutral-800"><strong>Discussion Point:</strong> {log.discussionReason}</p>
                    <p className="text-emerald-800 font-medium"><strong>Outcome/Notes:</strong> {log.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: REPORT GENERATION */}
      {activeTab === 'reports' && (
        <div className="max-w-4xl mx-auto w-full my-auto space-y-5 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">
              3. Department Hostel Attendance & Report Generation
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Select Department Roster</label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value as Department);
                    setReportGenerated(false);
                  }}
                  className="w-full p-2.5 border border-neutral-300 rounded text-xs font-bold text-navy-900 bg-neutral-50"
                >
                  {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'EEE'].map(d => (
                    <option key={d} value={d}>{d} Department</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Select Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value as any);
                    setReportGenerated(false);
                  }}
                  className="w-full p-2.5 border border-neutral-300 rounded text-xs font-bold text-navy-900 bg-neutral-50"
                >
                  <option value="Daily Roster">Daily Hostel Attendance Roster</option>
                  <option value="Outing Summary">Home Visit & Outing History</option>
                  <option value="Absence Summary">Unexcused Roll Call Absences</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setReportGenerated(true)}
              className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-xs shadow flex items-center justify-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Generate Official {selectedDept} {reportType}</span>
            </button>

            {reportGenerated && (
              <div className="border-t border-neutral-200 pt-5 space-y-4 animate-fade-in">
                <div className="bg-navy-50 border border-navy-200 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">
                      Report Ready: Dhaanish_{selectedDept}_{reportType.replace(/\s+/g, '_')}_2026.pdf
                    </h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Total Dept Hostellers: <strong>{deptStudents.length || 18}</strong> • Present: <strong>14</strong> • Outing: <strong>3</strong> • Absent: <strong>1</strong>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => alert(`Downloading CSV report for ${selectedDept}...`)}
                      className="bg-white hover:bg-navy-100 text-navy-900 border border-navy-300 font-bold px-3 py-2 rounded text-xs flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading PDF report for ${selectedDept}...`)}
                      className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3 py-2 rounded text-xs flex items-center space-x-1 shadow"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Report Preview */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs">
                  <h5 className="font-bold text-navy-900 mb-2 uppercase border-b pb-1">
                    DHAANISH CHENNAI AUTONOMOUS — {selectedDept} {reportType} SUMMARY PREVIEW
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-navy-700 text-white text-[10px] uppercase font-semibold">
                        <th className="p-2">Reg No.</th>
                        <th className="p-2">Student Name</th>
                        <th className="p-2">Year</th>
                        <th className="p-2">Hostel Block</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {(deptStudents.length > 0 ? deptStudents : [
                        { regNo: '23CSE1045', name: 'Arun Kumar', year: '3rd Year', block: 'Block A (A-204)', status: 'Present' },
                        { regNo: '23CSE1088', name: 'Karthik S', year: '3rd Year', block: 'Block B (B-101)', status: 'Outing' },
                        { regNo: '24CSE2001', name: 'Priya R', year: '2nd Year', block: 'Block C (C-302)', status: 'Present' }
                      ]).map((s: any, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="p-2 font-mono">{s.regNo}</td>
                          <td className="p-2 font-semibold text-navy-900">{s.name}</td>
                          <td className="p-2">{s.year}</td>
                          <td className="p-2">{s.block}</td>
                          <td className="p-2 font-bold text-emerald-700">● {s.status || 'Present'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: NEW PARENT CALL LOG */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-neutral-300 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-navy-900 text-sm">Log New Parent Telephone Call</h3>
              <button onClick={() => setShowCallModal(false)} className="text-neutral-400 hover:text-neutral-800 font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleCreateCallLog} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={newCallStudent}
                  onChange={(e) => setNewCallStudent(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    placeholder="e.g. R. Senthil Kumar"
                    value={newCallParent}
                    onChange={(e) => setNewCallParent(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newCallPhone}
                    onChange={(e) => setNewCallPhone(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Discussion Reason</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Discussed leave request extension and attendance..."
                  value={newCallReason}
                  onChange={(e) => setNewCallReason(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Outcome / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Parent approved leave dates."
                  value={newCallOutcome}
                  onChange={(e) => setNewCallOutcome(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowCallModal(false)} 
                  className="px-3 py-2 bg-neutral-200 rounded font-semibold text-neutral-700 hover:bg-neutral-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-navy-700 text-white rounded font-bold hover:bg-navy-800 shadow"
                >
                  Save Log Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto pt-6 text-center">
        <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
          © 2026 Dhaanish Chennai Autonomous College of Engineering • Academic CC Portal • Associated by KMX Technologies
        </div>
      </div>

    </div>
  );
};

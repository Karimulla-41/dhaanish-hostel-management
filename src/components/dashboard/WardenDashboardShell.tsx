import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ClipboardCheck, 
  FileCheck, 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  LogOut,
  ShieldCheck,
  FileSpreadsheet,
  QrCode,
  Check,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { WardenAttendanceView } from './WardenAttendanceView';
import { WardenReportsView } from './WardenReportsView';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

export const WardenDashboardShell: React.FC = () => {
  const { 
    students, 
    logout, 
    approveStudentVerification, 
    outingRequests, 
    wardenApproveOutingRequest, 
    wardenRejectOutingRequest,
    monthlyQRToken,
    updateMonthlyQRToken
  } = useAuth();

  // null = White page showing ONLY Logo in middle + Options
  const [activeWardenModule, setActiveWardenModule] = useState<'attendance' | 'approvals' | 'complaints' | 'reports' | 'qrgenerator' | null>(null);

  // Warden QR Token customization state
  const [selectedMonth, setSelectedMonth] = useState('OCTOBER 2026');

  // Complaints Data
  const [complaints, setComplaints] = useState<any[]>([]);

  const pendingRegistrations = students.filter(s => s.verificationStatus === 'Pending Verification');
  const pendingOutings = outingRequests.filter(r => r.status === 'Pending Warden');
  const totalPending = pendingRegistrations.length + pendingOutings.length;

  const toggleResolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Resolved' ? 'Pending' : 'Resolved' } : c));
  };

  const handleGenerateNewQR = () => {
    const cleanMonth = selectedMonth.replace(/\s+/g, '-').toUpperCase();
    const newToken = `DHAANISH-MONTHLY-RENEWAL-${cleanMonth}-${Date.now().toString().slice(-4)}`;
    updateMonthlyQRToken(newToken);
    alert(`New Monthly Renewal QR Code generated for ${selectedMonth}! All students can now scan this QR code for monthly renewal.`);
  };

  return (
    <div className="min-h-screen bg-transparent text-navy-950 p-4 sm:p-8 flex flex-col justify-between selection:bg-navy-700 selection:text-white font-sans">
      
      {/* Top Utility Bar (Sign Out) */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center text-xs pb-4 border-b border-navy-900/20 bg-white/95 px-4 py-2.5 rounded-xl border shadow-lg">
        <div className="flex items-center space-x-2 font-bold text-navy-900">
          <ShieldCheck className="w-4 h-4 text-navy-700" />
          <span>WARDEN ADMINISTRATION PORTAL</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={logout}
            className="text-red-700 hover:text-red-900 font-bold flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* WARDEN OPTIONS LANDING PAGE (WHITE BACKGROUND + LOGO IN MIDDLE) */}
      {activeWardenModule === null && (
        <div className="my-auto py-8 max-w-5xl mx-auto w-full text-center space-y-8 animate-fade-in">
          
          {/* Centered Institutional Logo Shield */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 bg-white rounded-2xl p-3 shadow-2xl border-4 border-navy-700 flex items-center justify-center">
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish Chennai Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="bg-white/95 px-6 py-2.5 rounded-2xl border border-neutral-300 shadow-xl">
              <h1 className="text-2xl font-bold tracking-tight text-navy-950 uppercase">
                DHAANISH CHENNAI
              </h1>
              <p className="text-xs text-red-700 font-bold tracking-widest uppercase">
                AUTONOMOUS | NAAC A+ ACCREDITED
              </p>
              <p className="text-sm font-bold text-neutral-700 mt-1">
                HOSTEL MANAGEMENT SYSTEM — WARDEN PORTAL
              </p>
            </div>
          </div>

          <div className="h-0.5 w-24 bg-navy-700 mx-auto" />

          {/* Subheading Prompt */}
          <div>
            <h2 className="text-base font-bold text-navy-950 uppercase tracking-wide bg-white/90 inline-block px-4 py-1 rounded-full border border-neutral-300 shadow-sm">
              Select Warden Action Option
            </h2>
            <p className="text-xs text-navy-900 mt-1 font-bold drop-shadow-sm">
              Click any of the 5 warden options below:
            </p>
          </div>

          {/* THE 5 WARDEN ACTION OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
            
            {/* OPTION 1: ATTENDANCE */}
            <button
              onClick={() => setActiveWardenModule('attendance')}
              className="bg-white/95 hover:bg-white p-5 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-3 group flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-navy-700 text-amber-300 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-navy-700">
                  1. Attendance
                </h3>
                <p className="text-[10px] text-neutral-600 mt-1">
                  Daily night roll call registry & filters.
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                Open Attendance
              </span>
            </button>

            {/* OPTION 2: PERMISSIONS AND APPROVALS */}
            <button
              onClick={() => setActiveWardenModule('approvals')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-5 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-3 group relative flex flex-col justify-between"
            >
              {totalPending > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow border border-white">
                  {totalPending} New
                </span>
              )}
              <div className="w-12 h-12 bg-navy-700 text-white rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <FileCheck className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-navy-700">
                  2. Outing Approvals
                </h3>
                <p className="text-[10px] text-neutral-600 mt-1">
                  Approve student outing gate passes & admissions.
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                Open Approvals
              </span>
            </button>

            {/* OPTION 3: COMPLAINTS */}
            <button
              onClick={() => setActiveWardenModule('complaints')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-5 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-3 group flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-navy-700 text-red-300 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <Wrench className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-navy-700">
                  3. Complaints
                </h3>
                <p className="text-[10px] text-neutral-600 mt-1">
                  Inspect & resolve room maintenance tickets.
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                Open Complaints
              </span>
            </button>

            {/* OPTION 4: MONTHLY REPORTS */}
            <button
              onClick={() => setActiveWardenModule('reports')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-5 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-3 group flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-navy-700 text-emerald-300 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-navy-700">
                  4. Monthly Reports
                </h3>
                <p className="text-[10px] text-neutral-600 mt-1">
                  Download monthly logs as Excel sheet.
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                Excel Reports
              </span>
            </button>

            {/* OPTION 5: MONTHLY RENEWAL QR GENERATOR */}
            <button
              onClick={() => setActiveWardenModule('qrgenerator')}
              className="bg-white/85 hover:bg-white backdrop-blur-md p-5 rounded-2xl border-2 border-amber-500 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-3 group flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-amber-400 text-navy-950 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <QrCode className="w-7 h-7 text-navy-900" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-amber-800">
                  5. Renewal QR Code
                </h3>
                <p className="text-[10px] text-neutral-600 mt-1">
                  Generate & download monthly renewal QR.
                </p>
              </div>
              <span className="inline-block bg-amber-500 text-navy-950 font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                QR Generator
              </span>
            </button>

          </div>

        </div>
      )}

      {/* MODULE 1 FULL PAGE: ATTENDANCE */}
      {activeWardenModule === 'attendance' && (
        <WardenAttendanceView onBack={() => setActiveWardenModule(null)} />
      )}

      {/* MODULE 4 FULL PAGE: MONTHLY REPORTS */}
      {activeWardenModule === 'reports' && (
        <WardenReportsView onBack={() => setActiveWardenModule(null)} />
      )}

      {/* MODULE 5 FULL PAGE: MONTHLY RENEWAL QR GENERATOR */}
      {activeWardenModule === 'qrgenerator' && (
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveWardenModule(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900 flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-amber-600" />
              <span>5. Chief Warden Monthly Pass Renewal QR Code Generator</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl border-2 border-navy-700 p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Select Renewal Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xl text-xs font-bold text-navy-900 bg-neutral-50"
                >
                  <option value="OCTOBER 2026">October 2026 Monthly Renewal</option>
                  <option value="NOVEMBER 2026">November 2026 Monthly Renewal</option>
                  <option value="DECEMBER 2026">December 2026 Monthly Renewal</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateNewQR}
                  className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate New Monthly Token</span>
                </button>
              </div>
            </div>

            {/* Display downloadable QR component */}
            <QRCodeDisplay
              value={monthlyQRToken}
              title={`HOSTEL PASS RENEWAL — ${selectedMonth}`}
              subtitle="Common Monthly Renewal QR for All Hostellers"
              downloadFileName={`Dhaanish_Monthly_Renewal_QR_${selectedMonth.replace(/\s+/g, '_')}.png`}
            />

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Monthly QR Renewal Notice:</span>
              </p>
              <p className="text-[11px] text-amber-800">
                Display this generated QR Code at the Warden Office notice board or download the PNG image to distribute digitally. All hostellers can scan this QR code via their student portal to validate their monthly hostel entry pass.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2 FULL PAGE: PERMISSIONS AND APPROVALS */}
      {activeWardenModule === 'approvals' && (
        <div className="max-w-4xl mx-auto w-full my-auto space-y-5 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveWardenModule(null)}
                className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Back to Options</span>
              </button>
              <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <span>2. Outing & Admission Approvals Queue ({totalPending})</span>
              </h2>
            </div>
          </div>

          {/* Section 1: Outing & Leave Gate Pass Applications forwarded by CC */}
          <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-navy-900 text-sm border-b pb-2 uppercase tracking-wide flex justify-between items-center">
              <span>Student Outing & Leave Applications (Forwarded by CC)</span>
              <span className="bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded text-xs">
                {pendingOutings.length} Pending
              </span>
            </h3>

            {pendingOutings.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">No pending outing pass approvals awaiting Warden sign-off.</p>
            ) : (
              <div className="space-y-3">
                {pendingOutings.map(req => (
                  <div key={req.id} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-navy-900 text-sm">{req.studentName}</span>
                          <span className="font-mono text-neutral-500">({req.regNo})</span>
                          <span className="bg-navy-100 text-navy-900 font-bold px-2 py-0.5 rounded text-[10px]">
                            {req.dept} • {req.year} • {req.block} ({req.room})
                          </span>
                        </div>
                        <p className="text-neutral-700 font-semibold mt-1">
                          Pass Type: <span className="text-navy-900 font-bold">{req.type}</span> | Destination: <strong>{req.destination}</strong>
                        </p>
                      </div>

                      <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded text-[11px] border border-blue-300 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>CC Recommended ➔ Awaiting Warden</span>
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded border border-neutral-200 space-y-1">
                      <p className="text-neutral-700"><strong>Outing Reason:</strong> {req.reason}</p>
                      <p className="text-neutral-600"><strong>Parent Emergency Contact:</strong> {req.parentPhone}</p>
                      <p className="text-neutral-500 text-[10px]">Timings: Out: {req.outTime} | Return: {req.returnTime}</p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => wardenRejectOutingRequest(req.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Pass</span>
                      </button>
                      <button
                        onClick={() => wardenApproveOutingRequest(req.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded text-xs shadow flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Outing Gate Pass</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Student Registration Admissions */}
          <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-navy-900 text-sm border-b pb-2 uppercase tracking-wide flex justify-between items-center">
              <span>Pending New Student Registration Profiles</span>
              <span className="bg-navy-100 text-navy-900 font-mono px-2 py-0.5 rounded text-xs">
                {pendingRegistrations.length} Pending
              </span>
            </h3>

            {pendingRegistrations.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">All student registration profiles are verified & approved.</p>
            ) : (
              <div className="divide-y divide-neutral-200 border rounded-xl overflow-hidden bg-white">
                {pendingRegistrations.map(s => (
                  <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={s.photoUrl} alt={s.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold text-navy-900 text-sm">{s.name} ({s.regNo})</p>
                        <p className="text-neutral-500 text-xs">
                          {s.department} • {s.year} • Requested {s.block}, Room {s.room} | Hostel ID: {s.hostelId}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => approveStudentVerification(s.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded text-xs flex items-center space-x-1 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Student Admission</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3 FULL PAGE: COMPLAINTS */}
      {activeWardenModule === 'complaints' && (
        <div className="max-w-4xl mx-auto w-full my-auto space-y-4 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveWardenModule(null)}
                className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Back to Options</span>
              </button>
              <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-red-600" />
                <span>3. Hostel Room Complaints & Maintenance Tickets</span>
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-300 shadow-md divide-y divide-neutral-200 p-4">
            {complaints.map(c => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-navy-900 text-sm">{c.id}</span>
                    <span className="font-semibold text-neutral-800 text-sm">{c.studentName} (Room {c.room})</span>
                    <span className="bg-navy-50 text-navy-800 font-bold px-2 py-0.5 rounded text-[10px] border border-navy-200">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-neutral-600 text-xs mt-1">{c.desc}</p>
                  <span className="text-[10px] text-neutral-400">{c.date}</span>
                </div>

                <button
                  onClick={() => toggleResolveComplaint(c.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs shrink-0 flex items-center space-x-1 ${
                    c.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-navy-700 text-white hover:bg-navy-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{c.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto pt-6 text-center">
        <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
          © 2026 Dhaanish Chennai Autonomous College of Engineering • Hostel Division • Associated by KMX Technologies
        </div>
      </div>

    </div>
  );
};

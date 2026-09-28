import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  CheckCircle2, 
  QrCode, 
  Send, 
  ShieldCheck, 
  Wrench,
  ArrowLeft,
  LogOut,
  Scan,
  AlertCircle
} from 'lucide-react';
import { QRScannerModal } from '../common/QRScannerModal';

export const StudentDashboard: React.FC = () => {
  const { 
    students, 
    logout, 
    outingRequests, 
    submitOutingRequest, 
    monthlyQRToken,
    updateStudentAttendanceStatus 
  } = useAuth();
  
  const student = students.find(s => s.regNo === '23CSE1045') || students[0];

  const [activeStudentModule, setActiveStudentModule] = useState<'outing' | 'complaint' | 'idcard' | 'scanner' | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Outing Pass Form state
  const [passType, setPassType] = useState<'Local Outing' | 'Home Leave'>('Local Outing');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [outTime, setOutTime] = useState('04:00 PM');
  const [returnTime, setReturnTime] = useState('08:00 PM');
  const [passSubmitted, setPassSubmitted] = useState(false);
  const [monthlyPassVerified, setMonthlyPassVerified] = useState(false);

  // Complaint Form state
  const [complaintCategory, setComplaintCategory] = useState('Electrical / Fan');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Active outing request for current student
  const activeOuting = outingRequests.find(r => r.studentId === student.id || r.regNo === student.regNo);

  const handleOutingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason) {
      alert('Please fill out all outing details.');
      return;
    }

    submitOutingRequest({
      studentId: student.id,
      studentName: student.name,
      regNo: student.regNo,
      dept: student.department,
      year: student.year,
      room: student.room,
      block: student.block,
      type: passType,
      destination,
      reason,
      outTime,
      returnTime,
      parentPhone: student.parentContact,
    });

    setPassSubmitted(true);
    setTimeout(() => {
      setPassSubmitted(false);
      alert('Gate Pass submitted successfully! Sent to Class Coordinator (CC) for initial approval.');
    }, 800);
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc) return;
    setTimeout(() => {
      setActiveStudentModule(null);
      alert('Maintenance Ticket submitted to Block Warden Office!');
    }, 500);
  };

  const handleSuccessfulQRScan = (code: string) => {
    setIsScannerOpen(false);
    setMonthlyPassVerified(true);
    updateStudentAttendanceStatus(student.id, 'Outing');
    alert(`QR Code Verified (${code})! Monthly Renewal & Outing Gate Pass Authorized.`);
  };

  return (
    <div className="min-h-screen bg-transparent text-navy-950 p-4 sm:p-8 flex flex-col justify-between selection:bg-navy-700 selection:text-white font-sans">
      
      {/* Top Utility Bar */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center text-xs pb-4 border-b border-navy-900/20 bg-white/95 px-4 py-2.5 rounded-xl border shadow-lg">
        <div className="flex items-center space-x-2 font-bold text-navy-900">
          <ShieldCheck className="w-4 h-4 text-navy-700" />
          <span>STUDENT RESIDENT PORTAL</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="text-navy-900 font-bold flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg border border-amber-500 shadow-sm transition"
          >
            <Scan className="w-3.5 h-3.5 text-navy-950" />
            <span>Scan Gate Security QR</span>
          </button>

          <button
            onClick={logout}
            className="text-red-700 font-bold flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* LANDING PAGE: WHITE BACKGROUND + LOGO IN MIDDLE + EXACTLY 2 OPTIONS */}
      {activeStudentModule === null && (
        <div className="my-auto py-8 max-w-3xl mx-auto w-full text-center space-y-8 animate-fade-in">
          
          {/* Centered Institutional Logo Shield */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 bg-white rounded-2xl p-3 shadow-2xl border-4 border-navy-700 flex items-center justify-center">
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish Logo" 
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
                HOSTEL MANAGEMENT SYSTEM — STUDENT PORTAL
              </p>
              <p className="text-xs font-semibold text-navy-900 mt-0.5">
                {student.name} ({student.regNo}) • {student.block} ({student.room})
              </p>
            </div>
          </div>

          <div className="h-0.5 w-24 bg-navy-700 mx-auto" />

          {/* Monthly Pass & Active Outing Status Card */}
          {(activeOuting || monthlyPassVerified) && (
            <div className="max-w-md mx-auto bg-white/95 border-2 border-navy-700 rounded-2xl p-4 text-left space-y-2 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy-900 text-xs flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-navy-700" />
                  <span>Outing Request & Monthly Pass Status</span>
                </span>
                {monthlyPassVerified && (
                  <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    QR Verified
                  </span>
                )}
              </div>

              {activeOuting && (
                <div className="bg-white p-3 rounded-xl border border-neutral-200 text-xs space-y-1 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy-900">{activeOuting.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeOuting.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      activeOuting.status === 'Pending CC' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      activeOuting.status === 'Pending Warden' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      'bg-red-100 text-red-900'
                    }`}>
                      {activeOuting.status === 'Pending CC' ? 'Step 1: Pending CC Approval' :
                       activeOuting.status === 'Pending Warden' ? 'Step 2: Pending Warden Approval' :
                       activeOuting.status === 'Approved' ? '● Approved & Gate Clear' :
                       activeOuting.status}
                    </span>
                  </div>
                  <p className="text-neutral-600">Dest: <strong>{activeOuting.destination}</strong></p>
                  <p className="text-[10px] text-neutral-400">Applied: {activeOuting.appliedAt}</p>
                </div>
              )}
            </div>
          )}

          {/* Subheading Prompt */}
          <div>
            <h2 className="text-base font-bold text-navy-950 uppercase tracking-wide bg-white/90 inline-block px-4 py-1 rounded-full border border-neutral-300 shadow-sm">
              Select Student Action Option
            </h2>
            <p className="text-xs text-navy-900 mt-1 font-bold drop-shadow-sm">
              Select one of the 2 options below or scan Warden Security Gate QR:
            </p>
          </div>

          {/* THE EXACT 2 STUDENT BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* OPTION 1: REQUEST OUTING / LEAVE */}
            <button
              onClick={() => setActiveStudentModule('outing')}
              className="bg-white/95 hover:bg-white p-8 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-navy-700 text-amber-300 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <Clock className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 group-hover:text-navy-700">
                  1. Request Outing / Leave
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Apply for local day outing or weekend home visit gate pass.
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm">
                Apply Gate Pass
              </span>
            </button>

            {/* OPTION 2: COMPLAINT */}
            <button
              onClick={() => setActiveStudentModule('complaint')}
              className="bg-white/95 hover:bg-white p-8 rounded-2xl border-2 border-navy-700 shadow-2xl transition transform hover:-translate-y-1 text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-navy-700 text-red-300 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition">
                <Wrench className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 group-hover:text-navy-700">
                  2. Room Complaint
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Submit room repair tickets (Electrical, Plumbing, Wi-Fi, Furniture).
                </p>
              </div>
              <span className="inline-block bg-navy-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm">
                Submit Ticket
              </span>
            </button>

          </div>

          <div className="pt-2 flex justify-center items-center space-x-4">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold px-4 py-2.5 rounded-xl shadow border border-amber-500 text-xs flex items-center space-x-2 transition"
            >
              <Scan className="w-4 h-4 text-navy-900" />
              <span>Scan Warden Monthly Renewal QR</span>
            </button>

            <button
              onClick={() => setActiveStudentModule('idcard')}
              className="text-xs text-navy-700 hover:underline font-bold inline-flex items-center space-x-1"
            >
              <QrCode className="w-4 h-4" />
              <span>View My Digital ID Badge</span>
            </button>
          </div>

        </div>
      )}

      {/* MODULE 1: REQUEST OUTING FORM */}
      {activeStudentModule === 'outing' && (
        <div className="max-w-md mx-auto w-full my-auto space-y-4 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveStudentModule(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">1. Apply Digital Outing Pass</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-navy-700 shadow-xl">
            {passSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-center text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Pass Request Transmitted!</p>
                <p className="text-xs">Your request is sent to CC (Class Coordinator) and Chief Warden for sequential verification.</p>
              </div>
            ) : (
              <form onSubmit={handleOutingSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Pass Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPassType('Local Outing')}
                      className={`p-2 rounded font-bold border text-center ${passType === 'Local Outing' ? 'bg-navy-700 text-white' : 'bg-neutral-100'}`}
                    >
                      Local Outing
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassType('Home Leave')}
                      className={`p-2 rounded font-bold border text-center ${passType === 'Home Leave' ? 'bg-navy-700 text-white' : 'bg-neutral-100'}`}
                    >
                      Home Leave
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="Destination address..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Reason</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Outing reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Departure</label>
                    <input type="text" value={outTime} onChange={(e) => setOutTime(e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Return</label>
                    <input type="text" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full p-2 border rounded font-bold" />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[11px] text-amber-900 flex items-start space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Approval Workflow: Student Submit ➔ CC (Class Coordinator) Recommendation ➔ Warden Final Approval ➔ Digital Gate Pass.
                  </span>
                </div>

                <button type="submit" className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-2.5 rounded shadow flex items-center justify-center space-x-1 mt-2">
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Submit Outing Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODULE 2: COMPLAINT FORM */}
      {activeStudentModule === 'complaint' && (
        <div className="max-w-md mx-auto w-full my-auto space-y-4 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveStudentModule(null)}
              className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">2. Room Maintenance Ticket</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-navy-700 shadow-xl">
            <form onSubmit={handleComplaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Issue Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                >
                  <option value="Electrical / Fan">Electrical / Fan / Light</option>
                  <option value="Plumbing / Hot Water">Plumbing / Hot Water</option>
                  <option value="Wi-Fi / Network">Wi-Fi / Internet Network</option>
                  <option value="Carpentry / Bed">Furniture / Door / Lock</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe issue in room..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <button type="submit" className="w-full bg-navy-700 text-white font-bold py-2.5 rounded shadow">
                Submit Maintenance Complaint
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODULE 3: DIGITAL ID CARD VIEW */}
      {activeStudentModule === 'idcard' && (
        <div className="max-w-sm mx-auto w-full my-auto space-y-4 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <button
              onClick={() => setActiveStudentModule(null)}
              className="bg-navy-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to Options</span>
            </button>
            <h2 className="text-base font-bold text-navy-900">Digital Resident Pass</h2>
          </div>

          <div className="bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 text-white rounded-xl p-5 shadow-2xl space-y-3 relative overflow-hidden border-2 border-navy-600">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <img src="/dhaanish-logo.png" alt="Dhaanish Logo" className="h-7 w-auto bg-white p-0.5 rounded" />
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-200">DHAANISH CHENNAI</p>
                  <p className="text-[9px] text-red-300 font-semibold">AUTONOMOUS | NAAC A+</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-amber-300 font-bold bg-navy-900/80 px-2 py-0.5 rounded border border-navy-600">
                {student.hostelId}
              </span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <img src={student.photoUrl} alt={student.name} className="w-16 h-16 rounded-md object-cover border border-white/40 shadow" />
              <div className="text-[11px] space-y-0.5 text-neutral-200">
                <p className="font-bold text-white text-sm">{student.name}</p>
                <p className="font-mono text-neutral-300">{student.regNo}</p>
                <p>{student.department} • {student.year}</p>
                <p className="text-amber-300 font-semibold">{student.block} • Room {student.room}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-navy-600/70 flex items-center justify-between text-[10px]">
              <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gate Outing Authorization Badge</span>
              </div>
              <div className="text-right space-y-0.5">
                {monthlyPassVerified ? (
                  <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-[9px] shadow">
                    ● GATE CLEARANCE VERIFIED
                  </span>
                ) : (
                  <span className="text-neutral-300 text-[10px]">
                    Scan Gate QR Code to Authorize Exit
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        expectedToken={monthlyQRToken}
        onSuccessScan={handleSuccessfulQRScan}
      />

      {/* Footer */}
      <div className="w-full max-w-4xl mx-auto pt-6 text-center">
        <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
          © 2026 Dhaanish Chennai Autonomous College of Engineering • Resident Division • Associated by KMX Technologies
        </div>
      </div>

    </div>
  );
};

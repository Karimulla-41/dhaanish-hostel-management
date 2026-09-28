import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  LogOut, 
  LogIn, 
  Clock, 
  QrCode,
  UserCheck
} from 'lucide-react';
import type { AttendanceStatus } from '../../types';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

export const SecurityDashboard: React.FC = () => {
  const { students, updateStudentAttendanceStatus, monthlyQRToken } = useAuth();

  const [scanQuery, setScanQuery] = useState('');
  const [scanResultStudent, setScanResultStudent] = useState<any>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Active outing students currently outside campus
  const outsideStudents = students.filter(s => s.status === 'Outing');
  const presentStudents = students.filter(s => s.status === 'Present');

  const handleSearchScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanQuery) return;

    const q = scanQuery.toLowerCase().trim();
    const found = students.find(s => 
      s.hostelId.toLowerCase() === q || 
      s.regNo.toLowerCase() === q || 
      s.name.toLowerCase().includes(q)
    );

    if (found) {
      setScanResultStudent(found);
      setLastActionMessage(null);
    } else {
      setScanResultStudent(null);
      alert('No verified hostel resident found matching query.');
    }
  };

  const handleGateExit = (studentId: string) => {
    updateStudentAttendanceStatus(studentId, 'Outing');
    setLastActionMessage('✅ GATE EXIT LOGGED: Student departure authorized.');
    setScanResultStudent((prev: any) => prev ? { ...prev, status: 'Outing' } : null);
  };

  const handleGateEntry = (studentId: string) => {
    updateStudentAttendanceStatus(studentId, 'Present');
    setLastActionMessage('✅ GATE ENTRY LOGGED: Student safely checked-in to hostel.');
    setScanResultStudent((prev: any) => prev ? { ...prev, status: 'Present' } : null);
  };

  const statusBadgeClasses: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Absent: 'bg-red-100 text-red-800 border-red-300',
    Outing: 'bg-amber-100 text-amber-900 border-amber-300',
    Leave: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-xs font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-navy-700 text-white rounded-lg">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900 tracking-tight">
              Main Security Gate Terminal
            </h1>
            <p className="text-xs text-neutral-500">
              Campus Gate Security Division • Gate Exit/Entry Control Terminal. Displays Official Warden Pass QR Code for Student Scanning.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-semibold text-xs">
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold">
            Currently Outside: {outsideStudents.length} Students
          </span>
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full font-bold">
            Inside Hostel: {presentStudents.length} Students
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Security Gate QR Code Display (Given by Warden to Security) */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-subtle p-5 space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-navy-700" />
              <span>Main Gate QR Code (For Students to Scan)</span>
            </h2>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              Provided by Chief Warden Office. Students scan this QR code on their mobile app when exiting or entering campus gate.
            </p>
          </div>

          <QRCodeDisplay
            value={monthlyQRToken}
            title="DHAANISH MAIN SECURITY GATE QR"
            subtitle="Point Student App Camera to Scan & Authorize Exit/Entry"
            showDownloadBtn={false}
            size={200}
          />

          <form onSubmit={handleSearchScan} className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="Type Hostel ID (e.g. HST001, HST002)..."
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
                className="w-full p-2.5 pl-9 border border-navy-400 rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-600 uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-2 rounded text-xs transition flex items-center justify-center space-x-1.5"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Verify Digital Pass</span>
            </button>
          </form>

          {lastActionMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded font-bold text-[11px]">
              {lastActionMessage}
            </div>
          )}

          {/* Verification Result Card */}
          {scanResultStudent && (
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={scanResultStudent.photoUrl}
                  alt={scanResultStudent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-navy-700"
                />
                <div>
                  <h3 className="font-bold text-navy-900 text-sm">{scanResultStudent.name}</h3>
                  <p className="font-mono text-neutral-600">{scanResultStudent.regNo}</p>
                  <p className="text-neutral-500">{scanResultStudent.department} • {scanResultStudent.year}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeClasses[scanResultStudent.status as AttendanceStatus]}`}>
                    ● {scanResultStudent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded border border-neutral-200 text-[11px]">
                <div><span className="text-neutral-400">Block:</span> <strong>{scanResultStudent.block}</strong></div>
                <div><span className="text-neutral-400">Room:</span> <strong>{scanResultStudent.room}</strong></div>
                <div><span className="text-neutral-400">Hostel ID:</span> <strong className="text-amber-800">{scanResultStudent.hostelId}</strong></div>
                <div><span className="text-neutral-400">Parent Phone:</span> <strong>{scanResultStudent.parentContact}</strong></div>
              </div>

              {/* Gate Actions */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleGateExit(scanResultStudent.id)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Authorize Gate Exit</span>
                </button>

                <button
                  onClick={() => handleGateEntry(scanResultStudent.id)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Authorize Gate Entry</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Outside Campus Roster */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg border border-neutral-200 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
              <h2 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Students Currently Outside Campus ({outsideStudents.length})</span>
              </h2>
              <span className="text-[11px] text-neutral-500 font-semibold">
                Curfew Return Deadline: 08:30 PM
              </span>
            </div>

            {outsideStudents.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                <UserCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-neutral-700">All resident students are checked-in inside the hostel.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {outsideStudents.map(s => (
                  <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img src={s.photoUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold text-navy-900">{s.name} ({s.regNo})</p>
                        <p className="text-neutral-500 text-[11px]">
                          {s.block}, Room {s.room} • Hostel ID: <span className="font-mono font-bold text-amber-800">{s.hostelId}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded border border-amber-300">
                        Outing Approved
                      </span>
                      <button
                        onClick={() => handleGateEntry(s.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-[11px] flex items-center space-x-1"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Check-in Entry</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
            © 2026 Dhaanish Chennai Autonomous College of Engineering • Campus Gate Security • Associated by KMX Technologies
          </div>
        </footer>

      </div>

    </div>
  );
};

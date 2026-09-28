import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Building, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Users,
  ShieldCheck
} from 'lucide-react';
import type { HostelBlock } from '../../types';

interface WardenReportsViewProps {
  onBack: () => void;
}

export const WardenReportsView: React.FC<WardenReportsViewProps> = ({ onBack }) => {
  const { students } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedBlock, setSelectedBlock] = useState<'All' | HostelBlock>('All');
  const [reportType, setReportType] = useState<
    'Monthly Attendance & Roll Call' | 'Outing & Gate Pass Summary' | 'Unexcused Absence & Disciplinary Log' | 'Hostel Residency & Room Roster'
  >('Monthly Attendance & Roll Call');

  const [isExporting, setIsExporting] = useState(false);

  // Filter students based on selected block
  const filteredStudents = students.filter(s => {
    if (selectedBlock !== 'All' && s.block !== selectedBlock) return false;
    return true;
  });

  // Calculate simulated monthly metrics
  const totalHostellers = filteredStudents.length;
  const avgAttendance = 95.8;
  const totalOutings = totalHostellers * 4;
  const totalAbsences = Math.floor(totalHostellers * 0.5);

  // Excel (.csv / .xlsx compatible) File Generator Function
  const handleDownloadExcel = () => {
    setIsExporting(true);

    setTimeout(() => {
      // Build Excel CSV Content
      let csvContent = `DHAANISH CHENNAI AUTONOMOUS - HOSTEL MANAGEMENT SYSTEM\n`;
      csvContent += `MONTHLY REPORT: ${reportType.toUpperCase()}\n`;
      csvContent += `PERIOD: ${selectedMonth} | BLOCK: ${selectedBlock}\n`;
      csvContent += `GENERATED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;

      if (reportType === 'Monthly Attendance & Roll Call') {
        csvContent += `Register No,Student Name,Department,Year,Block,Room,Bed No,Total Days,Days Present,Days Absent,Outings,Attendance %\n`;
        filteredStudents.forEach(s => {
          const totalDays = 30;
          const presentDays = s.status === 'Absent' ? 26 : 29;
          const absentDays = totalDays - presentDays;
          const outings = s.status === 'Outing' ? 5 : 3;
          const pct = ((presentDays / totalDays) * 100).toFixed(1);
          csvContent += `"${s.regNo}","${s.name}","${s.department}","${s.year}","${s.block}","${s.room}","${s.bedNo}",${totalDays},${presentDays},${absentDays},${outings},${pct}%\n`;
        });
      } else if (reportType === 'Outing & Gate Pass Summary') {
        csvContent += `Pass ID,Register No,Student Name,Block,Room,Pass Type,Issue Date,Return Date,Purpose,Status,Approved By\n`;
        filteredStudents.forEach((s, idx) => {
          csvContent += `"PASS-2026-${100 + idx}","${s.regNo}","${s.name}","${s.block}","${s.room}","Local Outing","2026-09-25 09:00","2026-09-25 18:00","Personal & Academic","Returned On Time","Dr. Senthil Kumar (Chief Warden)"\n`;
        });
      } else {
        csvContent += `Record ID,Register No,Student Name,Department,Block,Room,Bed No,Parent Contact,Hostel ID,Verification Status\n`;
        filteredStudents.forEach((s, idx) => {
          csvContent += `"REC-${200 + idx}","${s.regNo}","${s.name}","${s.department}","${s.block}","${s.room}","${s.bedNo}","${s.parentContact}","${s.hostelId}","${s.verificationStatus}"\n`;
        });
      }

      // Create Blob and trigger file download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `Dhaanish_Hostel_${reportType.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedMonth.replace(/\s+/g, '_')}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      alert(`Success! Monthly Excel report saved as "${filename}".`);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto w-full my-auto space-y-6 py-6 font-sans">
      
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
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <span>4. MONTHLY REPORTS EXCEL DOWNLOAD</span>
            </h1>
            <p className="text-xs text-neutral-500">
              Export Monthly Attendance, Outing History, & Disciplinary Reports to Excel (.xlsx / .csv)
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-emerald-900">Format: Excel Spreadsheet (.csv/.xlsx)</span>
        </div>
      </div>

      {/* REPORT CONFIGURATION CARD */}
      <div className="bg-white rounded-xl border border-neutral-300 shadow-xl p-6 space-y-6 text-xs">
        
        <h2 className="font-bold text-navy-900 text-sm uppercase tracking-wide border-b pb-2">
          Select Monthly Report Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Month Selector */}
          <div>
            <label className="block font-bold text-navy-900 mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-navy-700" />
              <span>Select Month & Year:</span>
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg font-bold text-navy-900 focus:ring-2 focus:ring-navy-600 focus:bg-white"
            >
              <option value="September 2026">September 2026 (Current)</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>

          {/* Block Selector */}
          <div>
            <label className="block font-bold text-navy-900 mb-1 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-navy-700" />
              <span>Select Residential Block:</span>
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value as any)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg font-bold text-navy-900 focus:ring-2 focus:ring-navy-600 focus:bg-white"
            >
              <option value="All">All Hostel Blocks (A–E)</option>
              <option value="Block A">Block A (Men's Hostel)</option>
              <option value="Block B">Block B (Men's Hostel)</option>
              <option value="Block C">Block C (Women's Hostel)</option>
              <option value="Block D">Block D (Junior Block)</option>
              <option value="Block E">Block E (Senior Block)</option>
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block font-bold text-navy-900 mb-1 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-navy-700" />
              <span>Report Category:</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg font-bold text-navy-900 focus:ring-2 focus:ring-navy-600 focus:bg-white"
            >
              <option value="Monthly Attendance & Roll Call">Monthly Attendance & Roll Call Summary</option>
              <option value="Outing & Gate Pass Summary">Outing Pass & Gate Pass Registry</option>
              <option value="Unexcused Absence & Disciplinary Log">Unexcused Absence & Disciplinary Log</option>
              <option value="Hostel Residency & Room Roster">Hostel Residency & Room Roster</option>
            </select>
          </div>

        </div>

        {/* MONTHLY SUMMARY METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-50 p-4 rounded-xl border border-navy-200">
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Total Block Residents</span>
            <span className="text-lg font-bold text-navy-900 flex items-center space-x-1">
              <Users className="w-4 h-4 text-navy-700" />
              <span>{totalHostellers} Students</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Avg Monthly Attendance</span>
            <span className="text-lg font-bold text-emerald-800 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{avgAttendance}%</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Total Outings Issued</span>
            <span className="text-lg font-bold text-amber-900 flex items-center space-x-1">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{totalOutings} Passes</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Unexcused Absences</span>
            <span className="text-lg font-bold text-red-900">
              {totalAbsences} Records
            </span>
          </div>
        </div>

        {/* EXCEL DOWNLOAD BUTTON ACTION */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-neutral-500 text-[11px]">
            Ready to download: <strong>Dhaanish_Hostel_{reportType.replace(/[^a-zA-Z0-9]/g, '_')}_{selectedMonth.replace(/\s+/g, '_')}.csv</strong>
          </div>

          <button
            onClick={handleDownloadExcel}
            disabled={isExporting}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-lg text-xs shadow-md flex items-center justify-center space-x-2 transition transform hover:scale-[1.02]"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <Download className="w-4 h-4 text-white" />
            <span>{isExporting ? 'Generating Excel File...' : 'Download Monthly Excel Sheet (.xlsx / .csv)'}</span>
          </button>
        </div>

      </div>

      {/* EXCEL DATA TABLE PREVIEW */}
      <div className="bg-white rounded-xl border border-neutral-300 shadow-xl overflow-hidden text-xs">
        
        <div className="px-5 py-3 bg-navy-700 text-white font-bold flex justify-between items-center">
          <span className="uppercase text-[11px] tracking-wide">
            EXCEL SHEET DATA PREVIEW — {selectedMonth} ({selectedBlock})
          </span>
          <span className="text-amber-300 font-mono text-[10px]">
            {filteredStudents.length} Rows Prepared
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 font-semibold text-[11px] uppercase border-b">
                <th className="p-3">Reg No.</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Year</th>
                <th className="p-3">Block / Room</th>
                <th className="p-3 text-center">Total Days</th>
                <th className="p-3 text-center">Present</th>
                <th className="p-3 text-center">Absent</th>
                <th className="p-3 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredStudents.map(s => {
                const totalDays = 30;
                const presentDays = s.status === 'Absent' ? 26 : 29;
                const absentDays = totalDays - presentDays;
                const pct = ((presentDays / totalDays) * 100).toFixed(1);
                return (
                  <tr key={s.id} className="hover:bg-neutral-50 transition">
                    <td className="p-3 font-mono font-semibold text-neutral-800">{s.regNo}</td>
                    <td className="p-3 font-bold text-navy-900">{s.name}</td>
                    <td className="p-3 text-neutral-700">{s.department}</td>
                    <td className="p-3 text-neutral-600">{s.year}</td>
                    <td className="p-3 font-semibold text-navy-800">{s.block} ({s.room})</td>
                    <td className="p-3 text-center font-mono">{totalDays}</td>
                    <td className="p-3 text-center font-mono text-emerald-700 font-bold">{presentDays}</td>
                    <td className="p-3 text-center font-mono text-red-700 font-bold">{absentDays}</td>
                    <td className="p-3 text-right font-mono font-bold text-navy-900">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Mail, 
  Lock, 
  AlertCircle,
  FileCheck,
  Send,
  Building,
  GraduationCap
} from 'lucide-react';
import type { Department, HostelBlock } from '../../types';
import { apiSendOtp, apiVerifyOtp } from '../../services/api';

interface StaffSignUpProps {
  onBackToLogin: () => void;
}

export const StaffSignUpFlow: React.FC<StaffSignUpProps> = ({ onBackToLogin }) => {
  const { registerStaff, login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Staff Role Selection
  const [staffRole, setStaffRole] = useState<'Warden' | 'CC'>('Warden');

  // Step 1: Account Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Email OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Step 3: Profile Details
  const [fullName, setFullName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [assignedBlock, setAssignedBlock] = useState<HostelBlock>('Block A');
  const [assignedDept, setAssignedDept] = useState<Department>('CSE');

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStep1Error('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 6) {
      setStep1Error('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setStep1Error('Passwords do not match.');
      return;
    }
    setStep1Error('');

    // Dispatch real OTP email to user inbox
    const res = await apiSendOtp(email);
    if (res.otp) {
      setGeneratedOtp(res.otp);
    }
    setOtp(['', '', '', '', '', '']);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    const verification = await apiVerifyOtp(email, entered);
    if (!verification.success && entered !== generatedOtp) {
      setOtpError('Invalid security code. Please check your email inbox and enter the correct code.');
      return;
    }
    setOtpError('');
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile) {
      alert('Please fill out all required staff details.');
      return;
    }

    if (staffRole === 'Warden') {
      registerStaff({
        name: fullName,
        email,
        role: 'Warden',
        staffId: staffId || `WRD-${Math.floor(100 + Math.random() * 900)}`,
        phone: mobile,
        assignedBlock,
        designation: designation || `${assignedBlock} Block Warden`,
      });
    } else {
      registerStaff({
        name: fullName,
        email,
        role: 'CC',
        staffId: staffId || `CC-${Math.floor(100 + Math.random() * 900)}`,
        phone: mobile,
        assignedDept,
        designation: designation || `${assignedDept} Class Coordinator`,
      });
    }

    setStep(4);
  };

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-[1px] flex flex-col justify-center items-center py-10 px-4 font-sans relative z-10">
      
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        
        {/* Secret Header Banner */}
        <div className="bg-navy-900 text-white p-5 border-b-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish Logo" 
                className="h-10 w-auto bg-white p-1 rounded" 
              />
              <div>
                <h1 className="text-base font-bold tracking-tight text-white uppercase flex items-center space-x-1.5">
                  <span>INSTITUTIONAL STAFF REGISTRATION</span>
                  <span className="bg-amber-400 text-navy-950 text-[9px] font-bold px-1.5 py-0.5 rounded">STAFF ONLY</span>
                </h1>
                <p className="text-[11px] text-neutral-300">
                  Dhaanish Chennai Warden & Class Coordinator Portal Enrollment
                </p>
              </div>
            </div>
            <button
              onClick={onBackToLogin}
              className="text-xs text-neutral-300 hover:text-white flex items-center space-x-1 bg-navy-800 hover:bg-navy-700 px-2.5 py-1.5 rounded border border-navy-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-navy-700 pt-3 text-[11px]">
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 1 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-400 text-navy-950 font-bold' : 'bg-navy-800 text-neutral-400'}`}>1</span>
              <span>Staff Role</span>
            </div>
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 2 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-400 text-navy-950 font-bold' : 'bg-navy-800 text-neutral-400'}`}>2</span>
              <span>Email OTP</span>
            </div>
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 3 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-400 text-navy-950 font-bold' : 'bg-navy-800 text-neutral-400'}`}>3</span>
              <span>Staff Profile</span>
            </div>
          </div>
        </div>

        {/* STEP 1: STAFF ROLE & CREDENTIALS */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 1: Select Staff Role & Account Credentials
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Register a new Warden or Class Coordinator (CC) account.
              </p>
            </div>

            {/* Staff Role Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStaffRole('Warden')}
                className={`p-3.5 rounded-lg border text-center font-bold text-xs transition flex flex-col items-center justify-center space-y-1 ${
                  staffRole === 'Warden'
                    ? 'bg-navy-800 text-white border-navy-900 shadow-md ring-2 ring-navy-600'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <Building className="w-5 h-5 text-amber-300" />
                <span>Hostel Warden</span>
              </button>

              <button
                type="button"
                onClick={() => setStaffRole('CC')}
                className={`p-3.5 rounded-lg border text-center font-bold text-xs transition flex flex-col items-center justify-center space-y-1 ${
                  staffRole === 'CC'
                    ? 'bg-navy-800 text-white border-navy-900 shadow-md ring-2 ring-navy-600'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span>Class Coordinator (CC)</span>
              </button>
            </div>

            {step1Error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{step1Error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={staffRole === 'Warden' ? 'warden.name@dhaanish.in' : 'cc.dept@dhaanish.in'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold py-2.5 px-4 rounded shadow flex items-center justify-center space-x-2 transition mt-2"
            >
              <span>Proceed to Email OTP Verification</span>
              <Send className="w-4 h-4 text-amber-300" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY EMAIL */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-navy-50 text-navy-800 rounded-full flex items-center justify-center mx-auto border border-navy-200">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 2: Staff Email Security OTP
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                We have dispatched an official 6-digit staff verification code directly to your email <strong>{email}</strong>. Please check your mobile/email inbox and enter the 6-digit OTP code below.
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-2.5 rounded text-xs">
                {otpError}
              </div>
            )}

            <div className="flex justify-center space-x-2 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`staff-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && idx < 5) {
                      const nextInput = document.getElementById(`staff-otp-${idx + 1}`);
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  className="w-10 h-12 text-center font-bold text-lg border-2 border-navy-700 rounded bg-white focus:bg-navy-50 focus:outline-none"
                />
              ))}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold py-2.5 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold py-2.5 rounded flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Verify & Continue</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: STAFF DETAILS */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="p-6 space-y-4 text-xs">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 3: {staffRole} Official Profile Details
              </h2>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Complete your staff assignment record in campus registry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder={staffRole === 'Warden' ? 'e.g. Dr. Senthil Kumar' : 'e.g. Prof. Ramesh V'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Staff / Employee ID</label>
                <input
                  type="text"
                  required
                  placeholder={staffRole === 'Warden' ? 'e.g. WRD-105' : 'e.g. CC-204'}
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded uppercase focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Mobile Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94433 11223"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              {staffRole === 'Warden' ? (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Assigned Hostel Block</label>
                  <select
                    value={assignedBlock}
                    onChange={(e) => setAssignedBlock(e.target.value as HostelBlock)}
                    className="w-full p-2 border border-neutral-300 rounded font-bold text-navy-900"
                  >
                    <option value="Block A">Block A (Senior Boys)</option>
                    <option value="Block B">Block B (Junior Boys)</option>
                    <option value="Block C">Block C (Girls Block 1)</option>
                    <option value="Block D">Block D (Girls Block 2)</option>
                    <option value="Block E">Block E (International Wing)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Assigned Department</label>
                  <select
                    value={assignedDept}
                    onChange={(e) => setAssignedDept(e.target.value as Department)}
                    className="w-full p-2 border border-neutral-300 rounded font-bold text-navy-900"
                  >
                    {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'EEE'].map(d => (
                      <option key={d} value={d}>{d} Department</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  placeholder={staffRole === 'Warden' ? 'e.g. Chief Warden / Associate Professor' : 'e.g. Senior Class Coordinator'}
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold py-2.5 rounded shadow flex items-center justify-center space-x-2 transition mt-4"
            >
              <FileCheck className="w-4 h-4 text-amber-300" />
              <span>Complete {staffRole} Registration</span>
            </button>
          </form>
        )}

        {/* STEP 4: STAFF ACTIVATED CONFIRMATION */}
        {step === 4 && (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                {staffRole} Account Registered & Activated!
              </span>
              <h2 className="text-base font-bold text-navy-900 mt-3">
                Welcome to Dhaanish Hostel Staff Network
              </h2>
              <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1">
                Your staff account for <strong>{fullName}</strong> ({email}) has been activated in the Dhaanish Registry.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-1/2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2.5 rounded text-xs"
              >
                Return to Login
              </button>
              <button
                type="button"
                onClick={() => login(email, staffRole)}
                className="w-1/2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 rounded text-xs shadow flex items-center justify-center space-x-1"
              >
                <span>Direct Login to {staffRole} Portal</span>
                <Send className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Institutional Footer */}
      <div className="mt-6 text-center text-black font-bold text-xs bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-neutral-300 inline-block">
        © 2026 Dhaanish Chennai Autonomous | Staff Portal • Associated by KMX Technologies
      </div>
    </div>
  );
};

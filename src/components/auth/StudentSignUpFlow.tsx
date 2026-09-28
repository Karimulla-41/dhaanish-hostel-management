import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Clock, 
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import type { Department, Year, HostelBlock } from '../../types';

interface SignUpProps {
  onBackToLogin: () => void;
}

export const StudentSignUpFlow: React.FC<SignUpProps> = ({ onBackToLogin }) => {
  const { registerStudent, approveStudentVerification, setActiveView } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Email OTP Verification
  const [otp, setOtp] = useState(['5', '9', '2', '4', '1', '8']);
  const [otpError, setOtpError] = useState('');
  const resendTimer = 45;

  // Step 3: Profile Form
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');
  const [year, setYear] = useState<Year>('1st Year');
  const [mobile, setMobile] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [hostelBlock, setHostelBlock] = useState<HostelBlock>('Block A');
  const [roomNumber, setRoomNumber] = useState('A-102');
  const [photoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );

  // Completed Registered Student object
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null);

  // Handlers
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStep1Error('Please enter a valid personal or college email address.');
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
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }
    setOtpError('');
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regNo || !mobile || !parentName || !parentContact) {
      alert('Please complete all required fields.');
      return;
    }

    const created = registerStudent({
      name: fullName,
      regNo: regNo.toUpperCase(),
      department,
      year,
      email,
      phone: mobile,
      parentName,
      parentContact,
      block: hostelBlock,
      room: roomNumber,
      photoUrl,
    });

    setCreatedStudentId(created.id);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-[1px] flex flex-col justify-center items-center py-10 px-4 font-sans relative z-10">
      
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        
        {/* Institutional Top Banner */}
        <div className="bg-navy-700 text-white p-5 border-b-4 border-crimson-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish Logo" 
                className="h-10 w-auto bg-white p-1 rounded" 
              />
              <div>
                <h1 className="text-base font-bold tracking-tight text-white uppercase">
                  HOSTEL STUDENT REGISTRATION
                </h1>
                <p className="text-[11px] text-neutral-300">
                  Dhaanish Chennai Autonomous Resident Portal
                </p>
              </div>
            </div>
            <button
              onClick={onBackToLogin}
              className="text-xs text-neutral-300 hover:text-white flex items-center space-x-1 bg-navy-800 hover:bg-navy-600 px-2.5 py-1.5 rounded border border-navy-500 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-navy-600 pt-3 text-[11px]">
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 1 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-400 text-navy-900 font-bold' : 'bg-navy-800 text-neutral-400'}`}>1</span>
              <span>Create Account</span>
            </div>
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 2 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-400 text-navy-900 font-bold' : 'bg-navy-800 text-neutral-400'}`}>2</span>
              <span>Verify Email</span>
            </div>
            <div className={`flex items-center space-x-1.5 font-semibold ${step >= 3 ? 'text-amber-300' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-400 text-navy-900 font-bold' : 'bg-navy-800 text-neutral-400'}`}>3</span>
              <span>Student Profile</span>
            </div>
          </div>
        </div>

        {/* STEP 1: CREATE ACCOUNT */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 1: Create Account
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Register your login credentials to initiate hostel profile enrollment.
              </p>
            </div>

            {step1Error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{step1Error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Personal / Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.name@gmail.com or @dhaanish.in"
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
              className="w-full bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold py-2.5 px-4 rounded shadow-sm flex items-center justify-center space-x-2 transition mt-2"
            >
              <span>Create Account & Proceed</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY EMAIL */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-navy-50 text-navy-700 rounded-full flex items-center justify-center mx-auto border border-navy-200">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 2: Verify Email Address
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                We have transmitted a 6-digit security code to <strong>{email || 'your email'}</strong>.
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-2.5 rounded text-xs">
                {otpError}
              </div>
            )}

            {/* 6-Digit OTP Box Entry */}
            <div className="flex justify-center space-x-2 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && idx < 5) {
                      const nextInput = document.getElementById(`otp-${idx + 1}`);
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  className="w-10 h-12 text-center font-bold text-lg border-2 border-navy-600 rounded bg-white focus:bg-navy-50 focus:outline-none"
                />
              ))}
            </div>

            <p className="text-[11px] text-neutral-500">
              Didn't receive code? Resend available in <span className="font-semibold text-navy-800">{resendTimer}s</span>
            </p>

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
                className="w-2/3 bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold py-2.5 rounded flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Code</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: STUDENT PROFILE FORM */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="p-6 space-y-4 text-xs">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Step 3: Student Profile Details
              </h2>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Provide comprehensive details for official hostel record registration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Register Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 26CSE1088"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded uppercase focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                >
                  {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'EEE'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as Year)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                >
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R. Senthil"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 mb-1">Parent / Guardian Contact</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94433 00000"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Requested Hostel Block</label>
                <select
                  value={hostelBlock}
                  onChange={(e) => setHostelBlock(e.target.value as HostelBlock)}
                  className="w-full p-2 border border-neutral-300 rounded font-semibold text-navy-800"
                >
                  <option value="Block A">Block A (Senior Boys)</option>
                  <option value="Block B">Block B (Junior Boys)</option>
                  <option value="Block C">Block C (Girls Block 1)</option>
                  <option value="Block D">Block D (Girls Block 2)</option>
                  <option value="Block E">Block E (International Wing)</option>
                  <option value="Block F" disabled>Block F (Under Construction - Disabled)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Assigned Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-102"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold py-2.5 rounded shadow flex items-center justify-center space-x-2 transition mt-4"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Submit Student Registration Profile</span>
            </button>
          </form>
        )}

        {/* STEP 4: SUBMISSION CONFIRMATION & PENDING VERIFICATION STATUS */}
        {step === 4 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-300">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                Status: Pending Verification
              </span>
              <h2 className="text-base font-bold text-navy-900 mt-3">
                Registration Submitted Successfully!
              </h2>
              <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1">
                Your profile has been registered into the Dhaanish Hostel Registry. Warden verification is currently in progress.
              </p>
            </div>

            {/* Quick Demo Warden Approval Toggle */}
            <div className="bg-navy-50 border border-navy-200 p-4 rounded-md text-left text-xs space-y-2">
              <p className="font-semibold text-navy-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-navy-700" />
                <span>Demo Feature: Warden Approval Simulator</span>
              </p>
              <p className="text-neutral-600 text-[11px]">
                As a Warden inspecting this demo, you can instantly grant verification approval for this record right now:
              </p>
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (createdStudentId) approveStudentVerification(createdStudentId);
                    alert('Student Profile approved! Status updated to Active.');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Student (Change Status to Active)</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-1/2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2 rounded text-xs"
              >
                Return to Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('registry');
                }}
                className="w-1/2 bg-navy-700 hover:bg-navy-800 text-white font-bold py-2 rounded text-xs"
              >
                Go to Warden Student Registry
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Institutional Footer */}
      <div className="mt-6 text-center text-black font-bold text-xs bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-neutral-300 inline-block">
        © 2026 Dhaanish Chennai Autonomous | Resident Registration • Associated by KMX Technologies
      </div>
    </div>
  );
};

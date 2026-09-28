import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Info, KeyRound } from 'lucide-react';
import type { UserRole } from '../../types';

interface LoginViewProps {
  onGoToSignUp: () => void;
  onGoToStaffSignUp?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onGoToSignUp, onGoToStaffSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('arun.k@dhaanish.in');
  const [password, setPassword] = useState('dhaanish2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setErrorMessage('');
    login(email, selectedRole);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-[1px] flex flex-col justify-center items-center py-10 px-4 font-sans relative z-10">
      
      {/* Outer Auth Box */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        
        {/* Header Branding (Click Logo to toggle secret staff menu) */}
        <div className="bg-navy-700 text-white p-6 text-center border-b-4 border-crimson-800 relative">
          <div className="flex justify-center mb-3">
            <button
              type="button"
              onClick={() => setShowSecretMenu(!showSecretMenu)}
              className="bg-white p-2 rounded-md shadow-md inline-block hover:ring-2 hover:ring-amber-400 transition cursor-pointer"
              title="Click logo for hidden administration role selector"
            >
              <img 
                src="/dhaanish-logo.png" 
                alt="Dhaanish College Logo" 
                className="h-12 w-auto object-contain"
              />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">
            HOSTEL MANAGEMENT SYSTEM
          </h1>
          <p className="text-xs text-neutral-300 font-medium mt-1">
            Dhaanish Chennai Autonomous | NAAC A+
          </p>

          {/* Secret Staff Role & Registration Dropdown (Only revealed on clicking logo) */}
          {showSecretMenu && (
            <div className="mt-4 bg-navy-900 border border-navy-500 rounded-lg p-3 text-xs text-white shadow-2xl animate-fade-in text-center space-y-3">
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                🔒 Secret Staff Portal (Warden, CC, Admin Only)
              </p>
              
              {/* Quick Demo Staff Login Selector (NO Student option here!) */}
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                {(['Warden', 'CC', 'Admin'] as UserRole[]).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => {
                      setSelectedRole(r);
                      if (r === 'Warden') setEmail('warden@dhaanish.in');
                      else if (r === 'CC') setEmail('cc.cse@dhaanish.in');
                      else setEmail('admin@dhaanish.in');
                      setShowSecretMenu(false);
                    }}
                    className={`py-1.5 rounded font-bold transition ${
                      selectedRole === r
                        ? 'bg-amber-400 text-navy-950 shadow-sm'
                        : 'bg-navy-800 text-neutral-300 hover:bg-navy-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Secret Staff Sign Up Button */}
              {onGoToStaffSignUp && (
                <div className="pt-1 border-t border-navy-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecretMenu(false);
                      onGoToStaffSignUp();
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold py-1.5 px-3 rounded text-[11px] shadow transition flex items-center justify-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Staff Account Registration (Warden / CC Sign Up)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start space-x-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Restricted Access Notice:</strong> Warden and Administrative accounts are pre-verified via campus registry. Self-registration is restricted to students.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email input */}
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
                placeholder="name@dhaanish.in"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-navy-700 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold py-2.5 px-4 rounded shadow-sm flex items-center justify-center space-x-2 transition"
          >
            <span>Login to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Student Sign Up Option (ONLY FOR STUDENTS) */}
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-600 mb-2">
            Are you a new hostel resident student?
          </p>
          <button
            type="button"
            onClick={onGoToSignUp}
            className="w-full bg-white hover:bg-neutral-100 text-navy-800 font-semibold border border-navy-700 text-xs py-2 px-4 rounded flex items-center justify-center space-x-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-navy-700" />
            <span>Student Registration (Sign Up)</span>
          </button>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4 shadow-xl border border-neutral-200 text-xs">
            <div className="flex items-center space-x-2 text-navy-800 font-bold text-sm">
              <KeyRound className="w-5 h-5 text-navy-700" />
              <span>Password Recovery</span>
            </div>
            
            {forgotSent ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded">
                <p className="font-semibold">Reset Link Sent!</p>
                <p className="mt-1 text-[11px]">
                  Instructions have been sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="mt-3 w-full bg-emerald-700 text-white font-semibold py-1.5 rounded"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-neutral-600 text-[11px]">
                  Enter your registered institutional email address to receive password reset authorization.
                </p>
                <input
                  type="email"
                  required
                  placeholder="student@dhaanish.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-navy-600"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Institutional Footer */}
      <div className="mt-6 text-center text-black font-bold text-xs bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-neutral-300 inline-block">
        © 2026 Dhaanish Chennai Autonomous | Hostel Division • Associated by KMX Technologies
      </div>
    </div>
  );
};

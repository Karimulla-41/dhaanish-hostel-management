import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 bg-navy-700 text-white z-50 flex flex-col justify-between items-center p-8 select-none cursor-pointer transition-opacity duration-300"
    >
      
      {/* Top Header */}
      <div className="w-full flex justify-between items-center text-xs text-neutral-300">
        <span className="flex items-center space-x-1.5 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>Official Educational Portal</span>
        </span>
        <span className="font-mono text-[11px] text-neutral-400">Ver 2.4.0</span>
      </div>

      {/* Center Branding Content */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-md my-auto animate-fade-in">
        
        {/* Logo Shield Frame */}
        <div className="relative group cursor-pointer" onClick={onComplete}>
          <div className="w-36 h-36 bg-white rounded-2xl p-4 shadow-2xl flex items-center justify-center border-4 border-navy-500 ring-4 ring-white/10 transition-transform transform hover:scale-105">
            <img 
              src="/dhaanish-logo.png" 
              alt="Dhaanish Chennai Autonomous Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="absolute -bottom-2 right-0 bg-amber-400 text-navy-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow border border-amber-300">
            NAAC A+
          </div>
        </div>

        {/* Institution Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            DHAANISH CHENNAI
          </h1>
          <p className="text-xs text-red-300 font-bold tracking-widest uppercase">
            AUTONOMOUS | NAAC A+ ACCREDITED
          </p>
          <div className="h-0.5 w-16 bg-navy-400 mx-auto my-3" />
          <p className="text-lg font-bold text-neutral-100 tracking-wide">
            HOSTEL MANAGEMENT SYSTEM
          </p>
          <p className="text-xs text-neutral-300">
            Student Residency, Attendance, Outing Passes & Administrative Registry
          </p>
        </div>

        {/* Click to Enter Portal Prompt */}
        <div className="pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="text-xs text-navy-950 font-bold flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 px-6 py-3 rounded-full border-2 border-amber-300 transition shadow-lg transform hover:scale-105"
          >
            <span>CLICK TO ENTER PORTAL LOGIN / SIGN UP</span>
            <ArrowRight className="w-4 h-4 text-navy-950" />
          </button>
          <p className="text-[10px] text-neutral-400 mt-2">
            Click anywhere on the splash screen to proceed to Login
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center">
        <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
          © 2026 Dhaanish Chennai Autonomous • Associated by KMX Technologies
        </div>
      </div>

    </div>
  );
};

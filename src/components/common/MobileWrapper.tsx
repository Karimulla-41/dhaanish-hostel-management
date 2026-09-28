import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MobileBottomNav } from './MobileHeaderNav';
import { Wifi, Battery, Signal, Monitor } from 'lucide-react';

export const MobileWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileFrame, setIsMobileFrame } = useAuth();

  if (!isMobileFrame) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-6 px-4 flex flex-col items-center justify-center">
      {/* Frame Control Switcher Bar */}
      <div className="mb-4 bg-navy-800 text-white px-4 py-2 rounded-full border border-navy-600 text-xs flex items-center space-x-3 shadow-lg">
        <span className="text-amber-300 font-semibold flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mobile Wrapped App Mode</span>
        </span>
        <span className="text-neutral-400">|</span>
        <button
          onClick={() => setIsMobileFrame(false)}
          className="hover:underline text-neutral-200 flex items-center space-x-1 text-[11px]"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to Full Web Layout</span>
        </button>
      </div>

      {/* Mobile Device Shell */}
      <div className="w-full max-w-[410px] h-[820px] bg-white rounded-[40px] shadow-2xl border-[10px] border-neutral-800 overflow-hidden flex flex-col relative">
        
        {/* Device Speaker & Camera Notch */}
        <div className="bg-neutral-800 h-6 w-full flex justify-center items-center relative shrink-0">
          <div className="w-20 h-3 bg-neutral-950 rounded-full flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neutral-800" />
            <div className="w-6 h-1 bg-neutral-800 rounded-full" />
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="bg-navy-700 text-white px-6 py-1 flex justify-between items-center text-[10px] font-semibold shrink-0">
          <span>09:41 AM</span>
          <div className="flex items-center space-x-2">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile App View Area */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Bell, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import type { UserRole } from '../../types';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { 
    role, 
    setRole, 
    logout, 
    activeView, 
    filters, 
    setFilters, 
    isMobileFrame, 
    setIsMobileFrame, 
    notificationCount 
  } = useAuth();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const viewTitles: Record<string, string> = {
    dashboard: 'Warden Dashboard',
    registry: 'Student Registry',
    attendance: 'Attendance Management',
    outing: 'Digital Outing Passes',
    approvals: 'Approvals & Complaints',
    reports: 'Reports & Analytics',
    settings: 'System Settings',
  };

  const roles: UserRole[] = ['Admin', 'Warden', 'CC', 'Student', 'Security'];

  return (
    <header className="bg-navy-700 text-white sticky top-0 z-30 shadow-md border-b border-navy-800">
      <div className="px-4 py-2.5 flex items-center justify-between">
        
        {/* Left: Mobile hamburger & Institutional Title / Branding */}
        <div className="flex items-center space-x-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded text-neutral-200 hover:text-white hover:bg-navy-600 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo & College Badge */}
          <div className="flex items-center space-x-3 bg-white/10 px-3 py-1.5 rounded border border-white/20">
            <img 
              src="/dhaanish-logo.png" 
              alt="Dhaanish Chennai Autonomous Logo" 
              className="h-8 w-auto object-contain bg-white rounded p-0.5"
            />
            <div className="hidden sm:block text-left border-l border-white/20 pl-3">
              <div className="text-xs font-bold tracking-wider text-white uppercase">
                DHAANISH CHENNAI
              </div>
              <div className="text-[10px] text-red-300 font-semibold tracking-tight">
                AUTONOMOUS | NAAC A+
              </div>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-navy-600" />

          {/* View Title */}
          <div className="hidden md:block">
            <h1 className="text-base font-semibold text-white tracking-wide">
              {viewTitles[activeView] || 'Hostel Management System'}
            </h1>
            <p className="text-[11px] text-neutral-300 font-normal">
              Educational Institution Administration Portal
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden lg:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Name, Register Number, Hostel ID or Room Number..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full bg-navy-800 text-white placeholder-neutral-400 text-xs rounded-md pl-9 pr-3 py-2 border border-navy-600 focus:outline-none focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Web / Wrapped Mobile View Simulator Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition ${
              isMobileFrame 
                ? 'bg-amber-500 text-navy-900 border-amber-400 font-bold' 
                : 'bg-navy-600 hover:bg-navy-500 text-neutral-200 border-navy-500'
            }`}
            title="Toggle Web vs Mobile App Wrapped Mode"
          >
            {isMobileFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isMobileFrame ? 'Mobile App View' : 'Desktop Web'}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-200 hover:text-white hover:bg-navy-600 rounded-md relative focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-navy-700">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-neutral-900 rounded-md shadow-xl border border-neutral-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-neutral-100 font-bold flex justify-between items-center text-navy-900">
                  <span>System Notifications</span>
                  <span className="bg-navy-100 text-navy-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {notificationCount} New
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100">
                  <div className="px-4 py-2.5 hover:bg-neutral-50 cursor-pointer">
                    <p className="font-semibold text-navy-900">2 New Student Verifications</p>
                    <p className="text-neutral-500 text-[11px]">Deepak S (26AIDS101) submitted hostel application.</p>
                    <span className="text-[10px] text-neutral-400">10 mins ago</span>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-neutral-50 cursor-pointer">
                    <p className="font-semibold text-amber-700">Outing Return Reminder</p>
                    <p className="text-neutral-500 text-[11px]">Kaviya R (Block C-108) is scheduled to return at 07:00 PM.</p>
                    <span className="text-[10px] text-neutral-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warden Profile & Role Selector */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-600 px-2.5 py-1.5 rounded-md border border-navy-600 focus:outline-none transition"
            >
              <div className="w-7 h-7 rounded-full bg-navy-600 border border-navy-400 flex items-center justify-center font-bold text-xs text-white">
                {role.substring(0, 1)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {role === 'Warden' ? 'Chief Warden' : role}
                </div>
                <div className="text-[10px] text-neutral-300">
                  Block Admin
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-300" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-neutral-900 rounded-md shadow-xl border border-neutral-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="font-semibold text-navy-900">Dhaanish Hostel Administration</p>
                  <p className="text-neutral-500 text-[11px]">warden.office@dhaanish.in</p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Switch Role (Demo Mode)
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-neutral-100 ${
                        role === r ? 'font-bold text-navy-700 bg-navy-50' : 'text-neutral-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{r}</span>
                      </span>
                      {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-navy-700" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

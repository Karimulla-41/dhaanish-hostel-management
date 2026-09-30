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
  CheckCircle2,
  User,
  Trash2,
  CheckCheck,
  Clock,
  Wrench,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import type { UserRole, AppNotification } from '../../types';
import { UserProfileModal } from './UserProfileModal';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { 
    role, 
    setRole, 
    logout, 
    activeView, 
    setActiveView,
    filters, 
    setFilters, 
    isMobileFrame, 
    setIsMobileFrame, 
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    currentProfile,
    updateUserProfile
  } = useAuth();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const viewTitles: Record<string, string> = {
    dashboard: `${role} Portal & Dashboard`,
    registry: 'Student Registry',
    attendance: 'Attendance Management',
    outing: 'Digital Outing Passes',
    approvals: 'Approvals & Complaints',
    reports: 'Reports & Analytics',
    settings: 'System Settings',
  };

  const roles: UserRole[] = ['Admin', 'Warden', 'CC', 'Student', 'Security'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outing': return <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      case 'complaint': return <Wrench className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />;
      case 'registration': return <UserPlus className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
      case 'reminder': return <Clock className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />;
      default: return <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
    }
  };

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

          {/* Real-Time Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-200 hover:text-white hover:bg-navy-600 rounded-md relative focus:outline-none transition"
              title="Real-time Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-navy-700 animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-neutral-900 rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 text-xs">
                
                {/* Header */}
                <div className="px-4 py-2.5 border-b border-neutral-100 font-bold flex justify-between items-center text-navy-900">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-navy-700" />
                    <span>Real-time Notifications ({role})</span>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-navy-700 hover:underline flex items-center space-x-1 bg-navy-50 px-2 py-0.5 rounded font-semibold"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-neutral-400 space-y-1">
                      <Bell className="w-8 h-8 mx-auto opacity-30" />
                      <p className="font-semibold text-xs text-neutral-500">No Notifications</p>
                      <p className="text-[10px]">Real-time alerts will appear here as activity occurs.</p>
                    </div>
                  ) : (
                    notifications.map((n: AppNotification) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.actionView) setActiveView(n.actionView);
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-neutral-50 cursor-pointer flex items-start justify-between space-x-2 transition ${
                          !n.isRead ? 'bg-amber-50/50 border-l-4 border-amber-400' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2 flex-1">
                          {getCategoryIcon(n.category)}
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <p className={`font-bold ${!n.isRead ? 'text-navy-950' : 'text-neutral-700'}`}>
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                              )}
                            </div>
                            <p className="text-neutral-600 text-[11px] mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-neutral-400 font-mono mt-1 inline-block">
                              {n.timestamp}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="text-neutral-300 hover:text-red-600 p-1 rounded transition"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Profile & Role Selector */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-600 px-2.5 py-1.5 rounded-md border border-navy-600 focus:outline-none transition"
            >
              <img
                src={currentProfile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={currentProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight max-w-[110px] truncate">
                  {currentProfile.name}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold">
                  {role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-300" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-neutral-900 rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 text-xs">
                
                {/* Profile Card Summary */}
                <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50/70 flex items-center space-x-2.5">
                  <img
                    src={currentProfile.photoUrl}
                    alt={currentProfile.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-navy-700 shadow-sm"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-navy-900 truncate">{currentProfile.name}</p>
                    <p className="text-neutral-500 text-[10px] truncate">{currentProfile.email}</p>
                  </div>
                </div>

                {/* Edit Profile Trigger */}
                <div className="py-1 border-b border-neutral-100">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-navy-700 hover:bg-navy-50 font-bold flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-amber-500" />
                    <span>Edit Profile & Photo</span>
                  </button>
                </div>

                {/* Role Switcher */}
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Switch Active Role
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

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={currentProfile}
        onSaveProfile={updateUserProfile}
      />
    </header>
  );
};

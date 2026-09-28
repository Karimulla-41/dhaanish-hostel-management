import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Clock, 
  FileText, 
  BarChart3, 
  Settings, 
  ShieldAlert,
  Building2,
  QrCode,
  ShieldCheck,
  Wrench,
  BookOpen,
  PhoneCall
} from 'lucide-react';
import type { UserRole } from '../../types';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { role, activeView, setActiveView, students } = useAuth();

  const totalStudents = students.length;
  const pendingStudents = students.filter(s => s.verificationStatus === 'Pending Verification').length;

  // Role-specific navigation definitions
  const getNavItems = (currentRole: UserRole) => {
    switch (currentRole) {
      case 'Student':
        return [
          { id: 'dashboard', label: 'My Student Portal', icon: LayoutDashboard, badge: null },
          { id: 'outing', label: 'Digital Outing Pass', icon: Clock, badge: null },
          { id: 'approvals', label: 'Room Maintenance', icon: Wrench, badge: null },
          { id: 'registry', label: 'Hostel Resident Directory', icon: Users, badge: null },
          { id: 'settings', label: 'My Account Settings', icon: Settings, badge: null },
        ];
      case 'CC':
        return [
          { id: 'dashboard', label: 'CC Department Overview', icon: LayoutDashboard, badge: null },
          { id: 'registry', label: 'Department Roster', icon: BookOpen, badge: totalStudents },
          { id: 'approvals', label: 'Academic Leave Queue', icon: FileText, badge: pendingStudents > 0 ? `${pendingStudents}` : null },
          { id: 'attendance', label: 'Parent Call Registry', icon: PhoneCall, badge: null },
          { id: 'reports', label: 'Academic Reports', icon: BarChart3, badge: null },
        ];
      case 'Security':
        return [
          { id: 'dashboard', label: 'Gate Terminal Dashboard', icon: ShieldCheck, badge: null },
          { id: 'outing', label: 'Digital Pass Verifier', icon: QrCode, badge: null },
          { id: 'registry', label: 'Outside Campus Roster', icon: Users, badge: null },
          { id: 'attendance', label: 'Gate Entry/Exit Logs', icon: ClipboardCheck, badge: null },
        ];
      case 'Admin':
        return [
          { id: 'dashboard', label: 'Executive Admin Panel', icon: LayoutDashboard, badge: null },
          { id: 'registry', label: 'All Student Records', icon: Users, badge: totalStudents },
          { id: 'approvals', label: 'Warden Allocations', icon: ShieldCheck, badge: null },
          { id: 'reports', label: 'Institutional Capacity', icon: BarChart3, badge: null },
          { id: 'settings', label: 'System Configuration', icon: Settings, badge: null },
        ];
      case 'Warden':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
          { id: 'registry', label: 'Student Registry', icon: Users, badge: totalStudents },
          { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, badge: null },
          { id: 'outing', label: 'Outing Pass', icon: Clock, badge: null },
          { id: 'approvals', label: 'Approvals & Complaints', icon: FileText, badge: pendingStudents > 0 ? `${pendingStudents} New` : null },
          { id: 'reports', label: 'Reports', icon: BarChart3, badge: null },
          { id: 'settings', label: 'Settings', icon: Settings, badge: null },
        ];
    }
  };

  const navItems = getNavItems(role);

  return (
    <aside className="w-64 bg-navy-700 text-white flex flex-col min-h-full border-r border-navy-800 shrink-0">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-navy-800 bg-navy-800/60">
        <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
          {role.toUpperCase()} PORTAL
        </div>
        <div className="text-base font-bold tracking-wide text-white flex items-center space-x-2 mt-0.5">
          <Building2 className="w-4 h-4 text-amber-300" />
          <span>HOSTEL SYSTEM</span>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-navy-800 font-semibold shadow-sm'
                  : 'text-neutral-200 hover:bg-navy-600 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-800' : 'text-neutral-300'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-navy-800 text-white'
                      : 'bg-navy-600 text-neutral-200 border border-navy-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="p-3 m-3 bg-navy-800/80 rounded border border-navy-600 text-xs">
        <div className="flex items-center space-x-2 text-amber-300 font-semibold text-[11px] mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active Role: {role}</span>
        </div>
        <p className="text-[10px] text-neutral-300 leading-snug">
          Dhaanish Chennai Autonomous College of Engineering.
        </p>
        <div className="mt-2 pt-2 border-t border-navy-600 flex justify-between items-center text-[10px] text-neutral-400">
          <span>Version 2.4.0</span>
          <span className="text-emerald-400 font-semibold">● System Active</span>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, ClipboardCheck, Clock, FileText } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'registry', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'outing', label: 'Outing', icon: Clock },
    { id: 'approvals', label: 'Approvals', icon: FileText },
  ];

  return (
    <div className="bg-navy-700 text-white border-t border-navy-800 flex justify-around items-center py-2 px-1 text-[10px] shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-md transition ${
              isActive ? 'text-white font-bold bg-navy-600' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-neutral-300'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

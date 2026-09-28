import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardCheck, Clock, FileText, BarChart3, Settings, ArrowLeft } from 'lucide-react';

export const PlaceholderModule: React.FC<{ title: string; subtitle: string; iconType: string }> = ({
  title,
  subtitle,
  iconType,
}) => {
  const { setActiveView } = useAuth();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-subtle flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">{title}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={() => setActiveView('registry')}
          className="bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold px-3.5 py-2 rounded flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Student Registry</span>
        </button>
      </div>

      {/* Module Placeholder Box */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center space-y-4 shadow-subtle">
        <div className="w-16 h-16 bg-navy-50 text-navy-700 rounded-full flex items-center justify-center mx-auto border border-navy-200">
          {iconType === 'attendance' && <ClipboardCheck className="w-8 h-8" />}
          {iconType === 'outing' && <Clock className="w-8 h-8" />}
          {iconType === 'approvals' && <FileText className="w-8 h-8" />}
          {iconType === 'reports' && <BarChart3 className="w-8 h-8" />}
          {iconType === 'settings' && <Settings className="w-8 h-8" />}
        </div>

        <div className="max-w-md mx-auto">
          <span className="bg-blue-100 text-navy-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
            Stage 2 Planned Expansion Module
          </span>
          <h2 className="text-base font-bold text-navy-900 mt-2">{title} Shell Ready</h2>
          <p className="text-xs text-neutral-600 mt-1">
            The core Student Registry and Warden Dashboard data structures are connected to this module. Additional workflows will be integrated seamlessly.
          </p>
        </div>

        <button
          onClick={() => setActiveView('registry')}
          className="bg-navy-700 hover:bg-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded shadow-sm inline-block"
        >
          Explore Main Student Registry Demo
        </button>
      </div>

    </div>
  );
};

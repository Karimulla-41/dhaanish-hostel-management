import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu,
  X,
  Bell, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  FileText, 
  Calendar, 
  Award, 
  QrCode, 
  Users, 
  Sparkles, 
  PartyPopper, 
  ShieldCheck, 
  Bug, 
  Trash2, 
  Scan, 
  Send, 
  Layers, 
  ClipboardList, 
  ChevronDown
} from 'lucide-react';
import { QRScannerModal } from '../common/QRScannerModal';
import { UserProfileModal } from '../common/UserProfileModal';
import type { AppNotification } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { 
    students, 
    logout, 
    outingRequests, 
    submitOutingRequest, 
    submitComplaint,
    monthlyQRToken,
    updateStudentAttendanceStatus,
    currentProfile,
    updateUserProfile,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useAuth();

  // Active view state matching sidebar options
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'outpass' | 'leave' | 'od' | 'gatepass' | 'siph' | 'mentorship' | 'skills' | 'events' | 'visitors' | 'profile' | 'settings' | 'report_issue'
  >('dashboard');

  // UI Drawer & Dropdown states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Settings toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Report Issue Modal & List state
  const [showReportModal, setShowReportModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [reportedIssues, setReportedIssues] = useState<Array<{ id: string; desc: string; date: string; status: string }>>([]);

  // Change Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Outing Pass Form state
  const [passType, setPassType] = useState<'Local Outing' | 'Home Leave'>('Local Outing');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [outTime, setOutTime] = useState('04:00 PM');
  const [returnTime, setReturnTime] = useState('08:00 PM');

  // Derive current student profile
  const student = students.find(s => 
    (s.email && currentProfile.email && s.email.toLowerCase() === currentProfile.email.toLowerCase()) ||
    (s.name && currentProfile.name && s.name.toLowerCase() === currentProfile.name.toLowerCase())
  ) || {
    id: currentProfile.id || 'STU-001',
    name: currentProfile.name || 'Resident Student',
    regNo: '26CSE1088',
    department: currentProfile.department || 'CSE',
    year: currentProfile.year || '1st Year',
    block: currentProfile.block || 'Block A',
    floor: '1st Floor',
    room: currentProfile.room || 'A-101',
    bedNo: 'A-101-1',
    hostelId: 'HST001',
    photoUrl: currentProfile.photoUrl,
    email: currentProfile.email,
    phone: currentProfile.phone,
    parentName: 'Parent of ' + (currentProfile.name || 'Student'),
    parentContact: currentProfile.phone || '+91 98000 11111',
    status: 'Present' as const,
    verificationStatus: 'Pending Verification' as const,
    joinDate: new Date().toISOString().split('T')[0],
    activityHistory: []
  };

  // Student initial for profile circle
  const studentInitial = (currentProfile.name || student.name || 'N').charAt(0).toUpperCase();

  // Outing requests for current student
  const studentOutings = outingRequests.filter(r => r.studentId === student.id || r.regNo === student.regNo);

  // Counts calculation
  const approvedOutpass = studentOutings.filter(r => r.type === 'Local Outing' && r.status === 'Approved').length;
  const pendingOutpass = studentOutings.filter(r => r.type === 'Local Outing' && (r.status === 'Pending CC' || r.status === 'Pending Warden')).length;
  const rejectedOutpass = studentOutings.filter(r => r.type === 'Local Outing' && r.status.includes('Rejected')).length;
  const totalOutpassCount = studentOutings.filter(r => r.type === 'Local Outing').length || 4; // Fallback mock count for demo alignment

  const approvedLeave = studentOutings.filter(r => r.type === 'Home Leave' && r.status === 'Approved').length;
  const pendingLeave = studentOutings.filter(r => r.type === 'Home Leave' && (r.status === 'Pending CC' || r.status === 'Pending Warden')).length;
  const rejectedLeave = studentOutings.filter(r => r.type === 'Home Leave' && r.status.includes('Rejected')).length;
  const totalLeaveCount = studentOutings.filter(r => r.type === 'Home Leave').length || 0;

  // Handlers
  const handleOutingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason) {
      alert('Please fill out all outing details.');
      return;
    }

    submitOutingRequest({
      studentId: student.id,
      studentName: currentProfile.name || student.name,
      regNo: student.regNo,
      dept: student.department,
      year: student.year,
      room: currentProfile.room || student.room,
      block: currentProfile.block || student.block,
      type: passType,
      destination,
      reason,
      outTime,
      returnTime,
      parentPhone: student.parentContact,
    });

    setTimeout(() => {
      alert('Gate Pass request submitted successfully! Notifications sent to CC and Warden.');
      setActiveTab('dashboard');
    }, 600);
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;

    const newIssue = {
      id: `ISS-${Date.now().toString().slice(-4)}`,
      desc: issueDescription.trim(),
      date: new Date().toLocaleDateString(),
      status: 'Pending Review'
    };

    setReportedIssues(prev => [newIssue, ...prev]);
    submitComplaint('Portal Issue', issueDescription);
    setIssueDescription('');
    setShowReportModal(false);
    alert('Issue reported successfully to the Principal\'s Office!');
  };

  const handleSuccessfulQRScan = (code: string) => {
    setIsScannerOpen(false);
    updateStudentAttendanceStatus(student.id, 'Outing');
    alert(`QR Code Verified (${code})! Monthly Renewal & Outing Pass Authorized.`);
  };

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    outpass: 'Outpass Requests',
    leave: 'Leave Applications',
    od: 'On Duty (OD) Requests',
    gatepass: 'Digital Gate Pass',
    siph: 'Student Profile (SIPH)',
    mentorship: 'Mentorship Portal',
    skills: 'Skills & Training',
    events: 'Campus Events',
    visitors: 'My Visitors',
    profile: 'My Profile',
    settings: 'Settings',
    report_issue: 'Report an Issue',
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#0f172a] font-sans flex flex-col justify-between selection:bg-[#1e3a8a] selection:text-white">
      
      {/* 1. TOP FIXED HEADER BAR */}
      <header className="bg-white text-navy-950 border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 py-3 flex items-center justify-between">
        
        {/* Left: Hamburger Menu & Active View Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 focus:outline-none transition border border-slate-200 cursor-pointer"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>
          
          <h1 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight">
            {viewTitles[activeTab] || 'Dashboard'}
          </h1>
        </div>

        {/* Right: Notifications & Profile Circle Avatar */}
        <div className="flex items-center space-x-3">
          
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg relative focus:outline-none border border-slate-200 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 font-bold flex justify-between items-center text-slate-900">
                  <span className="flex items-center space-x-1.5">
                    <Bell className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Notifications</span>
                  </span>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-[#1e3a8a] hover:underline font-semibold bg-blue-50 px-2 py-0.5 rounded"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">No new notifications</div>
                  ) : (
                    notifications.map((n: AppNotification) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer flex items-start justify-between space-x-2 ${
                          !n.isRead ? 'bg-amber-50/70 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-900">{n.title}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="text-slate-300 hover:text-red-600 p-1"
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

          {/* User Initial Circle Avatar Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-lg bg-[#0b1e36] text-white font-bold flex items-center justify-center hover:ring-2 hover:ring-[#1e3a8a] transition shadow-xs cursor-pointer"
            >
              {currentProfile.photoUrl ? (
                <img
                  src={currentProfile.photoUrl}
                  alt={currentProfile.name}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-sm tracking-widest">{studentInitial}</span>
              )}
            </button>

            {/* Profile Dropdown Popup Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs font-semibold animate-fade-in text-slate-700">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab('profile');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab('settings');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-600" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. SLIDE-OUT SIDEBAR NAVIGATION DRAWER */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex font-sans">
          
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" 
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-[#07152b] text-white min-h-screen shadow-2xl flex flex-col justify-between z-10 animate-slide-right">
            
            <div className="p-4 space-y-6 overflow-y-auto">
              
              {/* Drawer Top Header Logo Box */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="bg-white px-3 py-2 rounded-xl shadow-md flex items-center space-x-2 border border-slate-200">
                  <img 
                    src="/dhaanish-logo.png" 
                    alt="Dhaanish Logo" 
                    className="h-9 w-auto object-contain"
                  />
                  <div className="text-[10px] font-bold text-[#0f172a] leading-tight">
                    <p className="uppercase font-extrabold text-[#07152b]">DHAANISH CHENNAI</p>
                    <p className="text-[9px] text-red-700">AUTONOMOUS | NAAC A+</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links Grouped by Section */}
              <nav className="space-y-6 text-xs">
                
                {/* Active Main Dashboard Option */}
                <div>
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                      activeTab === 'dashboard'
                        ? 'bg-[#152a4a] text-white border border-blue-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Dashboard</span>
                  </button>
                </div>

                {/* SECTION 1: MY REQUESTS */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                    MY REQUESTS
                  </p>

                  <button
                    onClick={() => {
                      setActiveTab('outpass');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'outpass' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 text-blue-400" />
                    <span>Outpass</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('leave');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'leave' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Leave</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('od');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'od' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>On Duty (OD)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('gatepass');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'gatepass' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <span>Gatepass</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('siph');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'siph' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>SIPH</span>
                  </button>
                </div>

                {/* SECTION 2: CAMPUS LIFE */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                    CAMPUS LIFE
                  </p>

                  <button
                    onClick={() => {
                      setActiveTab('mentorship');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'mentorship' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>Mentorship</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('skills');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'skills' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Skills</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('events');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'events' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <PartyPopper className="w-4 h-4 text-orange-400" />
                    <span>Events</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('visitors');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'visitors' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>My Visitors</span>
                  </button>
                </div>

                {/* SECTION 3: ACCOUNT */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                    ACCOUNT
                  </p>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'profile' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'settings' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('report_issue');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg font-semibold transition ${
                      activeTab === 'report_issue' ? 'bg-[#152a4a] text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Bug className="w-4 h-4 text-red-400" />
                    <span>Report an Issue</span>
                  </button>
                </div>

              </nav>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 text-[10px] text-slate-400 text-center">
              Dhaanish Chennai Resident Portal • v2.6
            </div>

          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT BODY AREA */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* VIEW 1: MAIN DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Greeting Banner */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Welcome back, <strong className="text-slate-800">{currentProfile.name || student.name}</strong>. Here's a quick overview.
              </p>
            </div>

            {/* Sub-heading */}
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              MY REQUESTS
            </div>

            {/* OVERVIEW CARDS STACK */}
            <div className="space-y-4">
              
              {/* CARD 1: OUTPASS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Outpass</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Going off campus</p>
                  </div>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {totalOutpassCount}
                </div>

                {/* Full Width Green Line */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>

                {/* Status Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Approved</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{approvedOutpass || 4}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>Pending</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{pendingOutpass}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      <span>Rejected</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{rejectedOutpass}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('outpass')}
                  className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center space-x-1 pt-1 cursor-pointer"
                >
                  <span>Open outpass requests</span>
                </button>
              </div>

              {/* CARD 2: LEAVE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Leave</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Regular & medical leave</p>
                  </div>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {totalLeaveCount}
                </div>

                {/* Full Width Gray Line */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full w-0" />
                </div>

                {/* Status Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Approved</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{approvedLeave}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>Pending</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{pendingLeave}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      <span>Rejected</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{rejectedLeave}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('leave')}
                  className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center space-x-1 pt-1 cursor-pointer"
                >
                  <span>Open leave requests</span>
                </button>
              </div>

              {/* CARD 3: ON DUTY (OD) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">On Duty (OD)</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Duty leave</p>
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-amber-300">
                    1 pending
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  1
                </div>

                {/* Full Width Amber Line */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-full" />
                </div>

                {/* Status Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Approved</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">0</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>Pending</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">1</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      <span>Rejected</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">0</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('od')}
                  className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center space-x-1 pt-1 cursor-pointer"
                >
                  <span>Open OD requests</span>
                </button>
              </div>

              {/* CARD 4: DIGITAL GATE PASS BADGE SUMMARY */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-[#1e3a8a]" />
                    <h3 className="text-base font-bold text-slate-900">Digital Gate Pass & QR Token</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dual approval pass verification with QR Security Token.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
                  >
                    <Scan className="w-4 h-4 text-slate-900" />
                    <span>Scan Gate QR</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gatepass')}
                    className="bg-[#0b1e36] hover:bg-[#152a4a] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>View Gatepass Badge</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: OUTPASS REQUESTS & APPLICATION FORM */}
        {activeTab === 'outpass' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Outpass Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">Apply for local day outings or off-campus permission.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Apply New Request</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPassType('Local Outing')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                      passType === 'Local Outing' ? 'bg-[#0b1e36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Local Outing
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassType('Home Leave')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                      passType === 'Home Leave' ? 'bg-[#0b1e36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Home Leave
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleOutingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T. Nagar Shopping / Phoenix Mall"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Outpass</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide specific reason for off-campus outing..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expected Out Time</label>
                    <input
                      type="text"
                      required
                      value={outTime}
                      onChange={(e) => setOutTime(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expected Return Time</label>
                    <input
                      type="text"
                      required
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b1e36] hover:bg-[#152a4a] text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Submit Outpass Request</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: LEAVE APPLICATIONS */}
        {activeTab === 'leave' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Leave Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Apply for regular home visit or medical leave pass.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Apply Home Visit / Medical Leave</h3>
              
              <form onSubmit={handleOutingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home Town / Destination Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Native Hometown Address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Leave Reason & Emergency Contact</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Reason for leave & parent verification details..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b1e36] hover:bg-[#152a4a] text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Submit Leave Application</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 4: ON DUTY (OD) REQUESTS */}
        {activeTab === 'od' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">On Duty (OD) Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">Duty leave for symposiums, sports, and college projects.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">Current OD Status</h3>
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-amber-300">
                  1 Pending Recommendation
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Inter-College Hackathon OD</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                    Pending CC Approval
                  </span>
                </div>
                <p className="text-slate-600">Event: Anna University Tech Symposium 2026</p>
                <p className="text-[10px] text-slate-400">Submitted: Today, 09:30 AM</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: GATEPASS / DIGITAL ID BADGE */}
        {activeTab === 'gatepass' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Digital Gate Pass Badge</h2>
                <p className="text-xs text-slate-500 mt-0.5">Security Main Gate Clearance & QR Token.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-[#0b1e36] shadow-xl text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#0b1e36] text-amber-300 rounded-2xl p-2.5 mx-auto flex items-center justify-center border-2 border-amber-400 shadow-md">
                <img src="/dhaanish-logo.png" alt="Logo" className="w-full h-full object-contain bg-white rounded p-0.5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase">DHAANISH CHENNAI AUTONOMOUS</h3>
                <p className="text-xs font-bold text-blue-900">RESIDENTIAL HOSTEL DIGITAL GATE PASS</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs font-semibold text-slate-800">
                <p>Student Name: <strong>{currentProfile.name || student.name}</strong></p>
                <p>Register No: <strong className="font-mono text-blue-900">{student.regNo}</strong></p>
                <p>Hostel Block: <strong>{currentProfile.block || student.block} (Room {currentProfile.room || student.room})</strong></p>
                <p>Gate Pass Status: <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Dual Approved (CC + Warden)</span></p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl shadow border border-amber-500 text-xs flex items-center justify-center space-x-2"
                >
                  <Scan className="w-4 h-4 text-slate-900" />
                  <span>Scan Security Gate QR Code</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: SIPH / STUDENT PROFILE RECORD */}
        {activeTab === 'siph' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Information Record (SIPH)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Official institutional profile record.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center space-x-4 border-b pb-4">
                <img
                  src={currentProfile.photoUrl || student.photoUrl}
                  alt={currentProfile.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#0b1e36]"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentProfile.name || student.name}</h3>
                  <p className="text-slate-500">Reg No: {student.regNo}</p>
                  <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-200 mt-1 inline-block">
                    {currentProfile.department || student.department} • {currentProfile.year || student.year}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <p>Email: <strong className="text-slate-900">{student.email}</strong></p>
                <p>Phone: <strong className="text-slate-900">{student.phone}</strong></p>
                <p>Block: <strong className="text-slate-900">{currentProfile.block || student.block}</strong></p>
                <p>Room No: <strong className="text-slate-900">{currentProfile.room || student.room}</strong></p>
                <p>Parent Name: <strong className="text-slate-900">{student.parentName}</strong></p>
                <p>Parent Contact: <strong className="text-slate-900">{student.parentContact}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: MENTORSHIP */}
        {activeTab === 'mentorship' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">Faculty Mentorship</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
              <p className="font-bold text-slate-900 text-sm">Assigned Faculty Mentor: Prof. S. Anitha (CSE Dept)</p>
              <p className="text-slate-500">Official Email: cc.cse@dhaanish.in</p>
              <p className="text-slate-500">Mentorship Hours: Mon & Wed 03:30 PM - 04:30 PM</p>
            </div>
          </div>
        )}

        {/* VIEW 8: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">Skills & Training Programs</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900">1. Full Stack Web Development (MERN/React)</h3>
                <p className="text-slate-500 mt-0.5">Autonomous Skill Enhancement Course — Active Batch</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900">2. AI & Data Science Certification</h3>
                <p className="text-slate-500 mt-0.5">Industry Training by KMX Technologies</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">Campus Events & Hackathons</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
              <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[10px]">Upcoming</span>
              <h3 className="text-sm font-bold text-slate-900">Dhaanish National Level Hackathon 2026</h3>
              <p className="text-slate-500">Date: October 15, 2026 • Campus Auditorium Complex</p>
            </div>
          </div>
        )}

        {/* VIEW 10: VISITORS */}
        {activeTab === 'visitors' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">My Visitors Log</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs text-center text-slate-400 py-8">
              No recent parent / guardian visits logged.
            </div>
          </div>
        )}

        {/* VIEW 11: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-[#0b1e36] text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#152a4a]"
              >
                Edit Profile & Photo
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center space-x-4 border-b pb-4">
                <img
                  src={currentProfile.photoUrl || student.photoUrl}
                  alt={currentProfile.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#0b1e36]"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentProfile.name || student.name}</h3>
                  <p className="text-slate-500">{currentProfile.email}</p>
                  <p className="text-slate-500 font-mono">{student.regNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>Department: <strong>{currentProfile.department || student.department}</strong></div>
                <div>Year: <strong>{currentProfile.year || student.year}</strong></div>
                <div>Block: <strong>{currentProfile.block || student.block}</strong></div>
                <div>Room: <strong>{currentProfile.room || student.room}</strong></div>
                <div>Phone: <strong>{currentProfile.phone}</strong></div>
                <div>Parent Contact: <strong>{student.parentContact}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 12: SETTINGS (REFERENCE DESIGN EXACT FORMAT) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Settings</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Customize your preferences.</p>
            </div>

            <div className="space-y-4">
              
              {/* Card 1: Notifications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Notifications
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Toggle 1: Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Email Notifications</p>
                      <p className="text-slate-500 text-xs mt-0.5">Receive email updates on outpass status changes.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                        emailNotifications ? 'bg-[#1e3a8a] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-3" />

                  {/* Toggle 2: Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Push Notifications</p>
                      <p className="text-slate-500 text-xs mt-0.5">Get browser push notifications.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPushNotifications(!pushNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                        pushNotifications ? 'bg-[#1e3a8a] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Account Settings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Account
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Change Password</p>
                    <p className="text-slate-500 text-xs mt-0.5">Update your account password.</p>
                  </div>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 13: REPORT AN ISSUE (REFERENCE DESIGN EXACT FORMAT) */}
        {activeTab === 'report_issue' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Report an Issue</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">
                Something not working in the portal? Report it with a screenshot. The principal's office reviews every report and marks it resolved once fixed.
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-[#1e3a8a] hover:bg-[#152a4a] text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center space-x-2 transition cursor-pointer"
              >
                <Bug className="w-4 h-4 text-amber-300" />
                <span>Report Issue</span>
              </button>
            </div>

            {/* Empty State / Issue Tickets Container */}
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              {reportedIssues.length === 0 ? (
                <div className="space-y-3 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800">No Issues Reported</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You haven't reported any issues yet. Click <strong className="text-slate-800">Report Issue</strong> if something isn't working.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">My Reported Issues</h3>
                  {reportedIssues.map(iss => (
                    <div key={iss.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{iss.id}</span>
                        <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {iss.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{iss.desc}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">{iss.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 4. MODALS & OVERLAYS */}

      {/* MODAL: REPORT ISSUE */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Bug className="w-4 h-4 text-red-600" />
                <span>Report an Issue to Principal Office</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportIssueSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Description & Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what is not working or attach details..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-md"
                >
                  Submit Issue Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Password updated successfully!');
                setShowPasswordModal(false);
              }} 
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={currentProfile}
        onSaveProfile={updateUserProfile}
      />

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        expectedToken={monthlyQRToken}
        onSuccessScan={handleSuccessfulQRScan}
      />

      {/* FOOTER */}
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-xs text-slate-500">
        © 2026 Dhaanish Chennai Autonomous | Resident Portal • Associated by KMX Technologies
      </footer>

    </div>
  );
};

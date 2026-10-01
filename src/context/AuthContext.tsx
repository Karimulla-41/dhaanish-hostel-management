import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Student, 
  UserRole, 
  AttendanceStatus, 
  FilterOptions, 
  BlockInfo, 
  RegisteredStaff, 
  OutingRequest,
  AppNotification,
  UserProfile,
  UserAccount,
  HostelBlock
} from '../types';
import { initialStudents, initialBlocks } from '../data/mockData';
import {
  apiLogin,
  apiRegisterStudent,
  apiRegisterStaff,
  apiFetchStudents,
  apiApproveStudentVerification,
  apiUpdateAttendanceStatus,
  apiFetchOutingRequests,
  apiSubmitOutingRequest,
  apiCCApproveOuting,
  apiCCRejectOuting,
  apiWardenApproveOuting,
  apiWardenRejectOuting,
  apiFetchLatestMonthlyQR,
  apiGenerateMonthlyQR
} from '../services/api';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  students: Student[];
  blocks: BlockInfo[];
  registeredStaff: RegisteredStaff[];
  outingRequests: OutingRequest[];
  monthlyQRToken: string;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  activeBlockFilter: string;
  setActiveBlockFilter: (block: string) => void;
  quickStatusFilter: string;
  setQuickStatusFilter: (status: string) => void;
  login: (email: string, password?: string, overrideRole?: UserRole) => { success: boolean; message?: string };
  logout: () => void;
  registerStudent: (newStudentData: Partial<Student> & { password?: string }) => Student;
  registerStaff: (newStaffData: Partial<RegisteredStaff> & { password?: string }) => RegisteredStaff;
  approveStudentVerification: (studentId: string) => void;
  updateStudentAttendanceStatus: (studentId: string, status: AttendanceStatus) => void;
  submitOutingRequest: (request: Omit<OutingRequest, 'id' | 'status' | 'appliedAt'>) => OutingRequest;
  ccApproveOutingRequest: (requestId: string) => void;
  ccRejectOutingRequest: (requestId: string) => void;
  wardenApproveOutingRequest: (requestId: string) => void;
  wardenRejectOutingRequest: (requestId: string) => void;
  submitComplaint: (category: string, description: string) => void;
  updateMonthlyQRToken: (newToken: string) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  
  // Real-Time Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // User Profiles & Photo Upload Persistence
  userProfiles: Record<UserRole, UserProfile>;
  currentProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  
  // User Accounts & Pre-registration
  userAccounts: UserAccount[];
  preRegisterAccount: (email: string, password: string, role?: UserRole, name?: string) => void;

  // Warden Assignment Management
  assignWardenToBlock: (data: { name: string; email: string; phone: string; password?: string; assignedBlock: HostelBlock; designation?: string }) => void;
  removeWardenFromBlock: (block: HostelBlock) => void;
}

const defaultFilters: FilterOptions = {
  search: '',
  block: '',
  floor: '',
  room: '',
  department: '',
  year: '',
  attendanceStatus: '',
  verificationStatus: '',
};

const defaultProfiles: Record<UserRole, UserProfile> = {
  Student: {
    id: 'STU-001',
    name: 'Mohammed Aaqil',
    email: 'aaqil.23cse@dhaanish.in',
    phone: '+91 98401 23456',
    role: 'Student',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '3rd Year',
    block: 'Block A',
    room: 'A-101',
  },
  Warden: {
    id: 'STF-001',
    name: 'Dr. K. Ramanathan',
    email: 'warden.office@dhaanish.in',
    phone: '+91 94440 98765',
    role: 'Warden',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    designation: 'Chief Hostel Warden',
    block: 'Block A',
  },
  CC: {
    id: 'STF-002',
    name: 'Prof. S. Anitha',
    email: 'cc.cse@dhaanish.in',
    phone: '+91 98840 55443',
    role: 'CC',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    designation: 'Class Coordinator (CSE Department)',
    department: 'CSE',
  },
  Admin: {
    id: 'STF-000',
    name: 'Institutional Administrator',
    email: 'admin@dhaanish.in',
    phone: '+91 44 2715 6000',
    role: 'Admin',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    designation: 'System Administrator',
  },
  Security: {
    id: 'SEC-001',
    name: 'Chief Security Officer',
    email: 'security.gate@dhaanish.in',
    phone: '+91 99999 11111',
    role: 'Security',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    designation: 'Main Gate Security In-Charge',
  },
};

const defaultAccounts: UserAccount[] = [
  {
    email: 'admin@dhaanish.in',
    password: 'admin123',
    role: 'Admin',
    name: 'Institutional Administrator',
    createdAt: '2026-01-01',
  },
  {
    email: 'warden.office@dhaanish.in',
    password: 'warden123',
    role: 'Warden',
    name: 'Dr. K. Ramanathan',
    createdAt: '2026-01-01',
  },
  {
    email: 'cc.cse@dhaanish.in',
    password: 'cc123',
    role: 'CC',
    name: 'Prof. S. Anitha',
    createdAt: '2026-01-01',
  },
  {
    email: 'student@dhaanish.in',
    password: 'student123',
    role: 'Student',
    name: 'Mohammed Aaqil',
    createdAt: '2026-01-01',
  },
  {
    email: 'aaqil.23cse@dhaanish.in',
    password: 'student123',
    role: 'Student',
    name: 'Mohammed Aaqil',
    createdAt: '2026-01-01',
  },
  {
    email: 'karimulla@gmail.com',
    password: 'karimulla123',
    role: 'Student',
    name: 'Shaik Karimulla',
    createdAt: '2026-01-01',
  },
  {
    email: 'karimulla@dhaanish.in',
    password: 'karimulla123',
    role: 'Student',
    name: 'Shaik Karimulla',
    createdAt: '2026-01-01',
  },
];

const initialOutingRequests: OutingRequest[] = [];

// Deduplication Utilities
function deduplicateAccounts(accounts: UserAccount[]): UserAccount[] {
  const map = new Map<string, UserAccount>();
  for (const acc of accounts) {
    if (!acc || !acc.email) continue;
    const cleanEmail = acc.email.trim().toLowerCase();
    map.set(cleanEmail, {
      ...acc,
      email: cleanEmail
    });
  }
  return Array.from(map.values());
}

function deduplicateStudents(studentList: Student[]): Student[] {
  const map = new Map<string, Student>();
  for (const s of studentList) {
    if (!s || (!s.email && !s.regNo)) continue;
    const key = (s.email ? s.email.trim().toLowerCase() : s.regNo.trim().toUpperCase());
    map.set(key, {
      ...s,
      email: s.email ? s.email.trim().toLowerCase() : s.email,
      regNo: s.regNo ? s.regNo.trim().toUpperCase() : s.regNo
    });
  }
  return Array.from(map.values());
}

interface SavedSession {
  isAuthenticated: boolean;
  role: UserRole;
  email: string;
  activeView: string;
}

const getSavedSession = (): SavedSession | null => {
  try {
    const raw = localStorage.getItem('dhaanish_auth_session');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved session', e);
  }
  return null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getSavedSession();

  const [role, setRole] = useState<UserRole>(initialSession?.role || 'Student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialSession?.isAuthenticated || false);
  const [activeView, setActiveView] = useState<string>(
    initialSession?.isAuthenticated ? (initialSession.activeView || 'dashboard') : 'login'
  );
  const [currentLoggedInEmail, setCurrentLoggedInEmail] = useState<string>(initialSession?.email || '');
  
  // Persistent Students Store
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('dhaanish_hostel_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicateStudents(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load students from localStorage', e);
    }
    return deduplicateStudents(initialStudents);
  });

  const [blocks] = useState<BlockInfo[]>(initialBlocks);
  const [registeredStaff, setRegisteredStaff] = useState<RegisteredStaff[]>(() => {
    try {
      const saved = localStorage.getItem('dhaanish_registered_staff');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load registered staff from localStorage', e);
    }
    return [];
  });

  const [outingRequests, setOutingRequests] = useState<OutingRequest[]>(initialOutingRequests);
  const [monthlyQRToken, setMonthlyQRToken] = useState<string>('DHAANISH-RENEWAL-2026-10-OCTOBER');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [activeBlockFilter, setActiveBlockFilter] = useState<string>('All');
  const [quickStatusFilter, setQuickStatusFilter] = useState<string>('All');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Persistent User Accounts Store
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('dhaanish_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deduplicateAccounts([...defaultAccounts, ...parsed]);
        }
      }
    } catch (e) {
      console.warn('Failed to load user accounts from localStorage', e);
    }
    return deduplicateAccounts(defaultAccounts);
  });

  // Persistent User Profiles
  const [userProfiles, setUserProfiles] = useState<Record<UserRole, UserProfile>>(() => {
    try {
      const saved = localStorage.getItem('dhaanish_hostel_user_profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load user profiles from localStorage', e);
    }
    return defaultProfiles;
  });

  // Real-Time Persistent Notifications Engine
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('dhaanish_hostel_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    return [
      {
        id: 'NOTIF-101',
        recipientRole: 'Warden',
        title: 'New Student Registration Pending',
        message: 'Student Deepak S (26AIDS101) registered and is pending Warden verification.',
        category: 'registration',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        actionView: 'registry'
      },
      {
        id: 'NOTIF-102',
        recipientRole: 'Student',
        title: 'Outing Return Time Reminder',
        message: 'Reminder: Scheduled return time for your Local Outing is 08:00 PM today.',
        category: 'reminder',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        actionView: 'dashboard'
      },
      {
        id: 'NOTIF-103',
        recipientRole: 'CC',
        title: 'Outing Pass Submitted',
        message: 'Mohammed Aaqil (23CSE1045) requested a Local Outing pass to T. Nagar.',
        category: 'outing',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        actionView: 'approvals'
      }
    ];
  });

  // LocalStorage Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('dhaanish_hostel_students', JSON.stringify(deduplicateStudents(students)));
    } catch (e) {
      console.warn('LocalStorage save error for students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaanish_registered_accounts', JSON.stringify(deduplicateAccounts(userAccounts)));
    } catch (e) {
      console.warn('LocalStorage save error for user accounts', e);
    }
  }, [userAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaanish_hostel_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage save error for notifications', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaanish_hostel_user_profiles', JSON.stringify(userProfiles));
    } catch (e) {
      console.warn('LocalStorage save error for user profiles', e);
    }
  }, [userProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaanish_registered_staff', JSON.stringify(registeredStaff));
    } catch (e) {
      console.warn('LocalStorage save error for registered staff', e);
    }
  }, [registeredStaff]);

  // Persist Active Auth Session
  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem('dhaanish_auth_session', JSON.stringify({
          isAuthenticated: true,
          role,
          email: currentLoggedInEmail,
          activeView
        }));
      } else {
        localStorage.removeItem('dhaanish_auth_session');
      }
    } catch (e) {
      console.warn('LocalStorage save error for auth session', e);
    }
  }, [isAuthenticated, role, currentLoggedInEmail, activeView]);

  // Sync initial API Data
  useEffect(() => {
    async function loadDataFromApi() {
      const apiStudents = await apiFetchStudents();
      if (apiStudents && apiStudents.length > 0) {
        setStudents(apiStudents);
      }
      const apiRequests = await apiFetchOutingRequests();
      if (apiRequests && apiRequests.length > 0) {
        setOutingRequests(apiRequests);
      }
      const latestToken = await apiFetchLatestMonthlyQR();
      if (latestToken) {
        setMonthlyQRToken(latestToken);
      }
    }
    loadDataFromApi();
  }, []);

  // Dispatch Notification
  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => {
      if (n.recipientRole === role || n.recipientRole === 'All') {
        return { ...n, isRead: true };
      }
      return n;
    }));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Update User Profile & Photo
  const updateUserProfile = (updatedProfile: UserProfile) => {
    setUserProfiles(prev => ({
      ...prev,
      [updatedProfile.role]: updatedProfile
    }));

    if (updatedProfile.role === 'Student') {
      setStudents(prev => prev.map(s => {
        if (s.id === updatedProfile.id || s.email === updatedProfile.email) {
          return {
            ...s,
            name: updatedProfile.name,
            phone: updatedProfile.phone,
            photoUrl: updatedProfile.photoUrl,
            block: updatedProfile.block || s.block,
            room: updatedProfile.room || s.room,
          };
        }
        return s;
      }));
    }
  };

  const currentProfile = userProfiles[role] || defaultProfiles[role];

  // Pre-register account credentials immediately during Step 1 / OTP phase
  const preRegisterAccount = (email: string, password: string, accountRole: UserRole = 'Student', name: string = 'Resident User') => {
    if (!email || !email.includes('@')) return;
    const cleanEmail = email.trim().toLowerCase();

    const newAcc: UserAccount = {
      email: cleanEmail,
      password: password,
      role: accountRole,
      name: name,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUserAccounts(prev => deduplicateAccounts([newAcc, ...prev]));
  };

  // STRICT PASSWORD AUTHENTICATION LOGIN
  const login = (
    email: string, 
    password?: string, 
    overrideRole?: UserRole
  ): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin Master Override Exemption
    if (overrideRole === 'Admin' || cleanEmail.includes('admin')) {
      setRole('Admin');
      setIsAuthenticated(true);
      setActiveView('dashboard');
      setCurrentLoggedInEmail(cleanEmail);
      apiLogin(email, 'Admin').catch(() => {});
      return { success: true };
    }

    // 2. Strict Check in Persistent Accounts Store
    const account = userAccounts.find(a => a.email.toLowerCase() === cleanEmail);
    
    if (!account) {
      return { 
        success: false, 
        message: `No account found for "${email}". Please click "Student Registration (Sign Up)" below to create your account first.` 
      };
    }

    // 3. Strict Password Comparison
    if (password && password !== account.password) {
      return { 
        success: false, 
        message: 'Incorrect password! Please enter the exact password you set during registration.' 
      };
    }

    // 4. Authenticate & Sync Active Profile & Session
    const targetRole = account.role;
    setRole(targetRole);
    setIsAuthenticated(true);
    setActiveView('dashboard');
    setCurrentLoggedInEmail(cleanEmail);

    if (targetRole === 'Student') {
      const matchedStudent = students.find(s => s.email.toLowerCase() === cleanEmail);
      if (matchedStudent) {
        updateUserProfile({
          id: matchedStudent.id,
          name: matchedStudent.name,
          email: matchedStudent.email,
          phone: matchedStudent.phone,
          role: 'Student',
          photoUrl: matchedStudent.photoUrl,
          department: matchedStudent.department,
          year: matchedStudent.year,
          block: matchedStudent.block,
          room: matchedStudent.room,
        });
      } else {
        updateUserProfile({
          id: `STU-${Date.now().toString().slice(-4)}`,
          name: account.name || 'Student Resident',
          email: account.email,
          phone: '+91 98401 23456',
          role: 'Student',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          department: 'CSE',
          year: '1st Year',
          block: 'Block A',
          room: 'A-101',
        });
      }
    }

    apiLogin(email, targetRole).catch(() => {});
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('login');
    setCurrentLoggedInEmail('');
    try {
      localStorage.removeItem('dhaanish_auth_session');
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
  };

  const registerStaff = (newStaffData: Partial<RegisteredStaff> & { password?: string }): RegisteredStaff => {
    const cleanEmail = (newStaffData.email || 'staff@dhaanish.in').trim().toLowerCase();
    
    const existingStaff = registeredStaff.find(s => s.email.trim().toLowerCase() === cleanEmail);
    const newStaff: RegisteredStaff = {
      id: existingStaff ? existingStaff.id : `STF-0${registeredStaff.length + 1}`,
      name: newStaffData.name || existingStaff?.name || 'New Staff',
      email: cleanEmail,
      role: newStaffData.role || existingStaff?.role || 'Warden',
      staffId: newStaffData.staffId || existingStaff?.staffId || `STF${Math.floor(100 + Math.random() * 900)}`,
      phone: newStaffData.phone || existingStaff?.phone || '+91 90000 00000',
      assignedBlock: newStaffData.assignedBlock || existingStaff?.assignedBlock,
      assignedDept: newStaffData.assignedDept || existingStaff?.assignedDept,
      designation: newStaffData.designation || existingStaff?.designation || (newStaffData.role === 'Warden' ? 'Block Warden' : 'Class Coordinator'),
      joinDate: existingStaff?.joinDate || new Date().toISOString().split('T')[0],
    };

    setRegisteredStaff(prev => {
      const filtered = prev.filter(s => s.email.trim().toLowerCase() !== cleanEmail);
      return [newStaff, ...filtered];
    });
    apiRegisterStaff(newStaff).catch(() => {});

    // Save persistent staff credentials
    if (cleanEmail && newStaffData.password) {
      const newAcc: UserAccount = {
        email: cleanEmail,
        password: newStaffData.password,
        role: newStaff.role,
        name: newStaff.name,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUserAccounts(prev => deduplicateAccounts([newAcc, ...prev]));
    }

    // Auto log-in & set persistent session
    setIsAuthenticated(true);
    setRole(newStaff.role);
    setActiveView('dashboard');
    setCurrentLoggedInEmail(cleanEmail);

    return newStaff;
  };

  const assignWardenToBlock = (data: { name: string; email: string; phone: string; password?: string; assignedBlock: HostelBlock; designation?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existingIndex = registeredStaff.findIndex(s => s.role === 'Warden' && s.assignedBlock === data.assignedBlock);
    const updatedWarden: RegisteredStaff = {
      id: existingIndex >= 0 ? registeredStaff[existingIndex].id : `STF-W-${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      role: 'Warden',
      staffId: existingIndex >= 0 ? registeredStaff[existingIndex].staffId : `WRD-${Math.floor(100 + Math.random() * 900)}`,
      phone: data.phone,
      assignedBlock: data.assignedBlock,
      designation: data.designation || `Warden (${data.assignedBlock})`,
      joinDate: new Date().toISOString().split('T')[0],
    };

    setRegisteredStaff(prev => {
      const filtered = prev.filter(s => !(s.role === 'Warden' && s.assignedBlock === data.assignedBlock));
      return [...filtered, updatedWarden];
    });

    if (cleanEmail) {
      const newAcc: UserAccount = {
        email: cleanEmail,
        password: data.password || 'warden123',
        role: 'Warden',
        name: data.name,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUserAccounts(prev => deduplicateAccounts([newAcc, ...prev]));
    }
  };

  const removeWardenFromBlock = (block: HostelBlock) => {
    setRegisteredStaff(prev => prev.filter(s => !(s.role === 'Warden' && s.assignedBlock === block)));
  };

  const registerStudent = (newStudentData: Partial<Student> & { password?: string }): Student => {
    const cleanEmail = (newStudentData.email || 'student@dhaanish.in').trim().toLowerCase();
    const cleanRegNo = (newStudentData.regNo || '26CSE0000').trim().toUpperCase();

    // Check for existing student record by email or regNo
    const existingStudent = students.find(
      s => s.email.trim().toLowerCase() === cleanEmail || s.regNo.trim().toUpperCase() === cleanRegNo
    );

    const studentId = existingStudent ? existingStudent.id : `STU-00${students.length + 1}`;
    const hostelId = existingStudent ? existingStudent.hostelId : `HST00${students.length + 1}`;
    
    const updatedStudent: Student = {
      id: studentId,
      name: newStudentData.name || existingStudent?.name || 'New Student',
      regNo: cleanRegNo,
      department: newStudentData.department || existingStudent?.department || 'CSE',
      year: newStudentData.year || existingStudent?.year || '1st Year',
      block: newStudentData.block || existingStudent?.block || 'Block A',
      floor: newStudentData.floor || existingStudent?.floor || '1st Floor',
      room: newStudentData.room || existingStudent?.room || 'A-101',
      bedNo: `${newStudentData.room || 'A-101'}-1`,
      hostelId: hostelId,
      photoUrl: newStudentData.photoUrl || existingStudent?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      email: cleanEmail,
      phone: newStudentData.phone || existingStudent?.phone || '+91 98000 00000',
      parentName: newStudentData.parentName || existingStudent?.parentName || 'Parent Name',
      parentContact: newStudentData.parentContact || existingStudent?.parentContact || '+91 98000 11111',
      status: existingStudent?.status || 'Present',
      verificationStatus: existingStudent?.verificationStatus || 'Pending Verification',
      joinDate: existingStudent?.joinDate || new Date().toISOString().split('T')[0],
      activityHistory: existingStudent?.activityHistory || [
        {
          id: `ACT-${Date.now()}`,
          type: 'Request',
          title: 'Student Registration Submitted',
          timestamp: 'Just now',
          status: 'Pending',
          description: 'Registration pending verification by Warden.'
        }
      ]
    };

    setStudents(prev => deduplicateStudents([updatedStudent, ...prev]));
    apiRegisterStudent(updatedStudent).catch(() => {});

    // Save persistent student credentials
    if (cleanEmail && newStudentData.password) {
      const newAcc: UserAccount = {
        email: cleanEmail,
        password: newStudentData.password,
        role: 'Student',
        name: updatedStudent.name,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUserAccounts(prev => deduplicateAccounts([newAcc, ...prev]));
    }

    // Sync newly registered student into userProfiles.Student
    updateUserProfile({
      id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      phone: updatedStudent.phone,
      role: 'Student',
      photoUrl: updatedStudent.photoUrl,
      department: updatedStudent.department,
      year: updatedStudent.year,
      block: updatedStudent.block,
      room: updatedStudent.room
    });

    // Auto log-in & set persistent session
    setIsAuthenticated(true);
    setRole('Student');
    setActiveView('dashboard');
    setCurrentLoggedInEmail(cleanEmail);

    // REAL-TIME NOTIFICATION: Alert Warden & CC about new student registration
    addNotification({
      recipientRole: 'Warden',
      title: 'New Student Registration Submitted',
      message: `Student ${updatedStudent.name} (${updatedStudent.regNo}) registered for ${updatedStudent.block} Room ${updatedStudent.room}. Verification required.`,
      category: 'registration',
      actionView: 'registry',
      relatedId: updatedStudent.id,
    });
    addNotification({
      recipientRole: 'CC',
      title: 'New Student Registered',
      message: `${updatedStudent.name} (${updatedStudent.regNo}) joined ${updatedStudent.department} department.`,
      category: 'registration',
      actionView: 'registry',
      relatedId: updatedStudent.id,
    });

    return updatedStudent;
  };

  const approveStudentVerification = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            verificationStatus: 'Active',
            activityHistory: [
              {
                id: `ACT-${Date.now()}`,
                type: 'Request',
                title: 'Student Verification Approved',
                timestamp: 'Just now',
                status: 'Approved',
                description: 'Profile verified and hostel admission activated by Warden.'
              },
              ...s.activityHistory
            ]
          };
        }
        return s;
      })
    );
    
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? { ...prev, verificationStatus: 'Active' } : null);
    }
    apiApproveStudentVerification(studentId).catch(() => {});

    if (student) {
      addNotification({
        recipientRole: 'Student',
        recipientId: student.id,
        title: 'Hostel Registration Approved! 🎉',
        message: `Welcome ${student.name}! Your Dhaanish Hostel resident status is now ACTIVE.`,
        category: 'system',
        actionView: 'dashboard',
      });
    }
  };

  const updateStudentAttendanceStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            status,
            activityHistory: [
              {
                id: `ACT-${Date.now()}`,
                type: status === 'Outing' ? 'Outing' : 'Attendance',
                title: `Status Changed to ${status}`,
                timestamp: 'Just now',
                status: 'Recorded',
                description: `Student status updated to ${status} by Warden.`
              },
              ...s.activityHistory
            ]
          };
        }
        return s;
      })
    );

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? { ...prev, status } : null);
    }
    apiUpdateAttendanceStatus(studentId, status).catch(() => {});
  };

  const submitOutingRequest = (requestData: Omit<OutingRequest, 'id' | 'status' | 'appliedAt'>): OutingRequest => {
    const newReq: OutingRequest = {
      ...requestData,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending CC',
      appliedAt: new Date().toLocaleString()
    };
    setOutingRequests(prev => [newReq, ...prev]);
    apiSubmitOutingRequest(requestData).catch(() => {});

    addNotification({
      recipientRole: 'CC',
      title: 'New Outing Gate Pass Applied',
      message: `${requestData.studentName} (${requestData.regNo}) applied for ${requestData.type} to ${requestData.destination}. Recommendation needed.`,
      category: 'outing',
      actionView: 'approvals',
      relatedId: newReq.id
    });
    addNotification({
      recipientRole: 'Warden',
      title: 'Outing Pass Submitted (Pending CC)',
      message: `${requestData.studentName} (${requestData.block} ${requestData.room}) applied for ${requestData.type}.`,
      category: 'outing',
      actionView: 'approvals',
      relatedId: newReq.id
    });

    return newReq;
  };

  const ccApproveOutingRequest = (requestId: string) => {
    const req = outingRequests.find(r => r.id === requestId);
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Pending Warden' } : r));
    apiCCApproveOuting(requestId).catch(() => {});

    if (req) {
      addNotification({
        recipientRole: 'Warden',
        title: 'CC Recommended Outing Pass ✅',
        message: `Class Coordinator recommended ${req.studentName}'s ${req.type} pass to ${req.destination}. Final Warden approval required.`,
        category: 'outing',
        actionView: 'approvals',
        relatedId: req.id
      });
      addNotification({
        recipientRole: 'Student',
        recipientId: req.studentId,
        title: 'Outing Pass Step 1 Approved by CC',
        message: `Your Class Coordinator recommended your pass! Sent to Chief Warden for final approval.`,
        category: 'outing',
        actionView: 'dashboard',
        relatedId: req.id
      });
    }
  };

  const ccRejectOutingRequest = (requestId: string) => {
    const req = outingRequests.find(r => r.id === requestId);
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'CC Rejected' } : r));
    apiCCRejectOuting(requestId).catch(() => {});

    if (req) {
      addNotification({
        recipientRole: 'Student',
        recipientId: req.studentId,
        title: 'Outing Pass Declined by CC ❌',
        message: `Your ${req.type} application to ${req.destination} was not recommended by your Class Coordinator.`,
        category: 'outing',
        actionView: 'dashboard',
        relatedId: req.id
      });
    }
  };

  const wardenApproveOutingRequest = (requestId: string) => {
    const req = outingRequests.find(r => r.id === requestId);
    setOutingRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        updateStudentAttendanceStatus(r.studentId, r.type === 'Home Leave' ? 'Leave' : 'Outing');
        return { ...r, status: 'Approved', approvedAt: new Date().toLocaleString() };
      }
      return r;
    }));
    apiWardenApproveOuting(requestId).catch(() => {});

    if (req) {
      addNotification({
        recipientRole: 'Student',
        recipientId: req.studentId,
        title: 'Warden Approved Outing Gate Pass! 🎟️',
        message: `Your ${req.type} to ${req.destination} is fully APPROVED! Scan Gate Security QR code when exiting.`,
        category: 'outing',
        actionView: 'dashboard',
        relatedId: req.id
      });
      addNotification({
        recipientRole: 'CC',
        title: 'Outing Pass Approved by Warden',
        message: `Final approval granted for ${req.studentName} (${req.regNo}). Return expected by ${req.returnTime}.`,
        category: 'outing',
        actionView: 'approvals',
        relatedId: req.id
      });

      addNotification({
        recipientRole: 'Student',
        recipientId: req.studentId,
        title: 'Outing Time Reminder ⏰',
        message: `Reminder: Please ensure you return to ${req.block} before ${req.returnTime} today to maintain gate pass compliance.`,
        category: 'reminder',
        actionView: 'dashboard',
      });
    }
  };

  const wardenRejectOutingRequest = (requestId: string) => {
    const req = outingRequests.find(r => r.id === requestId);
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Warden Rejected' } : r));
    apiWardenRejectOuting(requestId).catch(() => {});

    if (req) {
      addNotification({
        recipientRole: 'Student',
        recipientId: req.studentId,
        title: 'Outing Pass Rejected by Warden ❌',
        message: `Your ${req.type} application was declined by the Warden Office.`,
        category: 'outing',
        actionView: 'dashboard',
        relatedId: req.id
      });
    }
  };

  const submitComplaint = (category: string, description: string) => {
    const studentProf = userProfiles.Student;
    
    addNotification({
      recipientRole: 'Warden',
      title: `New Maintenance Ticket (${category})`,
      message: `Room Complaint from ${studentProf.name} (${studentProf.block} ${studentProf.room}): ${description}`,
      category: 'complaint',
      actionView: 'approvals',
    });
    addNotification({
      recipientRole: 'CC',
      title: `Student Room Complaint (${category})`,
      message: `${studentProf.name} logged a ${category} issue in ${studentProf.block} ${studentProf.room}.`,
      category: 'complaint',
      actionView: 'approvals',
    });
    addNotification({
      recipientRole: 'Student',
      title: 'Maintenance Ticket Logged 🛠️',
      message: `Your ticket for "${category}" in ${studentProf.room} has been dispatched to Maintenance & Warden.`,
      category: 'complaint',
      actionView: 'dashboard',
    });
  };

  const updateMonthlyQRToken = (newToken: string) => {
    setMonthlyQRToken(newToken);
    apiGenerateMonthlyQR(newToken).catch(() => {});
    
    addNotification({
      recipientRole: 'All',
      title: 'New Monthly Gate QR Generated 🔄',
      message: `Chief Warden published official Monthly Pass Token for QR Security Verification.`,
      category: 'system',
      actionView: 'dashboard',
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setActiveBlockFilter('All');
    setQuickStatusFilter('All');
  };

  const roleNotifications = notifications.filter(n => 
    n.recipientRole === role || n.recipientRole === 'All'
  );
  const unreadCount = roleNotifications.filter(n => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        activeView,
        setActiveView,
        students,
        blocks,
        registeredStaff,
        outingRequests,
        monthlyQRToken,
        selectedStudent,
        setSelectedStudent,
        filters,
        setFilters,
        resetFilters,
        activeBlockFilter,
        setActiveBlockFilter,
        quickStatusFilter,
        setQuickStatusFilter,
        login,
        logout,
        registerStudent,
        registerStaff,
        approveStudentVerification,
        updateStudentAttendanceStatus,
        submitOutingRequest,
        ccApproveOutingRequest,
        ccRejectOutingRequest,
        wardenApproveOutingRequest,
        wardenRejectOutingRequest,
        submitComplaint,
        updateMonthlyQRToken,
        isMobileFrame,
        setIsMobileFrame,
        isFilterModalOpen,
        setIsFilterModalOpen,
        
        // Notifications Context Values
        notifications: roleNotifications,
        unreadNotificationCount: unreadCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,

        // User Profile & Photo Upload Values
        userProfiles,
        currentProfile,
        updateUserProfile,

        // User Accounts Store
        userAccounts,
        preRegisterAccount,

        // Warden Management Methods
        assignWardenToBlock,
        removeWardenFromBlock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

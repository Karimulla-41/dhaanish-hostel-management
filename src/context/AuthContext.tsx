import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, UserRole, AttendanceStatus, FilterOptions, BlockInfo, RegisteredStaff, OutingRequest } from '../types';
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
  login: (email: string, overrideRole?: UserRole) => void;
  logout: () => void;
  registerStudent: (newStudentData: Partial<Student>) => Student;
  registerStaff: (newStaffData: Partial<RegisteredStaff>) => RegisteredStaff;
  approveStudentVerification: (studentId: string) => void;
  updateStudentAttendanceStatus: (studentId: string, status: AttendanceStatus) => void;
  submitOutingRequest: (request: Omit<OutingRequest, 'id' | 'status' | 'appliedAt'>) => OutingRequest;
  ccApproveOutingRequest: (requestId: string) => void;
  ccRejectOutingRequest: (requestId: string) => void;
  wardenApproveOutingRequest: (requestId: string) => void;
  wardenRejectOutingRequest: (requestId: string) => void;
  updateMonthlyQRToken: (newToken: string) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  notificationCount: number;
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

const initialOutingRequests: OutingRequest[] = [
  {
    id: 'REQ-101',
    studentId: 'STU-001',
    studentName: 'Arun Kumar',
    regNo: '23CSE1045',
    dept: 'CSE',
    year: '3rd Year',
    room: 'A-204',
    block: 'Block A',
    type: 'Home Leave',
    destination: 'Madurai (Family Wedding)',
    reason: 'Attending elder sister wedding ceremony in Madurai.',
    outTime: '2026-09-30 08:00 AM',
    returnTime: '2026-10-03 08:00 PM',
    parentPhone: '+91 98765 43210',
    status: 'Pending CC',
    appliedAt: '2026-09-28 10:30 AM'
  },
  {
    id: 'REQ-102',
    studentId: 'STU-002',
    studentName: 'Sneha P',
    regNo: '23IT1088',
    dept: 'CSE',
    year: '3rd Year',
    room: 'C-102',
    block: 'Block C',
    type: 'Local Outing',
    destination: 'Ritchie Street, Chennai',
    reason: 'Purchasing project hardware components.',
    outTime: '2026-09-29 04:00 PM',
    returnTime: '2026-09-29 08:00 PM',
    parentPhone: '+91 94441 23456',
    status: 'Pending CC',
    appliedAt: '2026-09-28 02:15 PM'
  },
  {
    id: 'REQ-103',
    studentId: 'STU-003',
    studentName: 'Vignesh M',
    regNo: '24ECE204',
    dept: 'ECE',
    year: '2nd Year',
    room: 'B-301',
    block: 'Block B',
    type: 'Emergency Pass',
    destination: 'Apollo Dental Hospital, Tambaram',
    reason: 'Medical consultation for dental emergency.',
    outTime: '2026-09-28 09:00 AM',
    returnTime: '2026-09-30 06:00 PM',
    parentPhone: '+91 98400 11223',
    status: 'Pending Warden',
    appliedAt: '2026-09-28 09:00 AM'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('Student');
  
  // STRICT UNAUTHENTICATED DEFAULT: User must log in after splash screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('login');
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [blocks] = useState<BlockInfo[]>(initialBlocks);
  const [registeredStaff, setRegisteredStaff] = useState<RegisteredStaff[]>([
    { id: 'STF-01', name: 'Dr. Senthil Kumar', email: 'warden@dhaanish.in', role: 'Warden', staffId: 'WRD01', phone: '+91 94433 11223', assignedBlock: 'Block A', designation: 'Chief Warden', joinDate: '2026-01-01' },
    { id: 'STF-02', name: 'Prof. Ramesh V', email: 'cc.cse@dhaanish.in', role: 'CC', staffId: 'CC01', phone: '+91 94433 44556', assignedDept: 'CSE', designation: 'Senior Class Coordinator', joinDate: '2026-01-01' },
  ]);

  const [outingRequests, setOutingRequests] = useState<OutingRequest[]>(initialOutingRequests);
  const [monthlyQRToken, setMonthlyQRToken] = useState<string>('DHAANISH-RENEWAL-2026-10-OCTOBER');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [activeBlockFilter, setActiveBlockFilter] = useState<string>('All');
  const [quickStatusFilter, setQuickStatusFilter] = useState<string>('All');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Initial Backend API Data Fetch & Synchronization
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

  const login = (email: string, overrideRole?: UserRole) => {
    if (overrideRole) {
      setRole(overrideRole);
    } else {
      const matchedStaff = registeredStaff.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (matchedStaff) {
        setRole(matchedStaff.role);
      } else {
        const lower = email.toLowerCase();
        if (lower.includes('warden')) setRole('Warden');
        else if (lower.includes('cc')) setRole('CC');
        else if (lower.includes('admin')) setRole('Admin');
        else if (lower.includes('security')) setRole('Security');
        else setRole('Student');
      }
    }
    apiLogin(email, overrideRole || 'Student').catch(() => {});
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('login');
  };

  const registerStaff = (newStaffData: Partial<RegisteredStaff>): RegisteredStaff => {
    const newStaff: RegisteredStaff = {
      id: `STF-0${registeredStaff.length + 1}`,
      name: newStaffData.name || 'New Staff',
      email: newStaffData.email || 'staff@dhaanish.in',
      role: newStaffData.role || 'Warden',
      staffId: newStaffData.staffId || `STF${Math.floor(100 + Math.random() * 900)}`,
      phone: newStaffData.phone || '+91 90000 00000',
      assignedBlock: newStaffData.assignedBlock,
      assignedDept: newStaffData.assignedDept,
      designation: newStaffData.designation || (newStaffData.role === 'Warden' ? 'Block Warden' : 'Class Coordinator'),
      joinDate: new Date().toISOString().split('T')[0],
    };

    setRegisteredStaff(prev => [newStaff, ...prev]);
    apiRegisterStaff(newStaff).catch(() => {});
    return newStaff;
  };

  const registerStudent = (newStudentData: Partial<Student>): Student => {
    const newId = `STU-00${students.length + 1}`;
    const hostelId = `HST00${students.length + 1}`;
    
    const newStudent: Student = {
      id: newId,
      name: newStudentData.name || 'New Student',
      regNo: newStudentData.regNo || '26CSE0000',
      department: newStudentData.department || 'CSE',
      year: newStudentData.year || '1st Year',
      block: newStudentData.block || 'Block A',
      floor: newStudentData.floor || '1st Floor',
      room: newStudentData.room || 'A-101',
      bedNo: `${newStudentData.room || 'A-101'}-1`,
      hostelId: hostelId,
      photoUrl: newStudentData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      email: newStudentData.email || 'student@dhaanish.in',
      phone: newStudentData.phone || '+91 98000 00000',
      parentName: newStudentData.parentName || 'Parent Name',
      parentContact: newStudentData.parentContact || '+91 98000 11111',
      status: 'Present',
      verificationStatus: 'Pending Verification',
      joinDate: new Date().toISOString().split('T')[0],
      activityHistory: [
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

    setStudents(prev => [newStudent, ...prev]);
    apiRegisterStudent(newStudent).catch(() => {});
    return newStudent;
  };

  const approveStudentVerification = (studentId: string) => {
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

  // Outing Workflow Functions
  const submitOutingRequest = (requestData: Omit<OutingRequest, 'id' | 'status' | 'appliedAt'>): OutingRequest => {
    const newReq: OutingRequest = {
      ...requestData,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending CC',
      appliedAt: new Date().toLocaleString()
    };
    setOutingRequests(prev => [newReq, ...prev]);
    apiSubmitOutingRequest(requestData).catch(() => {});
    return newReq;
  };

  const ccApproveOutingRequest = (requestId: string) => {
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Pending Warden' } : r));
    apiCCApproveOuting(requestId).catch(() => {});
  };

  const ccRejectOutingRequest = (requestId: string) => {
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'CC Rejected' } : r));
    apiCCRejectOuting(requestId).catch(() => {});
  };

  const wardenApproveOutingRequest = (requestId: string) => {
    setOutingRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        // Also update student attendance status to Outing/Leave
        updateStudentAttendanceStatus(r.studentId, r.type === 'Home Leave' ? 'Leave' : 'Outing');
        return { ...r, status: 'Approved', approvedAt: new Date().toLocaleString() };
      }
      return r;
    }));
    apiWardenApproveOuting(requestId).catch(() => {});
  };

  const wardenRejectOutingRequest = (requestId: string) => {
    setOutingRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Warden Rejected' } : r));
    apiWardenRejectOuting(requestId).catch(() => {});
  };

  const updateMonthlyQRToken = (newToken: string) => {
    setMonthlyQRToken(newToken);
    apiGenerateMonthlyQR(newToken).catch(() => {});
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setActiveBlockFilter('All');
    setQuickStatusFilter('All');
  };

  const pendingCount = students.filter(s => s.verificationStatus === 'Pending Verification').length + 
                       outingRequests.filter(r => r.status === 'Pending CC' || r.status === 'Pending Warden').length;

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
        updateMonthlyQRToken,
        isMobileFrame,
        setIsMobileFrame,
        isFilterModalOpen,
        setIsFilterModalOpen,
        notificationCount: pendingCount,
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


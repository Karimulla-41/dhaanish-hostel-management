export type HostelBlock = 'Block A' | 'Block B' | 'Block C' | 'Block D' | 'Block E' | 'Block F';

export type BlockStatus = 'Active' | 'Under Construction';

export type AttendanceStatus = 'Present' | 'Absent' | 'Outing' | 'Leave';

export type VerificationStatus = 'Pending Verification' | 'Active';

export type Department = 'CSE' | 'ECE' | 'EEE' | 'AIDS' | 'AIML' | 'MECH' | 'PETRO' | 'ROBO' | 'MECHATRONICS';

export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type UserRole = 'Admin' | 'Warden' | 'CC' | 'Student' | 'Security';

export interface ActivityLog {
  id: string;
  type: 'Attendance' | 'Outing' | 'Request' | 'Complaint';
  title: string;
  timestamp: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Recorded' | 'Resolved';
  description: string;
  details?: string;
}

export interface Student {
  id: string;
  name: string;
  regNo: string;
  department: Department;
  year: Year;
  block: HostelBlock;
  floor: string;
  room: string;
  bedNo: string;
  hostelId: string;
  photoUrl: string;
  email: string;
  phone: string;
  parentName: string;
  parentContact: string;
  status: AttendanceStatus;
  verificationStatus: VerificationStatus;
  joinDate: string;
  activityHistory: ActivityLog[];
}

export interface FilterOptions {
  search: string;
  block: string;
  floor: string;
  room: string;
  department: string;
  year: string;
  attendanceStatus: string;
  verificationStatus: string;
}

export interface BlockInfo {
  name: HostelBlock;
  status: BlockStatus;
  capacity: number;
  occupied: number;
  floors: number;
  description: string;
}

export interface RegisteredStaff {
  id: string;
  name: string;
  email: string;
  role: 'Warden' | 'CC';
  staffId: string;
  phone: string;
  assignedBlock?: HostelBlock;
  assignedDept?: Department;
  designation?: string;
  joinDate: string;
}

export type OutingStatus = 'Pending CC' | 'Pending Warden' | 'Approved' | 'CC Rejected' | 'Warden Rejected';

export interface OutingRequest {
  id: string;
  studentId: string;
  studentName: string;
  regNo: string;
  dept: Department;
  year: Year;
  room: string;
  block: HostelBlock;
  type: 'Local Outing' | 'Home Leave' | 'Emergency Pass';
  destination: string;
  reason: string;
  outTime: string;
  returnTime: string;
  parentPhone: string;
  status: OutingStatus;
  appliedAt: string;
  approvedAt?: string;
  monthlyPassVerified?: boolean;
}

export type NotificationCategory = 'outing' | 'complaint' | 'registration' | 'reminder' | 'system';

export interface AppNotification {
  id: string;
  recipientRole: UserRole | 'All';
  recipientId?: string; // Optional studentId or staffId
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionView?: string;
  relatedId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  photoUrl: string;
  department?: Department;
  year?: Year;
  block?: HostelBlock;
  room?: string;
  staffId?: string;
  designation?: string;
}

export interface UserAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: string;
}



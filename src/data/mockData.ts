import type { Student, BlockInfo } from '../types';

export const initialBlocks: BlockInfo[] = [
  {
    name: 'Block A',
    status: 'Active',
    capacity: 120,
    occupied: 112,
    floors: 4,
    description: 'Senior Boys Residence - Engineering Departments'
  },
  {
    name: 'Block B',
    status: 'Active',
    capacity: 140,
    occupied: 128,
    floors: 4,
    description: 'Junior Boys Residence - First & Second Year'
  },
  {
    name: 'Block C',
    status: 'Active',
    capacity: 100,
    occupied: 94,
    floors: 3,
    description: 'Girls Residence Block 1 - All Departments'
  },
  {
    name: 'Block D',
    status: 'Active',
    capacity: 120,
    occupied: 105,
    floors: 4,
    description: 'Girls Residence Block 2 - Post Graduates & Final Year'
  },
  {
    name: 'Block E',
    status: 'Active',
    capacity: 80,
    occupied: 68,
    floors: 3,
    description: 'International & Research Scholar Wing'
  },
  {
    name: 'Block F',
    status: 'Under Construction',
    capacity: 160,
    occupied: 0,
    floors: 5,
    description: 'New Executive Hostel Complex (Target Completion: Q2 2027)'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'Arun Kumar',
    regNo: '23CSE1045',
    department: 'CSE',
    year: '3rd Year',
    block: 'Block A',
    floor: '2nd Floor',
    room: 'A-204',
    bedNo: 'A-204-1',
    hostelId: 'HST001',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    email: 'arun.k@dhaanish.in',
    phone: '+91 98765 43210',
    parentName: 'R. Senthil Kumar',
    parentContact: '+91 94433 12345',
    status: 'Present',
    verificationStatus: 'Active',
    joinDate: '2023-08-14',
    activityHistory: [
      {
        id: 'ACT-101',
        type: 'Attendance',
        title: 'Night Roll Call Marked Present',
        timestamp: 'Today, 09:30 PM',
        status: 'Recorded',
        description: 'Biometric verified at Block A Security desk by Assistant Warden.'
      },
      {
        id: 'ACT-102',
        type: 'Outing',
        title: 'Weekend Outing Approved',
        timestamp: '25 Sep 2026, 08:00 AM',
        status: 'Approved',
        description: 'Destination: T. Nagar, Chennai. Returned at 07:15 PM (On Time).'
      },
      {
        id: 'ACT-103',
        type: 'Request',
        title: 'Room Maintenance - Ceiling Fan Noise',
        timestamp: '18 Sep 2026, 04:15 PM',
        status: 'Resolved',
        description: 'Electrician serviced fan bearings in Room A-204.'
      },
      {
        id: 'ACT-104',
        type: 'Complaint',
        title: 'Hot Water Supply Delay',
        timestamp: '05 Sep 2026, 07:00 AM',
        status: 'Resolved',
        description: 'Solar water heater pressure check completed.'
      }
    ]
  },
  {
    id: 'STU-002',
    name: 'Kaviya R',
    regNo: '22ECE2011',
    department: 'ECE',
    year: '4th Year',
    block: 'Block C',
    floor: '1st Floor',
    room: 'C-108',
    bedNo: 'C-108-2',
    hostelId: 'HST002',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'kaviya.r@dhaanish.in',
    phone: '+91 98765 88990',
    parentName: 'M. Rajendran',
    parentContact: '+91 98400 99887',
    status: 'Outing',
    verificationStatus: 'Active',
    joinDate: '2022-08-10',
    activityHistory: [
      {
        id: 'ACT-201',
        type: 'Outing',
        title: 'Local Outing Pass Issued',
        timestamp: 'Today, 04:30 PM',
        status: 'Approved',
        description: 'Outing purpose: Library Book Purchase. Gate scan verified.'
      },
      {
        id: 'ACT-202',
        type: 'Attendance',
        title: 'Morning Roll Call Marked Present',
        timestamp: 'Today, 07:30 AM',
        status: 'Recorded',
        description: 'Block C attendance register signed.'
      }
    ]
  },
  {
    id: 'STU-003',
    name: 'Mohammed Saif',
    regNo: '24AIDS309',
    department: 'AI&DS',
    year: '2nd Year',
    block: 'Block B',
    floor: '3rd Floor',
    room: 'B-312',
    bedNo: 'B-312-1',
    hostelId: 'HST003',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    email: 'saif.m@dhaanish.in',
    phone: '+91 91234 56789',
    parentName: 'Tariq Ibrahim',
    parentContact: '+91 91234 00000',
    status: 'Present',
    verificationStatus: 'Active',
    joinDate: '2024-07-20',
    activityHistory: [
      {
        id: 'ACT-301',
        type: 'Attendance',
        title: 'Night Roll Call Marked Present',
        timestamp: 'Today, 09:30 PM',
        status: 'Recorded',
        description: 'Verified present in room B-312.'
      }
    ]
  },
  {
    id: 'STU-004',
    name: 'Sneha P',
    regNo: '23IT1088',
    department: 'IT',
    year: '3rd Year',
    block: 'Block D',
    floor: '2nd Floor',
    room: 'D-201',
    bedNo: 'D-201-1',
    hostelId: 'HST004',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    email: 'sneha.p@dhaanish.in',
    phone: '+91 99887 76655',
    parentName: 'P. Prakash',
    parentContact: '+91 99887 11111',
    status: 'Leave',
    verificationStatus: 'Active',
    joinDate: '2023-08-14',
    activityHistory: [
      {
        id: 'ACT-401',
        type: 'Request',
        title: 'Home Leave Approval',
        timestamp: '26 Sep 2026, 10:00 AM',
        status: 'Approved',
        description: 'Home Visit granted till 30th Sep. Parent verification completed.'
      }
    ]
  },
  {
    id: 'STU-005',
    name: 'Rahul V',
    regNo: '25MECH102',
    department: 'MECH',
    year: '1st Year',
    block: 'Block B',
    floor: '1st Floor',
    room: 'B-105',
    bedNo: 'B-105-2',
    hostelId: 'HST005',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    email: 'rahul.v@dhaanish.in',
    phone: '+91 97766 55443',
    parentName: 'V. Varadharajan',
    parentContact: '+91 97766 00000',
    status: 'Absent',
    verificationStatus: 'Active',
    joinDate: '2025-08-01',
    activityHistory: [
      {
        id: 'ACT-501',
        type: 'Attendance',
        title: 'Unexcused Absence Recorded',
        timestamp: 'Today, 09:30 PM',
        status: 'Pending',
        description: 'Absent during night roll call. Warden inquiry initiated.'
      }
    ]
  },
  {
    id: 'STU-006',
    name: 'Ananya M',
    regNo: '24CSE2090',
    department: 'CSE',
    year: '2nd Year',
    block: 'Block C',
    floor: '3rd Floor',
    room: 'C-305',
    bedNo: 'C-305-1',
    hostelId: 'HST006',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    email: 'ananya.m@dhaanish.in',
    phone: '+91 96655 44332',
    parentName: 'M. Murali',
    parentContact: '+91 96655 12345',
    status: 'Present',
    verificationStatus: 'Active',
    joinDate: '2024-07-15',
    activityHistory: [
      {
        id: 'ACT-601',
        type: 'Attendance',
        title: 'Night Roll Call Present',
        timestamp: 'Today, 09:30 PM',
        status: 'Recorded',
        description: 'Biometric verified in Block C lobby.'
      }
    ]
  },
  {
    id: 'STU-007',
    name: 'Vikram R',
    regNo: '23CIVIL104',
    department: 'CIVIL',
    year: '3rd Year',
    block: 'Block A',
    floor: '4th Floor',
    room: 'A-410',
    bedNo: 'A-410-2',
    hostelId: 'HST007',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    email: 'vikram.r@dhaanish.in',
    phone: '+91 95544 33221',
    parentName: 'R. Raghuram',
    parentContact: '+91 95544 99999',
    status: 'Outing',
    verificationStatus: 'Active',
    joinDate: '2023-08-14',
    activityHistory: [
      {
        id: 'ACT-701',
        type: 'Outing',
        title: 'Project Work Outing',
        timestamp: 'Today, 02:00 PM',
        status: 'Approved',
        description: 'Site visit for structural design project.'
      }
    ]
  },
  {
    id: 'STU-008',
    name: 'Deepak S',
    regNo: '26AIDS101',
    department: 'AI&DS',
    year: '1st Year',
    block: 'Block E',
    floor: '1st Floor',
    room: 'E-102',
    bedNo: 'E-102-1',
    hostelId: 'HST008',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    email: 'deepak.s@dhaanish.in',
    phone: '+91 94433 22110',
    parentName: 'S. Sundaram',
    parentContact: '+91 94433 88888',
    status: 'Present',
    verificationStatus: 'Pending Verification',
    joinDate: '2026-09-20',
    activityHistory: [
      {
        id: 'ACT-801',
        type: 'Request',
        title: 'Student Registration Submitted',
        timestamp: 'Yesterday, 11:30 AM',
        status: 'Pending',
        description: 'Awaiting Warden document approval and room allocation check.'
      }
    ]
  }
];

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

export const initialStudents: Student[] = [];

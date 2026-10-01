import type { Student, BlockInfo } from '../types';

export const initialBlocks: BlockInfo[] = [
  {
    name: 'Block A',
    status: 'Active',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Senior Boys Residence - Engineering Wing'
  },
  {
    name: 'Block B',
    status: 'Active',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Junior Boys Residence - First & Second Year'
  },
  {
    name: 'Block C',
    status: 'Active',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Boys Residence Block C - All Departments'
  },
  {
    name: 'Block D',
    status: 'Active',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Boys Residence Block D - Post Graduates & Final Year'
  },
  {
    name: 'Block E',
    status: 'Active',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Boys Residence Block E - International & Research Scholar Wing'
  },
  {
    name: 'Block F',
    status: 'Under Construction',
    capacity: 0,
    occupied: 0,
    floors: 0,
    description: 'Executive Boys Hostel Complex (Target Completion: Q2 2027)'
  }
];

export const initialStudents: Student[] = [];

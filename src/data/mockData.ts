import type { Student, BlockInfo } from '../types';

export const initialBlocks: BlockInfo[] = [
  {
    name: 'Block A',
    status: 'Active',
    capacity: 120,
    occupied: 112,
    floors: 4,
    description: 'Boys Hostel Block A'
  },
  {
    name: 'Block B',
    status: 'Active',
    capacity: 140,
    occupied: 128,
    floors: 4,
    description: 'Boys Hostel Block B'
  },
  {
    name: 'Block C',
    status: 'Active',
    capacity: 100,
    occupied: 94,
    floors: 3,
    description: 'Boys Hostel Block C'
  },
  {
    name: 'Block D',
    status: 'Active',
    capacity: 120,
    occupied: 105,
    floors: 4,
    description: 'Boys Hostel Block D'
  },
  {
    name: 'Block E',
    status: 'Active',
    capacity: 80,
    occupied: 68,
    floors: 3,
    description: 'Boys Hostel Block E'
  },
  {
    name: 'Block F',
    status: 'Under Construction',
    capacity: 160,
    occupied: 0,
    floors: 5,
    description: 'Boys Hostel Block F (Under Construction)'
  }
];

export const initialStudents: Student[] = [];

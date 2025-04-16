import { Service, services } from './services';

export interface Booking {
  id: number;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  location: string;
  reviewed: boolean;
}

export const bookings: Booking[] = [
  {
    id: 1,
    service: services[0],
    date: '2025-01-20',
    time: '10:00 ص',
    status: 'confirmed',
    location: 'حي النزهة، الرياض',
    reviewed: false
  },
  {
    id: 2,
    service: services[2],
    date: '2025-01-22',
    time: '02:00 م',
    status: 'pending',
    location: 'حي الروضة، جدة',
    reviewed: false
  },
  {
    id: 3,
    service: services[1],
    date: '2024-12-15',
    time: '11:00 ص',
    status: 'confirmed',
    location: 'حي الخبر الشمالية، الدمام',
    reviewed: true
  },
  {
    id: 4,
    service: services[3],
    date: '2024-12-10',
    time: '09:00 ص',
    status: 'cancelled',
    location: 'حي المروج، الرياض',
    reviewed: false
  }
];
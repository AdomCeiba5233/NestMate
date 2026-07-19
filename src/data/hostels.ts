import { Hostel } from '../types/hostel';

/**
 * Mock seed data standing in for a real hostels/rooms API.
 * Shape mirrors what the backend is expected to return, so
 * `hostelService` can be pointed at a real endpoint later without
 * changing anything that consumes it. Names are placeholders
 * (Hostel A, Apartment A, ...) until real listings are available.
 */
export const MOCK_HOSTELS: Hostel[] = [
  {
    id: 'hostel-a',
    name: 'Hostel A',
    shortName: 'Hostel A',
    category: 'Hostels',
    location: 'Ayeduase',
    distanceNote: '10 min walk to campus',
    rating: 4.3,
    bedsAvailable: 9,
    fromPricePerYear: 3500,
    photoCount: 6,
    amenities: ['Wi-Fi', 'Security', 'Water', 'Kitchen'],
    roomTypes: [
      {
        id: '2-in-a-room',
        label: '2 in a room',
        pricePerYear: 6000,
        capacity: 2,
        bedsLeft: 1,
        studentsMatching: 6,
      },
      {
        id: '4-in-a-room',
        label: '4 in a room',
        pricePerYear: 3500,
        capacity: 4,
        bedsLeft: 8,
        studentsMatching: 21,
      },
      {
        id: '3-in-a-room',
        label: '3 in a room',
        pricePerYear: 4500,
        capacity: 3,
        bedsLeft: 0,
      },
    ],
  },
  {
    id: 'hostel-b',
    name: 'Hostel B',
    shortName: 'Hostel B',
    category: 'Hostels',
    location: 'Kotei',
    distanceNote: '15 min walk to campus',
    rating: 4.1,
    bedsAvailable: 2,
    fromPricePerYear: 4000,
    photoCount: 4,
    amenities: ['Wi-Fi', 'Water'],
    roomTypes: [
      {
        id: '2-in-a-room',
        label: '2 in a room',
        pricePerYear: 5000,
        capacity: 2,
        bedsLeft: 2,
        studentsMatching: 3,
      },
    ],
  },
  {
    id: 'apartment-a',
    name: 'Apartment A',
    shortName: 'Apartment A',
    category: 'Apartments',
    location: 'Bomso',
    distanceNote: '12 min walk to campus',
    rating: 4.6,
    bedsAvailable: 4,
    fromPricePerYear: 7000,
    photoCount: 8,
    amenities: ['Wi-Fi', 'Security', 'Water', 'Kitchen', 'Parking'],
    roomTypes: [
      {
        id: '1-in-a-room',
        label: '1 in a room',
        pricePerYear: 9000,
        capacity: 1,
        bedsLeft: 1,
        studentsMatching: 2,
      },
      {
        id: '2-in-a-room',
        label: '2 in a room',
        pricePerYear: 7000,
        capacity: 2,
        bedsLeft: 3,
        studentsMatching: 5,
      },
    ],
  },
  {
    id: 'apartment-b',
    name: 'Apartment B',
    shortName: 'Apartment B',
    category: 'Apartments',
    location: 'Ayeduase',
    distanceNote: '8 min walk to campus',
    rating: 4.4,
    bedsAvailable: 1,
    fromPricePerYear: 8000,
    photoCount: 5,
    amenities: ['Wi-Fi', 'Security'],
    roomTypes: [
      {
        id: '1-in-a-room',
        label: '1 in a room',
        pricePerYear: 8000,
        capacity: 1,
        bedsLeft: 1,
        studentsMatching: 1,
      },
    ],
  },
];

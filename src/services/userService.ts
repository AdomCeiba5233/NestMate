import { HousingStatus } from '../types/user';
import { api } from './apiClient';

/** REAL implementation - asks the backend whether the user has a confirmed bed. */

interface BackendHousing {
  hasRoom: boolean;
  hostelName?: string;
  roomNumber?: string;
  floor?: string;
}

export async function fetchHousingStatus(): Promise<HousingStatus> {
  try {
    const h = await api<BackendHousing>('/api/users/me/housing');
    return { hasRoom: h.hasRoom, hostelName: h.hostelName, roomNumber: h.roomNumber };
  } catch (e) {
    console.warn('fetchHousingStatus failed (logged in?):', e);
    return { hasRoom: false };
  }
}

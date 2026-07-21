import {
  Hostel,
  HostelCategory,
  HostelSearchFilters,
  RoomType,
  VerifyAccessCodeResult,
} from '../types/hostel';
import { api, ApiError } from './apiClient';

/**
 * REAL implementation - calls the NESTMATE Spring Boot backend.
 * Same exported signatures as the mock, so no screen changes needed.
 * NOTE: the backend requires login first; unauthenticated calls return
 * empty results here (with a console warning) instead of crashing screens.
 */

export const CURRENT_ACADEMIC_YEAR = '2026/27';
const ACCESS_CODE_LENGTH = 6;

// ---------- backend response shapes (see API.md) ----------
interface BackendHostelSummary {
  hostelId: number;
  name: string;
  area: string;
  photoUrl?: string;
  rating: number;
  kind: 'HOSTEL' | 'APARTMENT';
  fromPricePerYear: number;
  bedsAvailable: number;
}

interface BackendRoomTypeInfo {
  roomTypeId: number;
  capacity: number;
  pricePerBedPerYear: number;
  bedsAvailable: number;
}

interface BackendHostelDetail extends Omit<BackendHostelSummary, 'fromPricePerYear' | 'bedsAvailable'> {
  description?: string;
  roomTypes: BackendRoomTypeInfo[];
}

interface BackendHoldView {
  holdId: number;
  bedId: number;
  roomLabel: string;
  hostelName: string;
  amount: number;
  expiresAt: string;
  status: string;
}

// ---------- mapping backend -> frontend shapes ----------
function toCategory(kind: 'HOSTEL' | 'APARTMENT'): HostelCategory {
  return kind === 'APARTMENT' ? 'Apartments' : 'Hostels';
}

function toRoomType(rt: BackendRoomTypeInfo): RoomType {
  return {
    id: String(rt.roomTypeId),
    label: `${rt.capacity} in a room`,
    pricePerYear: rt.pricePerBedPerYear,
    capacity: rt.capacity,
    bedsLeft: rt.bedsAvailable,
  };
}

function summaryToHostel(h: BackendHostelSummary): Hostel {
  return {
    id: String(h.hostelId),
    name: h.name,
    shortName: h.name.split(' ')[0],
    category: toCategory(h.kind),
    location: h.area,
    distanceNote: h.area,
    rating: h.rating,
    bedsAvailable: h.bedsAvailable,
    fromPricePerYear: h.fromPricePerYear,
    imageUrl: h.photoUrl,
    amenities: [],
    roomTypes: [],
  };
}

function detailToHostel(h: BackendHostelDetail): Hostel {
  const roomTypes = h.roomTypes.map(toRoomType);
  const prices = roomTypes.map((rt) => rt.pricePerYear);
  return {
    id: String(h.hostelId),
    name: h.name,
    shortName: h.name.split(' ')[0],
    category: toCategory(h.kind),
    location: h.area,
    distanceNote: h.area,
    rating: h.rating,
    bedsAvailable: roomTypes.reduce((sum, rt) => sum + rt.bedsLeft, 0),
    fromPricePerYear: prices.length ? Math.min(...prices) : 0,
    imageUrl: h.photoUrl,
    amenities: [],
    roomTypes,
  };
}

// ---------- API functions (same signatures as the mock) ----------
export async function fetchHostels(filters: HostelSearchFilters = {}): Promise<Hostel[]> {
  const params = new URLSearchParams();
  if (filters.query?.trim()) params.set('search', filters.query.trim());
  if (filters.category) params.set('kind', filters.category === 'Apartments' ? 'APARTMENT' : 'HOSTEL');
  const qs = params.toString();
  try {
    const list = await api<BackendHostelSummary[]>(`/api/hostels${qs ? `?${qs}` : ''}`);
    return list.map(summaryToHostel);
  } catch (e) {
    console.warn('fetchHostels failed (are you logged in?):', e);
    return [];
  }
}

export async function fetchHostelById(hostelId: string): Promise<Hostel | null> {
  try {
    const detail = await api<BackendHostelDetail>(`/api/hostels/${hostelId}`);
    return detailToHostel(detail);
  } catch (e) {
    console.warn('fetchHostelById failed:', e);
    return null;
  }
}

/**
 * Bridge: the app verifies a code per hostel, but the backend confirms a code
 * against the user's ACTIVE HOLD. So: look up my hold, then confirm the code
 * on it. Succeeds only if the user actually holds a bed and the code is valid.
 */
export async function verifyAccessCode(
  hostelId: string,
  code: string,
): Promise<VerifyAccessCodeResult> {
  try {
    const hold = await api<BackendHoldView>('/api/holds/me');
    await api(`/api/holds/${hold.holdId}/confirm-code`, {
      method: 'POST',
      body: { code: code.trim().toUpperCase() },
    });
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) console.warn('verifyAccessCode:', e.message);
    return { success: false };
  }
}

// ---------- pure helpers (unchanged from the mock) ----------
export function getRoomType(hostel: Hostel, roomTypeId: string): RoomType | undefined {
  return hostel.roomTypes.find((roomType) => roomType.id === roomTypeId);
}

export function getPriceRange(hostel: Hostel): { min: number; max: number } {
  const prices = hostel.roomTypes.map((roomType) => roomType.pricePerYear);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getRoomTypeSummary(hostel: Hostel): string {
  return hostel.roomTypes
    .map((roomType) => roomType.label.match(/^\d+/)?.[0] ?? roomType.label)
    .join(' · ');
}

export function formatAccessCode(code: string): string {
  return code.length > 3 ? `${code.slice(0, 3)}-${code.slice(3)}` : code;
}

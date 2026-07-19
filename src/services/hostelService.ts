import { MOCK_HOSTELS } from '../data/hostels';
import { Hostel, HostelSearchFilters, RoomType, VerifyAccessCodeResult } from '../types/hostel';

const ACCESS_CODE_LENGTH = 6;

const MOCK_NETWORK_DELAY_MS = 500;

export const CURRENT_ACADEMIC_YEAR = '2026/27';

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

/**
 * Mock implementation of the hostels API. Every function is async and
 * returns plain serializable data, so swapping the body for a real
 * `fetch(...)`/API client call later doesn't require touching any callers.
 */
export async function fetchHostels(filters: HostelSearchFilters = {}): Promise<Hostel[]> {
  const { category, query } = filters;
  const normalizedQuery = query?.trim().toLowerCase();

  const results = MOCK_HOSTELS.filter((hostel) => {
    const matchesCategory = !category || hostel.category === category;
    const matchesQuery = !normalizedQuery || hostel.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return delay(results);
}

export async function fetchHostelById(hostelId: string): Promise<Hostel | null> {
  const hostel = MOCK_HOSTELS.find((item) => item.id === hostelId) ?? null;
  return delay(hostel);
}

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

export async function verifyAccessCode(
  hostelId: string,
  code: string,
): Promise<VerifyAccessCodeResult> {
  return delay({ success: Boolean(hostelId) && code.length === ACCESS_CODE_LENGTH });
}

export function formatAccessCode(code: string): string {
  return code.length > 3 ? `${code.slice(0, 3)}-${code.slice(3)}` : code;
}

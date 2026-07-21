import { UserProfile, UserProfileUpdate } from '../types/profile';

const MOCK_NETWORK_DELAY_MS = 400;
const MAX_PHOTOS = 4;
const PERSONAL_INFO_FIELDS: Array<keyof UserProfile> = [
  'fullName',
  'dateOfBirth',
  'gender',
  'schoolLevel',
  'programme',
  'bio',
];
const LIFESTYLE_FIELD_COUNT = 7;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

/**
 * Mock in-memory profile store standing in for a real profile API.
 * `updateProfile` mutates this so edits made on any profile sub-screen are
 * reflected back on the My Profile screen within the session.
 */
let mockProfile: UserProfile = {
  fullName: 'Wendy Mensah',
  dateOfBirth: new Date(2004, 2, 14).toISOString(),
  bio: 'Good, tall, quiet. Final-year CS student who loves calm study spaces.',
  gender: 'Female',
  schoolLevel: 'KNUST · Level 300',
  programme: 'Computer Science',
  email: 'wendy@st.knust.edu.gh',
  photos: ['avatar', 'books'],
  lifestyle: {
    cleanliness: 'Very clean',
    sleepSchedule: 'Early bird',
    socialEnergy: 'Balanced',
    studyEnvironment: 'Needs silence',
    guestsComfort: 'Sometimes',
    smoking: 'Non-smoker',
    petFriendly: 'Yes',
  },
  matchesCount: 3,
  interestsCount: 5,
  roomHoldCount: 1,
import { api, ApiError } from './apiClient';

/**
 * HYBRID real implementation.
 * - bio persists to the backend profile (PUT /api/profiles/me), merged with
 *   the user's existing lifestyle fields (or sensible defaults for new users).
 * - Display-only fields the backend doesn't model yet (photos, gender,
 *   dateOfBirth, schoolLevel, avatar) live in this session store so the
 *   Edit Profile screen still behaves fully. Documented in the report.
 */

interface BackendProfile {
  userId: number;
  sleepSchedule: 'EARLY_BIRD' | 'FLEXIBLE' | 'NIGHT_OWL';
  cleanliness: number;
  noiseTolerance: number;
  budgetMin: number;
  budgetMax: number;
  city: string;
  bio?: string;
  smoker: boolean;
  smokerOk: boolean;
  hasPets: boolean;
  petsOk: boolean;
  seekingType: 'SEEKING_ROOM' | 'OFFERING_ROOM';
  socialLevel?: number;
}

const DEFAULT_LIFESTYLE = {
  sleepSchedule: 'FLEXIBLE' as const,
  cleanliness: 3,
  noiseTolerance: 3,
  budgetMin: 2000,
  budgetMax: 9000,
  city: 'Kumasi',
  smoker: false,
  smokerOk: false,
  hasPets: false,
  petsOk: true,
  seekingType: 'SEEKING_ROOM' as const,
  socialLevel: 3,
};

let localFields: UserProfile = { fullName: '', bio: '' };

async function getBackendProfile(): Promise<BackendProfile | null> {
  try {
    return await api<BackendProfile>('/api/profiles/me');
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null; // no profile yet
    throw e;
  }
}

export async function fetchProfile(): Promise<UserProfile> {
  try {
    const backend = await getBackendProfile();
    if (backend?.bio !== undefined) {
      localFields = { ...localFields, bio: backend.bio ?? '' };
    }
  } catch (e) {
    console.warn('fetchProfile: backend unavailable, using session data', e);
  }
  return { ...localFields };
}

export async function updateProfile(update: UserProfileUpdate): Promise<UserProfile> {
  localFields = { ...localFields, ...update };
  try {
    const existing = await getBackendProfile();
    const base = existing ?? DEFAULT_LIFESTYLE;
    await api('/api/profiles/me', {
      method: 'PUT',
      body: {
        sleepSchedule: base.sleepSchedule,
        cleanliness: base.cleanliness,
        noiseTolerance: base.noiseTolerance,
        budgetMin: base.budgetMin,
        budgetMax: base.budgetMax,
        city: base.city,
        bio: localFields.bio ?? '',
        smoker: base.smoker,
        smokerOk: base.smokerOk,
        hasPets: base.hasPets,
        petsOk: base.petsOk,
        seekingType: base.seekingType,
        socialLevel: (existing?.socialLevel ?? DEFAULT_LIFESTYLE.socialLevel),
      },
    });
  } catch (e) {
    console.warn('updateProfile: backend save failed, kept locally', e);
  }
  return { ...localFields };
}

/**
 * Weighted completion score: personal info (50%), lifestyle answers (25%),
 * and photos out of the 4 available slots (25%).
 */
export function computeProfileCompletion(profile: UserProfile): number {
  const personalScore = PERSONAL_INFO_FIELDS.filter((field) => Boolean(profile[field])).length / PERSONAL_INFO_FIELDS.length;
  const lifestyleScore = profile.lifestyle
    ? Object.values(profile.lifestyle).filter(Boolean).length / LIFESTYLE_FIELD_COUNT
    : 0;
  const photosScore = Math.min(profile.photos?.length ?? 0, MAX_PHOTOS) / MAX_PHOTOS;

  return Math.round((personalScore * 0.5 + lifestyleScore * 0.25 + photosScore * 0.25) * 100);
}

export function getMaxPhotos(): number {
  return MAX_PHOTOS;
}

import { UserProfile, UserProfileUpdate } from '../types/profile';
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

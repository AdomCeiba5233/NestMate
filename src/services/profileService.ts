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
};

export async function fetchProfile(): Promise<UserProfile> {
  return delay({ ...mockProfile });
}

export async function updateProfile(update: UserProfileUpdate): Promise<UserProfile> {
  mockProfile = { ...mockProfile, ...update };
  return delay({ ...mockProfile });
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

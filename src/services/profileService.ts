import { UserProfile, UserProfileUpdate } from '../types/profile';

const MOCK_NETWORK_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

/**
 * Mock in-memory profile store standing in for a real profile API.
 * `updateProfile` mutates this so Edit Profile's changes are reflected
 * back on the My Profile screen within the session.
 */
let mockProfile: UserProfile = {
  fullName: '',
  bio: '',
};

export async function fetchProfile(): Promise<UserProfile> {
  return delay({ ...mockProfile });
}

export async function updateProfile(update: UserProfileUpdate): Promise<UserProfile> {
  mockProfile = { ...mockProfile, ...update };
  return delay({ ...mockProfile });
}

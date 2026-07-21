export interface LifestylePreferences {
  cleanliness?: string;
  sleepSchedule?: string;
  socialEnergy?: string;
  studyEnvironment?: string;
  guestsComfort?: string;
  smoking?: string;
  petFriendly?: string;
}

export interface UserProfile {
  fullName: string;
  dateOfBirth?: string;
  bio?: string;
  gender?: string;
  schoolLevel?: string;
  programme?: string;
  email?: string;
  avatarUri?: string;
  photos?: string[];
  lifestyle?: LifestylePreferences;
  matchesCount?: number;
  interestsCount?: number;
  roomHoldCount?: number;
}

export type UserProfileUpdate = Partial<UserProfile>;

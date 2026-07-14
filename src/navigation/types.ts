export interface OnboardingLifestyle {
  cleanliness?: string;
  organization?: string;
  choreHabits?: string;
  socialEnergy?: string;
  studyEnvironment?: string;
  sleepSchedule?: string;
  guestsComfort?: string;
  smoking?: string;
  drinking?: string;
  noiseLevel?: string;
  communication?: string;
  petFriendly?: string;
}

export interface OnboardingData {
  email: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  schoolLevel?: string;
  avatarUri?: string;
  photos?: string[];
  interests?: string[];
  lifestyle?: OnboardingLifestyle;
}

export type RootStackParamList = {
  Splash: undefined;
  GetStarted: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
  OnboardingAboutYou: { data: OnboardingData };
  OnboardingPhotos: { data: OnboardingData };
  OnboardingInterests: { data: OnboardingData };
  OnboardingLifestyle: { data: OnboardingData };
  OnboardingComplete: { data: OnboardingData };
  Home: { email: string };
};

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import AboutYouScreen from '../screens/onboarding/AboutYouScreen';
import UploadPhotosScreen from '../screens/onboarding/UploadPhotosScreen';
import InterestsScreen from '../screens/onboarding/InterestsScreen';
import LifestyleFitScreen from '../screens/onboarding/LifestyleFitScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';
import MainTabNavigator from './MainTabNavigator';
import MyHostelScreen from '../screens/MyHostelScreen';
import VerificationScreen from '../screens/VerificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="OnboardingAboutYou" component={AboutYouScreen} />
      <Stack.Screen name="OnboardingPhotos" component={UploadPhotosScreen} />
      <Stack.Screen name="OnboardingInterests" component={InterestsScreen} />
      <Stack.Screen name="OnboardingLifestyle" component={LifestyleFitScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
      <Stack.Screen name="Home" component={MainTabNavigator} />
      <Stack.Screen name="MyHostel" component={MyHostelScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

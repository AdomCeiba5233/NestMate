import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../../components/AppButton';
import RadioGroup from '../../components/RadioGroup';
import OnboardingProgressBar from '../../components/OnboardingProgressBar';
import { colors, spacing, typography } from '../../theme';
import { OnboardingLifestyle, RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingLifestyle'>;

interface QuestionConfig {
  key: keyof OnboardingLifestyle;
  label: string;
  options: string[];
}

const PAGES: QuestionConfig[][] = [
  [
    { key: 'cleanliness', label: 'Cleanliness', options: ['Very Clean', 'Clean', 'Average', 'Messy'] },
    {
      key: 'organization',
      label: 'Organization',
      options: ['Highly Organized', 'Somewhat Organized', 'Disorganized'],
    },
    { key: 'choreHabits', label: 'Chore Habits', options: ['Always', 'Sometimes', 'Never'] },
  ],
  [
    {
      key: 'socialEnergy',
      label: 'Social Energy',
      options: ['Very Social', 'Social', 'Balanced', 'Reserved', 'Very Reserved'],
    },
    {
      key: 'studyEnvironment',
      label: 'Study Environment',
      options: ['Needs Silence', 'Background Noise is Okay', 'No Preference'],
    },
    { key: 'sleepSchedule', label: 'Sleep Schedule', options: ['Early Bird', 'Night Owl', 'Flexible'] },
  ],
  [
    {
      key: 'guestsComfort',
      label: 'Guests / Visitors',
      options: ['Very Comfortable', 'Sometimes', 'Rarely', 'Not Comfortable'],
    },
    { key: 'smoking', label: 'Smoking', options: ['Smoker', 'Occasionally', 'Non-Smoker'] },
    { key: 'drinking', label: 'Drinking', options: ['Frequently', 'Socially', 'Never'] },
  ],
  [
    { key: 'noiseLevel', label: 'Noise Level', options: ['Quiet', 'Moderate', 'Loud'] },
    { key: 'communication', label: 'Communication', options: ['Very Open', 'Open', 'Prefer Private'] },
    { key: 'petFriendly', label: 'Pet Friendly', options: ['Yes', 'Maybe', 'No'] },
  ],
];

export default function LifestyleFitScreen({ navigation, route }: Props) {
  const { data } = route.params;
  const [pageIndex, setPageIndex] = useState(0);
  const [lifestyle, setLifestyle] = useState<OnboardingLifestyle>(data.lifestyle ?? {});

  const page = PAGES[pageIndex];
  const isComplete = page.every((question) => Boolean(lifestyle[question.key]));

  function handleAnswer(key: keyof OnboardingLifestyle, value: string) {
    setLifestyle((prev) => ({ ...prev, [key]: value }));
  }

  function handleBack() {
    if (pageIndex === 0) {
      navigation.goBack();
      return;
    }
    setPageIndex((prev) => prev - 1);
  }

  function handleContinue() {
    if (!isComplete) {
      return;
    }
    if (pageIndex < PAGES.length - 1) {
      setPageIndex((prev) => prev + 1);
      return;
    }
    navigation.navigate('OnboardingComplete', { data: { ...data, lifestyle } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lifestyle Fit</Text>
        </View>

        <OnboardingProgressBar totalSteps={7} currentStep={3 + pageIndex} />

        <Text style={styles.pageIndicator}>
          Page {pageIndex + 1} of {PAGES.length}
        </Text>

        {page.map((question) => (
          <RadioGroup
            key={question.key}
            label={question.label}
            options={question.options}
            value={lifestyle[question.key]}
            onChange={(value) => handleAnswer(question.key, value)}
          />
        ))}

        <View style={styles.form}>
          <AppButton
            title={pageIndex < PAGES.length - 1 ? 'Continue' : 'Finish'}
            onPress={handleContinue}
            disabled={!isComplete}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginLeft: spacing.md,
  },
  pageIndicator: {
    fontSize: typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  form: {
    width: '100%',
    marginTop: spacing.md,
  },
});

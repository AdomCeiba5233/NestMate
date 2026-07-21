import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AsyncBoundary from '../components/AsyncBoundary';
import ChipToggleGroup from '../components/ChipToggleGroup';
import ScreenHeader from '../components/ScreenHeader';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { LifestylePreferences } from '../types/profile';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchProfile, updateProfile } from '../services/profileService';

type Props = NativeStackScreenProps<RootStackParamList, 'LifestylePreferences'>;

interface QuestionConfig {
  key: keyof LifestylePreferences;
  label: string;
  options: string[];
}

const QUESTIONS: QuestionConfig[] = [
  { key: 'cleanliness', label: 'Cleanliness', options: ['Very clean', 'Clean', 'Average', 'Messy'] },
  { key: 'sleepSchedule', label: 'Sleep schedule', options: ['Early bird', 'Night owl', 'Flexible'] },
  { key: 'socialEnergy', label: 'Social energy', options: ['Very social', 'Balanced', 'Reserved'] },
  { key: 'studyEnvironment', label: 'Study environment', options: ['Needs silence', 'Background noise ok'] },
  { key: 'guestsComfort', label: 'Guests / visitors', options: ['Very comfortable', 'Sometimes', 'Rarely'] },
  { key: 'smoking', label: 'Smoking', options: ['Smoker', 'Occasionally', 'Non-smoker'] },
  { key: 'petFriendly', label: 'Pet friendly', options: ['Yes', 'Maybe', 'No'] },
];

export default function LifestylePreferencesScreen({ navigation }: Props) {
  const { data: profile, loading, error, reload } = useAsyncData(fetchProfile, []);
  const [lifestyle, setLifestyle] = useState<LifestylePreferences>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.lifestyle) {
      setLifestyle(profile.lifestyle);
    }
  }, [profile]);

  function handleAnswer(key: keyof LifestylePreferences, value: string) {
    setLifestyle((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await updateProfile({ lifestyle });
    setSaving(false);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Lifestyle preferences"
            onBack={() => navigation.goBack()}
            rightAction={{ label: saving ? 'Saving…' : 'Save', onPress: handleSave }}
          />

          {QUESTIONS.map((question) => (
            <ChipToggleGroup
              key={question.key}
              label={question.label}
              options={question.options}
              value={lifestyle[question.key]}
              onChange={(value) => handleAnswer(question.key, value)}
            />
          ))}

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              These answers power your compatibility score — keeping them honest gets you better matches.
            </Text>
          </View>
        </ScrollView>
      </AsyncBoundary>
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
  noteBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  noteText: {
    fontSize: typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
});

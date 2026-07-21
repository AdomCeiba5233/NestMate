import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppTextInput from '../components/AppTextInput';
import AsyncBoundary from '../components/AsyncBoundary';
import DateOfBirthField from '../components/DateOfBirthField';
import ScreenHeader from '../components/ScreenHeader';
import SelectField from '../components/SelectField';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchProfile, updateProfile } from '../services/profileService';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalInfo'>;

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const SCHOOL_LEVEL_OPTIONS = ['KNUST · Level 100', 'KNUST · Level 200', 'KNUST · Level 300', 'KNUST · Level 400'];

export default function PersonalInfoScreen({ navigation }: Props) {
  const { data: profile, loading, error, reload } = useAsyncData(fetchProfile, []);

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [schoolLevel, setSchoolLevel] = useState<string | undefined>();
  const [programme, setProgramme] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setDateOfBirth(profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined);
      setGender(profile.gender);
      setSchoolLevel(profile.schoolLevel);
      setProgramme(profile.programme ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirth?.toISOString(),
      gender,
      schoolLevel,
      programme: programme.trim(),
      bio: bio.trim(),
    });
    setSaving(false);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AsyncBoundary loading={loading} error={error} onRetry={reload}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <ScreenHeader
              title="Personal info"
              onBack={() => navigation.goBack()}
              rightAction={{ label: saving ? 'Saving…' : 'Save', onPress: handleSave }}
            />

            <AppTextInput
              label="Full Name"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              rightAccessory={<Ionicons name="pencil" size={16} color={colors.textMuted} />}
            />

            <DateOfBirthField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              maximumDate={new Date()}
            />

            <SelectField
              label="Gender"
              placeholder="Gender"
              value={gender}
              options={GENDER_OPTIONS}
              onChange={setGender}
            />

            <SelectField
              label="School / Level"
              placeholder="School / Level"
              value={schoolLevel}
              options={SCHOOL_LEVEL_OPTIONS}
              onChange={setSchoolLevel}
            />

            <AppTextInput
              label="Programme"
              placeholder="Programme"
              value={programme}
              onChangeText={setProgramme}
              autoCapitalize="words"
              rightAccessory={<Ionicons name="pencil" size={16} color={colors.textMuted} />}
            />

            <AppTextInput
              label="Email"
              value={profile?.email ?? ''}
              editable={false}
              rightAccessory={<Ionicons name="lock-closed" size={16} color={colors.accent} />}
            />
            <Text style={styles.helperText}>Email is verified and can't be changed here.</Text>

            <View style={styles.bioSpacing}>
              <AppTextInput
                label="Short Bio"
                placeholder="Tell future roommates about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                style={styles.bioInput}
              />
            </View>
          </ScrollView>
        </AsyncBoundary>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  bioSpacing: {
    marginTop: spacing.xs,
  },
  bioInput: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingVertical: spacing.sm,
  },
});

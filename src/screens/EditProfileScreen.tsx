import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppTextInput from '../components/AppTextInput';
import AsyncBoundary from '../components/AsyncBoundary';
import DateOfBirthField from '../components/DateOfBirthField';
import IconCircle from '../components/IconCircle';
import ScreenHeader from '../components/ScreenHeader';
import SelectField from '../components/SelectField';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchProfile, updateProfile } from '../services/profileService';
import { isWithinWordLimit } from '../utils/limitWords';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const SCHOOL_LEVEL_OPTIONS = ['Undergraduate', 'Graduate', 'PhD', 'Not a student'];
const BIO_WORD_LIMIT = 3;

export default function EditProfileScreen({ navigation }: Props) {
  const { data: profile, loading, error, reload } = useAsyncData(fetchProfile, []);

  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<string | undefined>();
  const [schoolLevel, setSchoolLevel] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvatarUri(profile.avatarUri);
      setFullName(profile.fullName);
      setDateOfBirth(profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined);
      setBio(profile.bio ?? '');
      setGender(profile.gender);
      setSchoolLevel(profile.schoolLevel);
    }
  }, [profile]);

  function handleBioChange(text: string) {
    if (isWithinWordLimit(text, BIO_WORD_LIMIT)) {
      setBio(text);
    }
  }

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    setSaving(true);
    await updateProfile({
      avatarUri,
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirth?.toISOString(),
      bio: bio.trim(),
      gender,
      schoolLevel,
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
              title="Edit Profile"
              onBack={() => navigation.goBack()}
              rightAction={{ label: saving ? 'Saving…' : 'Save', onPress: handleSave }}
            />

            <TouchableOpacity style={styles.avatarTouchable} onPress={handlePickAvatar} activeOpacity={0.8}>
              <IconCircle size={88}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="camera" size={28} color={colors.textMuted} />
                )}
              </IconCircle>
            </TouchableOpacity>

            <View style={styles.form}>
              <AppTextInput
                label="Full Name"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <DateOfBirthField
                label="Date of Birth"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                maximumDate={new Date()}
              />

              <AppTextInput
                label="Describe Yourself in 3 Words"
                placeholder="e.g. Chill, Tidy, Friendly"
                value={bio}
                onChangeText={handleBioChange}
                autoCapitalize="words"
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
  avatarTouchable: {
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
  },
});

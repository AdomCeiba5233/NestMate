import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import SelectField from '../../components/SelectField';
import OnboardingProgressBar from '../../components/OnboardingProgressBar';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingAboutYou'>;

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const SCHOOL_LEVEL_OPTIONS = ['Undergraduate', 'Graduate', 'PhD', 'Not a student'];

interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  schoolLevel?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AboutYouScreen({ navigation, route }: Props) {
  const { data } = route.params;
  const [avatarUri, setAvatarUri] = useState<string | undefined>(data.avatarUri);
  const [fullName, setFullName] = useState(data.fullName ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(data.gender);
  const [schoolLevel, setSchoolLevel] = useState(data.schoolLevel);
  const [errors, setErrors] = useState<FormErrors>({});

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

  function handleDateChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selected) {
      setDateOfBirth(selected);
    }
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }
    if (!dateOfBirth) {
      nextErrors.dateOfBirth = 'Date of birth is required.';
    }
    if (!gender) {
      nextErrors.gender = 'Please select a gender.';
    }
    if (!schoolLevel) {
      nextErrors.schoolLevel = 'Please select your school / level.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleContinue() {
    if (!validate() || !dateOfBirth) {
      return;
    }
    navigation.navigate('OnboardingPhotos', {
      data: {
        ...data,
        avatarUri,
        fullName: fullName.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        schoolLevel,
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tell Me About Yourself</Text>
          </View>

          <OnboardingProgressBar totalSteps={7} currentStep={0} />

          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="camera" size={28} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <AppTextInput
              label="Full Name"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              autoCapitalize="words"
            />

            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={[styles.dateRow, errors.dateOfBirth ? styles.dateRowError : null]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Text style={dateOfBirth ? styles.dateValue : styles.datePlaceholder}>
                  {dateOfBirth ? formatDate(dateOfBirth) : 'Date of Birth'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>

            {showDatePicker && Platform.OS === 'android' ? (
              <DateTimePicker
                value={dateOfBirth ?? new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            ) : null}

            {Platform.OS === 'ios' ? (
              <Modal visible={showDatePicker} transparent animationType="slide">
                <Pressable style={styles.pickerOverlay} onPress={() => setShowDatePicker(false)}>
                  <Pressable style={styles.pickerSheet}>
                    <DateTimePicker
                      value={dateOfBirth ?? new Date(2000, 0, 1)}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      onChange={handleDateChange}
                    />
                    <AppButton title="Done" onPress={() => setShowDatePicker(false)} />
                  </Pressable>
                </Pressable>
              </Modal>
            ) : null}

            <SelectField
              label="Gender"
              placeholder="Gender"
              value={gender}
              options={GENDER_OPTIONS}
              onChange={setGender}
              error={errors.gender}
            />

            <SelectField
              label="School / Level"
              placeholder="School / Level"
              value={schoolLevel}
              options={SCHOOL_LEVEL_OPTIONS}
              onChange={setSchoolLevel}
              error={errors.schoolLevel}
            />

            <AppButton title="Continue" onPress={handleContinue} />
          </View>
        </ScrollView>
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
    flexShrink: 1,
  },
  avatarWrapper: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
  },
  dateField: {
    marginBottom: spacing.md,
  },
  dateLabel: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  dateRowError: {
    borderColor: colors.error,
  },
  dateValue: {
    fontSize: typography.body,
    color: colors.text,
  },
  datePlaceholder: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.caption,
    color: colors.error,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
});

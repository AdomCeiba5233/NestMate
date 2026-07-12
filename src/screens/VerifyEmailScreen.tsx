import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function handleChangeDigit(text: string, index: number) {
    const char = text.slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) {
    if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleResend() {
    if (cooldown > 0) {
      return;
    }
    setDigits(Array(CODE_LENGTH).fill(''));
    setError(undefined);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    inputRefs.current[0]?.focus();
  }

  async function handleVerify() {
    const code = digits.join('');

    if (code.length < CODE_LENGTH) {
      setError('Enter the full 6-digit code.');
      return;
    }
    setError(undefined);

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to{'\n'}{email}</Text>

          <View style={styles.codeRow}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}
                value={digit}
                onChangeText={(text) => handleChangeDigit(text, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.resendRow}
            onPress={handleResend}
            disabled={cooldown > 0}
          >
            <Text style={styles.resendText}>
              Didn&apos;t receive code?{' '}
              <Text style={cooldown > 0 ? styles.resendMuted : styles.resendLink}>
                {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend'}
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.form}>
            <AppButton title="Verify" onPress={handleVerify} loading={loading} />
          </View>

          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerLinkText}>Change Email</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  codeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  codeBox: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    fontSize: typography.h2,
    color: colors.text,
  },
  codeBoxFilled: {
    borderColor: colors.primary,
  },
  formError: {
    color: colors.error,
    fontSize: typography.caption,
    marginBottom: spacing.md,
  },
  resendRow: {
    marginBottom: spacing.xl,
  },
  resendText: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  resendMuted: {
    color: colors.textMuted,
    fontWeight: typography.weightMedium,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: typography.weightBold,
  },
  form: {
    width: '100%',
  },
  footerLink: {
    marginTop: spacing.lg,
  },
  footerLinkText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightBold,
  },
});

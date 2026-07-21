import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AsyncBoundary from '../components/AsyncBoundary';
import ElevatedCard from '../components/ElevatedCard';
import GradientHeader from '../components/GradientHeader';
import HeaderIconRow from '../components/HeaderIconRow';
import IconCircle from '../components/IconCircle';
import ListRow from '../components/ListRow';
import { colors, spacing, typography } from '../theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useDrawer } from '../context/DrawerContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { computeProfileCompletion, fetchProfile, getMaxPhotos } from '../services/profileService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const { openDrawer } = useDrawer();
  const { data: profile, loading, error, reload } = useAsyncData(fetchProfile, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const maxPhotos = getMaxPhotos();
  const photoCount = profile?.photos?.length ?? 0;
  const missingPhotos = maxPhotos - photoCount;
  const completion = profile ? computeProfileCompletion(profile) : 0;
  const initial = profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientHeader>
        <HeaderIconRow
          onMenuPress={openDrawer}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />
        <Text style={styles.header}>Profile</Text>
      </GradientHeader>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AsyncBoundary loading={loading} error={error} onRetry={reload}>
          {profile ? (
            <>
              <ElevatedCard style={styles.identityCard}>
                <IconCircle size={72} backgroundColor={colors.primaryLight}>
                  <Text style={styles.avatarInitial}>{initial}</Text>
                </IconCircle>
                <Text style={styles.name}>{profile.fullName || 'Add your name'}</Text>
                {profile.schoolLevel ? <Text style={styles.subtitle}>{profile.schoolLevel}</Text> : null}

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${completion}%` }]} />
                </View>
                <View style={styles.progressLabelRow}>
                  {missingPhotos > 0 ? (
                    <Text style={styles.progressHint}>
                      Add {missingPhotos} photo{missingPhotos === 1 ? '' : 's'} to complete your profile
                    </Text>
                  ) : (
                    <Text style={styles.progressHint}>Your profile is complete</Text>
                  )}
                  <Text style={styles.progressPercent}>{completion}%</Text>
                </View>
              </ElevatedCard>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{profile.matchesCount ?? 0}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{profile.interestsCount ?? 0}</Text>
                  <Text style={styles.statLabel}>Interests</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{profile.roomHoldCount ?? 0}</Text>
                  <Text style={styles.statLabel}>Room hold</Text>
                </View>
              </View>

              <ElevatedCard style={styles.listCard}>
                <ListRow
                  label="Personal info"
                  description="Name, birthday, school"
                  icon="person-outline"
                  onPress={() => navigation.navigate('PersonalInfo')}
                />
                <ListRow
                  label="Lifestyle preferences"
                  description="Cleanliness, sleep, guests"
                  icon="options-outline"
                  onPress={() => navigation.navigate('LifestylePreferences')}
                />
                <ListRow
                  label="Photos"
                  description={`${photoCount} of ${maxPhotos} added`}
                  icon="images-outline"
                  onPress={() => navigation.navigate('Photos')}
                />
                <ListRow
                  label="Account settings"
                  description="Email, password, log out"
                  icon="settings-outline"
                  isLast
                  onPress={() => navigation.navigate('Settings')}
                />
              </ElevatedCard>
            </>
          ) : null}
        </AsyncBoundary>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceTint,
  },
  header: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  identityCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  name: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.sm,
  },
  progressHint: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  progressPercent: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
  },
  statValue: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  listCard: {
    padding: spacing.md,
  },
});

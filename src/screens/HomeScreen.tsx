import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import ElevatedCard from '../components/ElevatedCard';
import GradientHeader from '../components/GradientHeader';
import HeaderIconRow from '../components/HeaderIconRow';
import IconCircle from '../components/IconCircle';
import { colors, spacing, typography } from '../theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchHousingStatus } from '../services/userService';
import { useDrawer } from '../context/DrawerContext';
import { displayNameFor } from '../utils/formatName';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation, route }: Props) {
  const { email, name } = route.params;
  const firstName = displayNameFor(email, name);
  const { data: housingStatus, loading } = useAsyncData(fetchHousingStatus, []);
  const { openDrawer } = useDrawer();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GradientHeader>
          <HeaderIconRow
            onMenuPress={openDrawer}
            onNotificationsPress={() => navigation.navigate('Notifications')}
          />
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.subtitle}>Where will you live this year?</Text>
        </GradientHeader>

        <View style={styles.content}>
          <ElevatedCard style={styles.exploreCard}>
            <IconCircle size={56} backgroundColor={colors.primaryLight}>
              <Ionicons name="compass-outline" size={28} color={colors.primary} />
            </IconCircle>
            <Text style={styles.exploreCardTitle}>Explore hostels & apartments</Text>
            <View style={styles.exploreButton}>
              <AppButton title="Start exploring" onPress={() => navigation.navigate('Explore')} />
            </View>
          </ElevatedCard>

          <Text style={styles.sectionTitle}>Your status</Text>
          <ElevatedCard style={styles.statusCard}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.statusRow}>
                <IconCircle size={40} backgroundColor={colors.primaryLight}>
                  <Ionicons name="bed-outline" size={20} color={colors.primary} />
                </IconCircle>
                <Text style={styles.statusText}>
                  {housingStatus?.hasRoom
                    ? `Room ${housingStatus.roomNumber} at ${housingStatus.hostelName}`
                    : 'No room yet — explore to get started'}
                </Text>
              </View>
            )}
          </ElevatedCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceTint,
  },
  scrollContent: {
    flexGrow: 1,
  },
  greeting: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  exploreCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  exploreCardTitle: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusCard: {
    padding: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textMuted,
  },
});

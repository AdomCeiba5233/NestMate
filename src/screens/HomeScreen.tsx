import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ElevatedCard from '../components/ElevatedCard';
import GradientHeader from '../components/GradientHeader';
import HeaderIconRow from '../components/HeaderIconRow';
import IconCircle from '../components/IconCircle';
import SearchInput from '../components/SearchInput';
import { colors, spacing, typography } from '../theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchHousingStatus } from '../services/userService';
import { fetchHostels } from '../services/hostelService';
import { fetchMatches } from '../services/matchService';
import { useDrawer } from '../context/DrawerContext';
import { displayNameFor } from '../utils/formatName';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface QuickAction {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

function initialsFor(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export default function HomeScreen({ navigation, route }: Props) {
  const { email, name } = route.params;
  const firstName = displayNameFor(email, name);
  const { data: housingStatus } = useAsyncData(fetchHousingStatus, []);
  const { data: hostels } = useAsyncData(fetchHostels, []);
  const { data: matches } = useAsyncData(fetchMatches, []);
  const { openDrawer } = useDrawer();

  const nearbyHostelCount = hostels?.length ?? 0;
  const fromPrice = hostels?.length
    ? Math.min(...hostels.map((hostel) => hostel.fromPricePerYear))
    : undefined;

  const quickActions: QuickAction[] = [
    {
      key: 'explore',
      label: 'Explore',
      icon: 'compass-outline',
      onPress: () => navigation.navigate('Explore'),
    },
    {
      key: 'matches',
      label: 'Matches',
      icon: 'people-outline',
      onPress: () => navigation.navigate('Matches'),
    },
    {
      key: 'invites',
      label: 'Invites',
      icon: 'ticket-outline',
      onPress: () => navigation.navigate('Placeholder', { title: 'Invites' }),
    },
  ];

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

          <TouchableOpacity
            style={styles.searchWrapper}
            onPress={() => navigation.navigate('Explore')}
            activeOpacity={0.8}
          >
            <SearchInput value="" onChangeText={() => undefined} placeholder="Search hostels, areas, budget…" />
          </TouchableOpacity>
        </GradientHeader>

        <View style={styles.content}>
          <View style={styles.quickActionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.quickAction}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <IconCircle size={44} backgroundColor={colors.primaryLight}>
                  <Ionicons name={action.icon} size={20} color={colors.primary} />
                </IconCircle>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Top matches for you</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Matches')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.matchesRow}>
            {(matches ?? []).slice(0, 3).map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <IconCircle size={48} backgroundColor={colors.primaryLight}>
                  <Text style={styles.matchInitial}>{initialsFor(match.name)}</Text>
                </IconCircle>
                <Text style={styles.matchName} numberOfLines={1}>
                  {match.name}
                </Text>
                <Text style={styles.matchPercent}>{match.matchPercent}% match</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your room</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.sectionLink}>Browse</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Explore')}>
            <ElevatedCard style={styles.roomCard}>
              <View style={styles.roomRow}>
                <IconCircle size={40} backgroundColor={colors.primaryLight}>
                  <Ionicons name="bed-outline" size={20} color={colors.primary} />
                </IconCircle>
                <View style={styles.roomText}>
                  {housingStatus?.hasRoom ? (
                    <Text style={styles.roomTitle}>
                      Room {housingStatus.roomNumber} at {housingStatus.hostelName}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.roomTitle}>No room yet</Text>
                      {fromPrice !== undefined ? (
                        <Text style={styles.roomSubtitle}>
                          {nearbyHostelCount} hostels near KNUST from GH₵{fromPrice.toLocaleString()}/yr
                        </Text>
                      ) : null}
                    </>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </ElevatedCard>
          </TouchableOpacity>
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
    marginBottom: spacing.md,
  },
  searchWrapper: {
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionLabel: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  sectionLink: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  matchesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  matchCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  matchInitial: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  matchName: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  matchPercent: {
    fontSize: 11,
    color: colors.success,
    fontWeight: typography.weightMedium,
  },
  roomCard: {
    padding: spacing.md,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  roomText: {
    flex: 1,
  },
  roomTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  roomSubtitle: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

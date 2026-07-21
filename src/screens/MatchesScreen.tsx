import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AsyncBoundary from '../components/AsyncBoundary';
import Badge from '../components/Badge';
import ElevatedCard from '../components/ElevatedCard';
import EmptyState from '../components/EmptyState';
import GradientHeader from '../components/GradientHeader';
import HeaderIconRow from '../components/HeaderIconRow';
import IconCircle from '../components/IconCircle';
import { colors, spacing, typography } from '../theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useDrawer } from '../context/DrawerContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchMatches } from '../services/matchService';
import { MatchProfile } from '../types/match';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Matches'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FILTERS = ['All', 'Level 300', 'Quiet', 'Early bird'];

function initialsFor(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function matchTone(matchPercent: number): 'success' | 'warning' | 'neutral' {
  if (matchPercent >= 85) {
    return 'success';
  }
  if (matchPercent >= 75) {
    return 'warning';
  }
  return 'neutral';
}

function matchesFilter(match: MatchProfile, filter: string): boolean {
  if (filter === 'All') {
    return true;
  }
  const haystack = [match.level, ...match.tags].map((value) => value.toLowerCase());
  return haystack.some((value) => value.includes(filter.toLowerCase()));
}

export default function MatchesScreen({ navigation }: Props) {
  const { openDrawer } = useDrawer();
  const { data: matches, loading, error, reload } = useAsyncData(fetchMatches, []);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMatches = useMemo(
    () => (matches ?? []).filter((match) => matchesFilter(match, activeFilter)),
    [matches, activeFilter],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientHeader>
        <HeaderIconRow
          onMenuPress={openDrawer}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />
        <Text style={styles.header}>Matches</Text>
        <Text style={styles.subtitle}>{(matches ?? []).length} roommates fit your vibe</Text>
      </GradientHeader>

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {FILTERS.map((filter) => {
              const active = filter === activeFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredMatches.length === 0 ? (
            <EmptyState
              icon="heart-outline"
              title="No matches yet"
              description="Explore rooms and we'll surface roommates who fit your vibe."
            />
          ) : (
            filteredMatches.map((match) => (
              <ElevatedCard key={match.id} style={styles.matchCard}>
                <View style={styles.matchHeaderRow}>
                  <IconCircle size={48} backgroundColor={colors.primaryLight}>
                    <Text style={styles.avatarInitial}>{initialsFor(match.name)}</Text>
                  </IconCircle>
                  <View style={styles.matchHeaderText}>
                    <Text style={styles.matchName}>{match.name}</Text>
                    <Text style={styles.matchMeta}>
                      {match.level} · {match.program}
                    </Text>
                  </View>
                  <Badge label={`${match.matchPercent}%`} tone={matchTone(match.matchPercent)} />
                </View>

                <View style={styles.tagsRow}>
                  {match.tags.map((tag) => (
                    <Badge key={tag} label={tag} tone="neutral" />
                  ))}
                </View>

                <View style={styles.actionsRow}>
                  <View style={styles.actionButton}>
                    <AppButton
                      title="View profile"
                      variant="outline"
                      onPress={() =>
                        navigation.navigate('Placeholder', { title: `${match.name}'s profile` })
                      }
                    />
                  </View>
                  <View style={styles.actionButton}>
                    <AppButton title="Message" onPress={() => navigation.navigate('Home', { screen: 'Chat' } as never)} />
                  </View>
                </View>
              </ElevatedCard>
            ))
          )}
        </ScrollView>
      </AsyncBoundary>
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
  subtitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.textMuted,
  },
  filterTextActive: {
    color: colors.white,
  },
  matchCard: {
    marginBottom: spacing.md,
  },
  matchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  matchHeaderText: {
    flex: 1,
  },
  matchName: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  matchMeta: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

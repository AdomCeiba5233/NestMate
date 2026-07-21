import React, { useMemo } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AsyncBoundary from '../components/AsyncBoundary';
import EmptyState from '../components/EmptyState';
import GradientHeader from '../components/GradientHeader';
import HeaderIconRow from '../components/HeaderIconRow';
import IconCircle from '../components/IconCircle';
import { colors, spacing, typography } from '../theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useDrawer } from '../context/DrawerContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchConversations } from '../services/chatService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Chat'>,
  NativeStackScreenProps<RootStackParamList>
>;

function initialsFor(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export default function ChatScreen({ navigation }: Props) {
  const { openDrawer } = useDrawer();
  const { data: conversations, loading, error, reload } = useAsyncData(fetchConversations, []);

  const unreadTotal = useMemo(
    () => (conversations ?? []).reduce((total, conversation) => total + conversation.unreadCount, 0),
    [conversations],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientHeader>
        <HeaderIconRow
          onMenuPress={openDrawer}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />
        <Text style={styles.header}>Chat</Text>
        <Text style={styles.subtitle}>{unreadTotal} unread messages</Text>
      </GradientHeader>

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        {conversations && conversations.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.row}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Placeholder', {
                    title: conversation.name,
                    description: 'Full conversation view is coming soon.',
                  })
                }
              >
                <IconCircle size={44} backgroundColor={colors.primaryLight}>
                  <Text style={styles.avatarInitial}>{initialsFor(conversation.name)}</Text>
                </IconCircle>
                <View style={styles.rowText}>
                  <View style={styles.rowTopLine}>
                    <Text style={styles.name}>{conversation.name}</Text>
                    <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                  </View>
                  <Text
                    style={[styles.preview, conversation.unreadCount > 0 && styles.previewUnread]}
                    numberOfLines={1}
                  >
                    {conversation.isOwnLastMessage ? `You: ${conversation.lastMessage}` : conversation.lastMessage}
                  </Text>
                </View>
                {conversation.unreadCount > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{conversation.unreadCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}

            <View style={styles.promoBox}>
              <Text style={styles.promoText}>✨ Match with more roommates to start new conversations.</Text>
            </View>
          </ScrollView>
        ) : (
          <EmptyState
            icon="chatbubble-outline"
            title="No conversations yet"
            description="Once you match with a roommate, you'll be able to chat here."
          />
        )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarInitial: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  rowText: {
    flex: 1,
  },
  rowTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  timestamp: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  preview: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: typography.weightMedium,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.white,
  },
  promoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  promoText: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
});

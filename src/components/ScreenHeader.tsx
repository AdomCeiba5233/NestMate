import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';

interface ScreenHeaderRightAction {
  label: string;
  onPress: () => void;
}

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ScreenHeaderRightAction;
}

export default function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  if (!onBack) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, styles.titleWithBack]}>{title}</Text>
      {rightAction ? (
        <TouchableOpacity onPress={rightAction.onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.rightActionText}>{rightAction.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  titleWithBack: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rightActionText: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
});

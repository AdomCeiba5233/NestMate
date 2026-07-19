import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { colors, shadows, spacing } from '../theme';

interface SelectableCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function SelectableCard({
  children,
  onPress,
  selected = false,
  disabled = false,
  style,
}: SelectableCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected, disabled && styles.cardDisabled, style]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  },
  cardDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});

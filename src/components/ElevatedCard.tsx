import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, shadows, spacing } from '../theme';

interface ElevatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ElevatedCard({ children, style }: ElevatedCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.md,
  },
});

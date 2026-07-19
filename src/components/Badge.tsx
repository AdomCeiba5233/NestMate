import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../theme';

type BadgeTone = 'success' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const TONE_STYLES: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  success: { backgroundColor: '#E3F5EE', color: '#2A9D8F' },
  warning: { backgroundColor: '#FCEEDC', color: '#B8722A' },
  neutral: { backgroundColor: '#EEEDEB', color: '#6B6A66' },
};

export default function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text style={[styles.text, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
  },
});

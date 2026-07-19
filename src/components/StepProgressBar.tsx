import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';

interface StepProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export default function StepProgressBar({ totalSteps, currentStep }: StepProgressBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={[styles.bar, index === currentStep && styles.barActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  barActive: {
    backgroundColor: colors.text,
  },
});

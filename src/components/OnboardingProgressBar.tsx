import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

interface OnboardingProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export default function OnboardingProgressBar({
  totalSteps,
  currentStep,
}: OnboardingProgressBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <View style={[styles.dot, index <= currentStep && styles.dotActive]} />
          {index < totalSteps - 1 ? (
            <View style={[styles.line, index < currentStep && styles.lineActive]} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: colors.border,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
});

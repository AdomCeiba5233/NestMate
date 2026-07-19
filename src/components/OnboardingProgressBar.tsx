import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, moderateScale } from '../theme';

interface OnboardingProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

const DOT_SIZE = moderateScale(10, 0.3);
const LINE_WIDTH = moderateScale(24, 0.3);

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
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  line: {
    width: LINE_WIDTH,
    height: 2,
    backgroundColor: colors.border,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
});

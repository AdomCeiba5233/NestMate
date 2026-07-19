import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { colors, moderateScale } from '../theme';

interface IconCircleProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  square?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function IconCircle({
  children,
  size = 88,
  backgroundColor = colors.surface,
  square = false,
  style,
}: IconCircleProps) {
  const scaledSize = moderateScale(size, 0.3);

  return (
    <View
      style={[
        {
          width: scaledSize,
          height: scaledSize,
          borderRadius: square ? scaledSize * 0.27 : scaledSize / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

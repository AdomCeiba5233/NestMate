import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';

interface ListRowProps {
  label: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  description?: string;
  destructive?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
}

export default function ListRow({
  label,
  onPress,
  icon,
  description,
  destructive = false,
  showChevron = true,
  isLast = false,
}: ListRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowDivider]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? (
        <Ionicons name={icon} size={20} color={destructive ? colors.error : colors.textMuted} />
      ) : null}
      <View style={styles.textGroup}>
        <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {showChevron && !destructive ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: typography.body,
    color: colors.text,
  },
  description: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  labelDestructive: {
    color: colors.error,
    fontWeight: typography.weightBold,
  },
});

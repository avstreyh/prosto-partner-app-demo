import React from 'react';
import { TouchableOpacity, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  dark?: boolean;
  badge?: boolean;
  style?: ViewStyle;
}

export default function IconButton({
  onPress,
  children,
  dark = false,
  badge = false,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.base, dark && styles.dark, style]}
    >
      {children}
      {badge && <View style={styles.badge} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.16)',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.late,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

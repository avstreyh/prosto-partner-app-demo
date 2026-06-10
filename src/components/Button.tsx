import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, radius } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'glass';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const btnStyle = styles[variant];
  const textStyle = textStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[styles.base, btnStyle, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.ink : '#fff'} />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.label, textStyle]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primary: { backgroundColor: colors.ink },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line2,
  },
  ghost: { backgroundColor: 'transparent', height: 48 },
  danger: { backgroundColor: colors.late },
  accent: { backgroundColor: colors.accent },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  disabled: { opacity: 0.45 },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.2,
  },
});

const textStyles = StyleSheet.create({
  primary: { color: '#fff' },
  secondary: { color: colors.ink },
  ghost: { color: colors.ink2 },
  danger: { color: '#fff' },
  accent: { color: '#fff' },
  glass: { color: '#fff' },
});

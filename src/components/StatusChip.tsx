import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/colors';
import type { BookingStatus } from '../types';

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Подтверждена',
  in_progress: 'В работе',
  done: 'Завершено',
  cancelled: 'Отменено',
};

const STATUS_COLORS: Record<BookingStatus, { text: string; bg: string }> = {
  pending: { text: colors.confirm, bg: colors.confirmBg },
  in_progress: { text: colors.work, bg: colors.workBg },
  done: { text: colors.done, bg: colors.doneBg },
  cancelled: { text: colors.wait, bg: colors.waitBg },
};

interface StatusChipProps {
  status: BookingStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const { text, bg } = STATUS_COLORS[status];
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Text style={[styles.label, { color: text }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});

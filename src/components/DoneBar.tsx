import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { colors, fonts } from '../theme/colors';
import type { Booking } from '../types';
import TimelineItem from './TimelineItem';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface DoneBarProps {
  bookings: Booking[];
  onBookingPress: (id: string) => void;
}

export default function DoneBar({ bookings, onBookingPress }: DoneBarProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View>
      <TouchableOpacity style={styles.bar} onPress={toggle} activeOpacity={0.8}>
        <View style={styles.label}>
          <View style={styles.doneIcon}>
            <Text style={styles.check}>✓</Text>
          </View>
          <Text style={styles.labelText}>Уже сделано</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{bookings.length}</Text>
          </View>
        </View>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>›</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.list}>
          {bookings.map((b, i) => (
            <TimelineItem
              key={b.id}
              booking={b}
              isLast={i === bookings.length - 1}
              onPress={() => onBookingPress(b.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doneIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.doneBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: colors.done,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  labelText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
  },
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: colors.doneBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.done,
  },
  chevron: {
    color: colors.ink3,
    fontSize: 22,
    transform: [{ rotate: '90deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '-90deg' }],
  },
  list: {
    marginTop: 8,
  },
});

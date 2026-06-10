import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme/colors';
import type { Booking, BookingStatus } from '../types';
import StatusChip from './StatusChip';

const NODE_COLORS: Record<BookingStatus, string> = {
  pending: colors.confirm,
  in_progress: colors.work,
  done: colors.done,
  cancelled: colors.wait,
};

interface TimelineItemProps {
  booking: Booking;
  isLast?: boolean;
  onPress: () => void;
}

export default function TimelineItem({ booking, isLast = false, onPress }: TimelineItemProps) {
  const nodeColor = NODE_COLORS[booking.status];

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.time}>{booking.time}</Text>

      <View style={styles.rail}>
        <View style={[styles.node, { backgroundColor: nodeColor, shadowColor: nodeColor }]} />
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={[styles.card, booking.status === 'in_progress' && styles.cardActive]}>
        <View style={styles.cardInner}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {booking.clientName}
            </Text>
            <Text style={styles.cardSub} numberOfLines={1}>
              {booking.car.make} {booking.car.model} · {booking.service}
            </Text>
          </View>
          <StatusChip status={booking.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  time: {
    width: 46,
    textAlign: 'right',
    paddingTop: 14,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink2,
    flexShrink: 0,
  },
  rail: {
    width: 14,
    flexShrink: 0,
    alignItems: 'center',
    paddingTop: 16,
  },
  node: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: colors.bg,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
    flexShrink: 0,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.line,
    marginTop: 4,
    marginBottom: -8,
  },
  card: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  cardActive: {
    borderColor: 'transparent',
    shadowColor: colors.ink,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 2,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: -0.1,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
    marginTop: 2,
  },
});

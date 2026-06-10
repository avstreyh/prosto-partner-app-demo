import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, shadow } from '../theme/colors';
import type { Booking, NowBlockState } from '../types';
import StatusChip from './StatusChip';
import PlateLabel from './PlateLabel';
import Button from './Button';

interface NowBlockProps {
  state: NowBlockState;
  booking: Booking | null;
  groupBookings?: Booking[];
  onScanPress: () => void;
  onBookingPress: (id: string) => void;
}

export default function NowBlock({
  state,
  booking,
  groupBookings = [],
  onScanPress,
  onBookingPress,
}: NowBlockProps) {
  if (state === 'hidden') {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyEmoji}>☕</Text>
        </View>
        <Text style={styles.emptyTitle}>Нет активных записей</Text>
        <Text style={styles.emptyBody}>Свободное окно. Следующая запись появится здесь.</Text>
      </View>
    );
  }

  if (state === 'group' && groupBookings.length > 0) {
    return (
      <View style={[styles.card, shadow.cardLg]}>
        <View style={styles.top}>
          <Text style={styles.postLabel}>Сейчас · группа</Text>
        </View>
        <View style={styles.groupList}>
          {groupBookings.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.groupItem}
              onPress={() => onBookingPress(b.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.groupTime}>{b.time}</Text>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{b.clientName}</Text>
                <Text style={styles.groupCar}>
                  {b.car.make} {b.car.model}
                </Text>
              </View>
              <StatusChip status={b.status} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.cta}>
          <Button label="Сканировать QR" onPress={onScanPress} variant="primary" />
        </View>
      </View>
    );
  }

  if (!booking) return null;

  const isLate = state === 'late';
  const isInWork = state === 'inwork';
  const timeEnd = getEndTime(booking.time, booking.duration);

  return (
    <View style={[styles.card, shadow.cardLg, isLate && styles.cardLate]}>
      <View style={styles.top}>
        <Text style={styles.postLabel}>Сейчас</Text>
        <StatusChip status={isLate ? 'pending' : isInWork ? 'in_progress' : booking.status} />
      </View>

      <View style={styles.body}>
        <View style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {booking.clientName}
          </Text>
          <Text style={styles.serviceName} numberOfLines={1}>
            {booking.service}
          </Text>
          <View style={styles.meta}>
            <PlateLabel plate={booking.car.plate} />
            <Text style={styles.carLabel}>
              {booking.car.make} {booking.car.model}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.when}>
        <Text style={styles.whenBig}>
          {booking.time} — {timeEnd}
        </Text>
        {isLate && <Text style={styles.lateText}>Опаздывает</Text>}
      </View>

      {isInWork && (
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: '45%' }]} />
        </View>
      )}

      <View style={styles.cta}>
        {isInWork ? (
          <Button label="Открыть запись" onPress={() => onBookingPress(booking.id)} variant="secondary" />
        ) : (
          <Button
            label={isLate ? 'Связаться с клиентом' : 'Подтвердить клиента'}
            onPress={isLate ? () => onBookingPress(booking.id) : onScanPress}
            variant={isLate ? 'danger' : 'primary'}
          />
        )}
      </View>
    </View>
  );
}

function getEndTime(start: string, duration: number): string {
  const [h, m] = start.split(':').map(Number);
  const totalMin = h * 60 + m + duration;
  const eh = Math.floor(totalMin / 60) % 24;
  const em = totalMin % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  empty: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.line2,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyEmoji: { fontSize: 22 },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 4,
  },
  emptyBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink3,
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
  },
  cardLate: {
    shadowColor: colors.late,
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  postLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  thumb: {
    width: 64,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.bg2,
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 19,
    letterSpacing: -0.4,
    color: colors.ink,
    lineHeight: 22,
  },
  serviceName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink2,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 7,
    flexWrap: 'wrap',
  },
  carLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
  },
  when: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  whenBig: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  lateText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.late,
  },
  progressWrap: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.workBg,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.work,
  },
  cta: { marginTop: 16 },

  // group
  groupList: { gap: 8 },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 11,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  groupTime: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    width: 42,
  },
  groupInfo: { flex: 1 },
  groupName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  groupCar: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink2, marginTop: 1 },
});

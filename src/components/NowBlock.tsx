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
  nextBooking?: Booking | null;
  postNumber?: number;
  onScanPress: () => void;
  onBookingPress: (id: string) => void;
}

const DOT_COLOR: Record<NowBlockState, string> = {
  hidden: colors.ink3,
  waiting: colors.wait,
  inslot: colors.accent,
  late: colors.late,
  inwork: colors.work,
  group: colors.accent,
};

function StateDot({ state }: { state: NowBlockState }) {
  return <View style={[styles.dot, { backgroundColor: DOT_COLOR[state] }]} />;
}

function getRemainingMinutes(startTime: string, duration: number): number {
  const [h, m] = startTime.split(':').map(Number);
  const endMinutes = h * 60 + m + duration;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return Math.max(0, endMinutes - nowMinutes);
}

function getEndTime(start: string, duration: number): string {
  const [h, m] = start.split(':').map(Number);
  const totalMin = h * 60 + m + duration;
  const eh = Math.floor(totalMin / 60) % 24;
  const em = totalMin % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

export default function NowBlock({
  state,
  booking,
  groupBookings = [],
  nextBooking,
  postNumber,
  onScanPress,
  onBookingPress,
}: NowBlockProps) {
  const postLabel = postNumber != null ? `Пост ${postNumber}` : null;

  if (state === 'hidden') {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Сейчас записей нет</Text>
        {nextBooking ? (
          <Text style={styles.emptyBody}>
            Ближайшая — в {nextBooking.time}, клиент {nextBooking.clientName}
          </Text>
        ) : (
          <Text style={styles.emptyBody}>Записей на сегодня больше нет</Text>
        )}
      </View>
    );
  }

  if (state === 'waiting' && nextBooking) {
    const [h, m] = nextBooking.time.split(':').map(Number);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = h * 60 + m;
    const minsUntil = Math.max(0, startMin - nowMin);

    return (
      <View style={[styles.card, shadow.cardLg]}>
        <View style={styles.top}>
          <View style={styles.stateRow}>
            <StateDot state="waiting" />
            <Text style={styles.stateLabel}>Следующая</Text>
          </View>
          <Text style={styles.stateExtra}>через {minsUntil} мин</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.name}>{nextBooking.clientName}</Text>
            <Text style={styles.serviceName}>{nextBooking.service}</Text>
            <View style={styles.meta}>
              <PlateLabel plate={nextBooking.car.plate} />
              <Text style={styles.carLabel}>{nextBooking.car.make} {nextBooking.car.model}</Text>
            </View>
          </View>
        </View>
        <View style={styles.when}>
          <Text style={styles.whenBig}>Начало в {nextBooking.time}{postLabel ? ` · ${postLabel}` : ''}</Text>
        </View>
        <View style={styles.cta}>
          <Button label="Открыть запись" onPress={() => onBookingPress(nextBooking.id)} variant="secondary" />
        </View>
      </View>
    );
  }

  if (state === 'group' && groupBookings.length > 0) {
    return (
      <View style={[styles.card, shadow.cardLg]}>
        <View style={styles.top}>
          <View style={styles.stateRow}>
            <StateDot state="group" />
            <Text style={styles.stateLabel}>Сейчас</Text>
            {postLabel && <Text style={styles.postLabel}>{postLabel}</Text>}
          </View>
        </View>
        <Text style={styles.groupHint}>Выберите клиента, которого подтверждаете:</Text>
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
                <Text style={styles.groupCar}>{b.car.make} {b.car.model}</Text>
              </View>
              <StatusChip status={b.status} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.cta}>
          <Button label="Подтвердить клиента" onPress={onScanPress} variant="primary" />
        </View>
      </View>
    );
  }

  if (!booking) return null;

  const isLate = state === 'late';
  const isInWork = state === 'inwork';
  const timeEnd = getEndTime(booking.time, booking.duration);
  const remaining = isInWork ? getRemainingMinutes(booking.time, booking.duration) : 0;

  return (
    <View style={[styles.card, shadow.cardLg, isLate && styles.cardLate]}>
      <View style={styles.top}>
        <View style={styles.stateRow}>
          <StateDot state={state} />
          <Text style={styles.stateLabel}>
            {isInWork ? 'В работе' : isLate ? 'Опаздывает' : 'Сейчас'}
          </Text>
          {isInWork && remaining > 0 && (
            <Text style={styles.stateExtra}>осталось ~{remaining} мин</Text>
          )}
          {isLate && <Text style={[styles.stateExtra, styles.lateExtra]}>опоздание</Text>}
        </View>
        {postLabel && <Text style={styles.postLabel}>{postLabel}</Text>}
      </View>

      <View style={styles.body}>
        <View style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{booking.clientName}</Text>
          <Text style={styles.serviceName} numberOfLines={1}>{booking.service}</Text>
          <View style={styles.meta}>
            <PlateLabel plate={booking.car.plate} />
            <Text style={styles.carLabel}>{booking.car.make} {booking.car.model}</Text>
          </View>
        </View>
      </View>

      <View style={styles.when}>
        <Text style={styles.whenBig}>{booking.time} — {timeEnd}</Text>
      </View>

      {isInWork && (
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${Math.min(95, Math.max(5, 100 - (remaining / booking.duration) * 100))}%` }]} />
        </View>
      )}

      <View style={styles.cta}>
        {isInWork ? (
          <Button label="Открыть запись" onPress={() => onBookingPress(booking.id)} variant="secondary" />
        ) : (
          <Button
            label={isLate ? 'Позвонить клиенту' : 'Подтвердить клиента'}
            onPress={isLate ? () => onBookingPress(booking.id) : onScanPress}
            variant={isLate ? 'danger' : 'primary'}
          />
        )}
      </View>
    </View>
  );
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
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 6,
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
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  stateLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink2,
  },
  stateExtra: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink3,
  },
  lateExtra: { color: colors.late },
  postLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink3,
    flexShrink: 0,
  },

  groupHint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink2,
    marginBottom: 12,
  },
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
  info: { flex: 1 },
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
});

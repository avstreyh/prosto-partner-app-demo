import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';
import { colors, fonts, shadow } from '../theme/colors';
import { useAppContext } from '../store/AppProvider';
import StatusChip from '../components/StatusChip';
import PlateLabel from '../components/PlateLabel';
import Button from '../components/Button';
import type { BookingStatus } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'AppointmentCard'>;

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  pending: 'in_progress',
  in_progress: 'done',
};

const STATUS_CTA: Partial<Record<BookingStatus, string>> = {
  pending: 'Начать работу',
  in_progress: 'Завершить',
};

export default function AppointmentCardScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { journal, setBookingStatus } = useAppContext();
  const booking = journal.bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.notFound}>Запись не найдена</Text>
      </SafeAreaView>
    );
  }

  const nextStatus = NEXT_STATUS[booking.status];
  const ctaLabel = STATUS_CTA[booking.status];

  const totalPrice = booking.price;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Запись</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo placeholder */}
        <View style={styles.heroPhoto}>
          <PlateLabel plate={booking.car.plate} />
        </View>

        {/* Status + chip */}
        <View style={styles.statusRow}>
          <StatusChip status={booking.status} />
          <Text style={styles.bookingTime}>{booking.time}</Text>
        </View>

        {/* Main card */}
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Клиент</Text>
          <DetailRow label="Имя" value={booking.clientName} />
          <DetailRow label="Телефон" value={booking.clientPhone} hasAction />
          <Text style={[styles.sectionTitle, styles.sectionTitleGap]}>Автомобиль</Text>
          <DetailRow label="Марка / модель" value={`${booking.car.make} ${booking.car.model}`} />
          <DetailRow label="Цвет" value={booking.car.color} />
          <DetailRow
            label="Гос. номер"
            value={booking.car.plate}
            renderValue={() => <PlateLabel plate={booking.car.plate} />}
          />
        </View>

        {/* Services card */}
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Услуги</Text>
          <View style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{booking.service}</Text>
              <Text style={styles.serviceDur}>{booking.duration} мин</Text>
            </View>
            <Text style={styles.servicePrice}>{booking.price.toLocaleString('ru-RU')} ₽</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого</Text>
            <Text style={styles.totalValue}>{totalPrice.toLocaleString('ru-RU')} ₽</Text>
          </View>
        </View>

        {/* Notes */}
        {booking.notes ? (
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.sectionTitle}>Комментарий</Text>
            <View style={styles.comment}>
              <Text style={styles.commentText}>{booking.notes}</Text>
            </View>
          </View>
        ) : null}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA bar */}
      <View style={styles.ctaBar}>
        <Button
          label="Сканировать QR"
          onPress={() => navigation.navigate('Scanner')}
          variant="secondary"
          style={styles.ctaSecondary}
        />
        {nextStatus && ctaLabel && (
          <Button
            label={ctaLabel}
            onPress={() => setBookingStatus(bookingId, nextStatus)}
            variant="primary"
            style={styles.ctaPrimary}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  hasAction,
  renderValue,
}: {
  label: string;
  value: string;
  hasAction?: boolean;
  renderValue?: () => React.ReactNode;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {renderValue ? renderValue() : (
        <Text style={[styles.detailValue, hasAction && styles.detailLink]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  notFound: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 100,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 56,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: colors.ink },
  topTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.2,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },

  heroPhoto: {
    height: 170,
    borderRadius: 24,
    backgroundColor: colors.bg2,
    marginBottom: 16,
    justifyContent: 'flex-end',
    padding: 14,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookingTime: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink2,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionTitleGap: { marginTop: 16 },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink2,
  },
  detailValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
  },
  detailLink: { color: colors.confirm },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  serviceInfo: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  serviceName: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  serviceDur: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink3 },
  servicePrice: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  totalLabel: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.ink },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.5,
  },

  comment: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    padding: 14,
  },
  commentText: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    color: colors.ink2,
    lineHeight: 21,
  },

  ctaBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 14,
    backgroundColor: colors.bg,
  },
  ctaSecondary: { flex: 1 },
  ctaPrimary: { flex: 1.4 },
});

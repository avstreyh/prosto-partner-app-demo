import React, { useState, useMemo } from 'react';
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
import { colors, fonts } from '../theme/colors';
import { useAppContext } from '../store/AppProvider';
import Avatar from '../components/Avatar';
import NowBlock from '../components/NowBlock';
import TimelineItem from '../components/TimelineItem';
import DoneBar from '../components/DoneBar';
import SearchBottomSheet from '../components/SearchBottomSheet';
import type { NowBlockState } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Journal'>;

const TODAY = new Date().toISOString().split('T')[0];

function getNowBlockState(
  nowBookingId: string | null,
  bookings: ReturnType<typeof useAppContext>['journal']['bookings']
): NowBlockState {
  if (!nowBookingId) return 'hidden';
  const b = bookings.find((x) => x.id === nowBookingId);
  if (!b) return 'hidden';
  if (b.status === 'in_progress') return 'inwork';
  if (b.status === 'pending') return 'inslot';
  return 'hidden';
}

export default function JournalScreen({ navigation }: Props) {
  const { journal, auth } = useAppContext();
  const { bookings, nowBookingId } = journal;
  const partner = auth.partner;
  if (!partner) return null;

  const [searchOpen, setSearchOpen] = useState(false);

  const todayBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.date === TODAY)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings]
  );

  const doneBookings = todayBookings.filter((b) => b.status === 'done');
  const upcomingBookings = todayBookings.filter((b) => b.status !== 'done');

  const nowBooking = nowBookingId ? bookings.find((b) => b.id === nowBookingId) ?? null : null;
  const nowState = getNowBlockState(nowBookingId, bookings);

  // first upcoming booking that isn't the nowBooking
  const nextBooking = upcomingBookings.find((b) => b.id !== nowBookingId) ?? upcomingBookings[0] ?? null;

  const openBooking = (id: string) => navigation.navigate('AppointmentCard', { bookingId: id });
  const openScanner = () => navigation.navigate('Scanner');

  const dateLabel = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateMain}>Сегодня</Text>
          <Text style={styles.dateSub}>{dateLabel}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchBtn} onPress={() => setSearchOpen(true)}>
            <Text style={styles.searchIcon}>⌕</Text>
          </TouchableOpacity>
          <Avatar name={partner.name} size={44} onPress={() => navigation.navigate('Profile')} />
        </View>
      </View>

      {/* Main scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NowBlock */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Сейчас</Text>
          <NowBlock
            state={nowState}
            booking={nowBooking}
            nextBooking={nextBooking}
            postNumber={partner.postNumber}
            onScanPress={openScanner}
            onBookingPress={openBooking}
          />
        </View>

        {/* Done bookings */}
        {doneBookings.length > 0 && (
          <View style={styles.section}>
            <DoneBar bookings={doneBookings} onBookingPress={openBooking} />
          </View>
        )}

        {/* Upcoming timeline */}
        {upcomingBookings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Дальше сегодня · {upcomingBookings.length}{' '}
              {upcomingBookings.length === 1 ? 'запись' : upcomingBookings.length < 5 ? 'записи' : 'записей'}
            </Text>
            <View style={styles.timeline}>
              {upcomingBookings.map((b, i) => (
                <TimelineItem
                  key={b.id}
                  booking={b}
                  isLast={i === upcomingBookings.length - 1}
                  onPress={() => openBooking(b.id)}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB — QR scan */}
      <TouchableOpacity style={styles.fab} onPress={openScanner} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>⊡</Text>
        <Text style={styles.fabLabel}>QR</Text>
      </TouchableOpacity>

      {/* Search sheet */}
      <SearchBottomSheet
        visible={searchOpen}
        bookings={bookings}
        onClose={() => setSearchOpen(false)}
        onSelect={openBooking}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dateMain: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  dateSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
    marginTop: 1,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { fontSize: 20, color: colors.ink2 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  timeline: { gap: 0 },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabIcon: { fontSize: 20, color: '#fff' },
  fabLabel: { fontFamily: fonts.bold, fontSize: 11, color: '#fff', letterSpacing: 0.5 },
});

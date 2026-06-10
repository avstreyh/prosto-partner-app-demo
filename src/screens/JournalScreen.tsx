import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
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

const DAYS_COUNT = 14;

function buildDays(around: string): { date: string; label: string; dayNum: string }[] {
  const base = new Date(around);
  const result = [];
  for (let i = -3; i < DAYS_COUNT - 3; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const day = d.toLocaleDateString('ru-RU', { weekday: 'short' });
    const num = String(d.getDate()).padStart(2, '0');
    result.push({ date: iso, label: day, dayNum: num });
  }
  return result;
}

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
  const { journal, setDate, auth, setBookingStatus } = useAppContext();
  const { bookings, selectedDate, nowBookingId } = journal;
  const partner = auth.partner;
  if (!partner) return null;

  const [searchOpen, setSearchOpen] = useState(false);

  const days = useMemo(() => buildDays(TODAY), []);

  const todayBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings, selectedDate]
  );

  const doneBookings = todayBookings.filter((b) => b.status === 'done');
  const upcomingBookings = todayBookings.filter((b) => b.status !== 'done');

  const nowBooking = nowBookingId ? bookings.find((b) => b.id === nowBookingId) ?? null : null;
  const nowState = getNowBlockState(nowBookingId, bookings);

  const openBooking = (id: string) => navigation.navigate('AppointmentCard', { bookingId: id });
  const openScanner = () => navigation.navigate('Scanner');

  const selectedDay = days.find((d) => d.date === selectedDate);
  const dateLabel = selectedDate === TODAY
    ? 'Сегодня'
    : new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateMain}>{dateLabel}</Text>
          <Text style={styles.dateSub}>
            {upcomingBookings.length} запис{upcomingBookings.length === 1 ? 'ь' : 'и'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchBtn} onPress={() => setSearchOpen(true)}>
            <Text style={styles.searchIcon}>⌕</Text>
          </TouchableOpacity>
          <Avatar name={partner.name} size={44} onPress={() => navigation.navigate('Profile')} />
        </View>
      </View>

      {/* Date strip */}
      <View style={styles.stripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.strip}
        >
          {days.map((d) => {
            const isSelected = d.date === selectedDate;
            const isToday = d.date === TODAY;
            const hasBookings = bookings.some((b) => b.date === d.date);
            return (
              <TouchableOpacity
                key={d.date}
                style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                onPress={() => setDate(d.date)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {isToday ? 'сег' : d.label}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>{d.dayNum}</Text>
                {hasBookings && (
                  <View style={[styles.dayDot, isSelected && styles.dayDotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NowBlock — only on today */}
        {selectedDate === TODAY && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Сейчас</Text>
            <NowBlock
              state={nowState}
              booking={nowBooking}
              onScanPress={openScanner}
              onBookingPress={openBooking}
            />
          </View>
        )}

        {/* Done bookings */}
        {doneBookings.length > 0 && (
          <View style={styles.section}>
            <DoneBar bookings={doneBookings} onBookingPress={openBooking} />
          </View>
        )}

        {/* Upcoming timeline */}
        {upcomingBookings.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Расписание</Text>
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
        ) : (
          selectedDate !== TODAY && (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>Нет записей на этот день</Text>
            </View>
          )
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB — QR */}
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

  stripWrap: { marginBottom: 4 },
  strip: { paddingHorizontal: 16, gap: 6 },
  dayBtn: {
    width: 52,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    gap: 2,
  },
  dayBtnSelected: { backgroundColor: colors.ink },
  dayLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.ink3,
    textTransform: 'uppercase',
  },
  dayLabelSelected: { color: 'rgba(255,255,255,0.6)' },
  dayNum: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  dayNumSelected: { color: '#fff' },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.ink3,
    marginTop: 2,
  },
  dayDotSelected: { backgroundColor: 'rgba(255,255,255,0.5)' },

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

  emptyDay: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyDayText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink3,
  },

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
    gap: 0,
  },
  fabIcon: { fontSize: 20, color: '#fff' },
  fabLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.5,
  },
});

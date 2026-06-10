import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';
import { useAppContext } from '../store/AppProvider';
import type { Transaction } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Settlements'>;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

export default function SettlementsScreen({ navigation }: Props) {
  const { auth, transactions } = useAppContext();
  const partner = auth.partner!;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Взаиморасчёты</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Balance hero */}
        <LinearGradient
          colors={['#262a52', '#3b4188']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroLabel}>К ВЫПЛАТЕ</Text>
          <Text style={styles.heroSum}>
            {partner.balance.toLocaleString('ru-RU')} ₽
          </Text>
          <View style={styles.heroNext}>
            <Text style={styles.heroNextIcon}>📅</Text>
            <Text style={styles.heroNextText}>
              Ближайшая выплата{' '}
              {new Date(partner.nextPayoutDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
              })}
              {' · '}
              {partner.nextPayoutAmount.toLocaleString('ru-RU')} ₽
            </Text>
          </View>
        </LinearGradient>

        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>История</Text>
        </View>

        <View style={styles.transCard}>
          {transactions.map((t, i) => (
            <TransactionRow key={t.id} tx={t} isLast={i === transactions.length - 1} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionRow({ tx, isLast }: { tx: Transaction; isLast: boolean }) {
  const isCredit = tx.type === 'credit';
  return (
    <View style={[styles.txRow, isLast && styles.txRowLast]}>
      <View style={[styles.txIcon, isCredit ? styles.txIconCredit : styles.txIconDebit]}>
        <Text style={styles.txIconEmoji}>{isCredit ? '↑' : '↓'}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc}>{tx.description}</Text>
        <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
      </View>
      <Text style={[styles.txAmount, isCredit ? styles.txCredit : styles.txDebit]}>
        {isCredit ? '+' : ''}
        {tx.amount.toLocaleString('ru-RU')} ₽
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  },

  content: { paddingHorizontal: 20 },

  hero: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#3b4188',
    shadowOpacity: 0.5,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.7)',
  },
  heroSum: {
    fontFamily: fonts.bold,
    fontSize: 42,
    letterSpacing: -1.5,
    color: '#fff',
    marginTop: 6,
  },
  heroNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.16)',
  },
  heroNextIcon: { fontSize: 14 },
  heroNextText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },

  sectionHeader: { marginBottom: 10 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginLeft: 4,
  },

  transCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#231e18',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  txRowLast: { borderBottomWidth: 0 },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txIconCredit: { backgroundColor: colors.doneBg },
  txIconDebit: { backgroundColor: colors.bg2 },
  txIconEmoji: { fontSize: 18 },
  txInfo: { flex: 1 },
  txDesc: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
  },
  txDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  txCredit: { color: colors.done },
  txDebit: { color: colors.ink },
});

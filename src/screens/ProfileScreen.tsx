import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';
import { colors, fonts, shadow } from '../theme/colors';
import { useAppContext } from '../store/AppProvider';
import Avatar from '../components/Avatar';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { auth, logout } = useAppContext();
  const partner = auth.partner!;
  const [notificationsOn, setNotificationsOn] = useState(true);

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
        <Text style={styles.topTitle}>Профиль</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHead}>
          <Avatar name={partner.name} size={64} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{partner.name}</Text>
            <Text style={styles.profileRole}>{partner.washName}</Text>
          </View>
        </View>

        {/* Main list */}
        <View style={[styles.listCard, shadow.card]}>
          <ListRow
            icon="💳"
            label="Взаиморасчёты"
            value={`${partner.balance.toLocaleString('ru-RU')} ₽`}
            onPress={() => navigation.navigate('Settlements')}
          />
          <ListRow
            icon="📱"
            label="Телефон"
            value={partner.phone}
          />
          <ListRowToggle
            icon="🔔"
            label="Уведомления"
            value={notificationsOn}
            onToggle={() => setNotificationsOn((v) => !v)}
          />
          <ListRow icon="❓" label="Помощь" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>

        <Text style={styles.version}>проСТО Партнёр · v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ListRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
    >
      <View style={styles.rowIcon}>
        <Text style={styles.rowEmoji}>{icon}</Text>
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && <Text style={styles.rowChevron}>›</Text>}
    </TouchableOpacity>
  );
}

function ListRowToggle({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: string;
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowEmoji}>{icon}</Text>
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleOn]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleKnob, value && styles.toggleKnobOn]} />
      </TouchableOpacity>
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

  profileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: fonts.bold,
    fontSize: 21,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  profileRole: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink2,
    marginTop: 3,
  },

  listCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowEmoji: { fontSize: 18 },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
  },
  rowValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink2,
  },
  rowChevron: {
    fontSize: 22,
    color: colors.ink3,
  },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.line2,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: colors.ink },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleKnobOn: { alignSelf: 'flex-end' },

  logoutBtn: {
    marginHorizontal: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.lateBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  logoutText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.late,
  },
  version: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink3,
    textAlign: 'center',
    marginBottom: 32,
  },
});

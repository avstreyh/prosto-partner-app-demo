import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';
import Button from '../components/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'Permissions'>;

const PERMS = [
  {
    icon: '📷',
    title: 'Камера',
    desc: 'Для сканирования QR-кода клиента при подтверждении визита.',
  },
  {
    icon: '🔔',
    title: 'Уведомления',
    desc: 'Чтобы сообщать о новых записях и изменениях в расписании.',
  },
];

export default function PermissionsScreen({ navigation }: Props) {
  const handleAllow = () => {
    navigation.replace('AuthPhone');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.eyebrow}>Разрешения</Text>
          <Text style={styles.title}>Нужен доступ к{'\n'}нескольким функциям</Text>
          <Text style={styles.sub}>
            Приложению нужны разрешения для корректной работы.
          </Text>
        </View>

        <View style={styles.cards}>
          {PERMS.map((p) => (
            <View key={p.title} style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>{p.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.cardDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Разрешить и продолжить" onPress={handleAllow} variant="primary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  top: { marginBottom: 32 },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink3,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 30,
    letterSpacing: -0.8,
    color: colors.ink,
    lineHeight: 34,
    marginBottom: 10,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink2,
    lineHeight: 22,
  },
  cards: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardEmoji: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
  },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.ink2,
    marginTop: 3,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});

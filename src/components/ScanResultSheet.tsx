import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, fonts } from '../theme/colors';
import type { Booking } from '../types';
import Button from './Button';
import PlateLabel from './PlateLabel';

export type ScanVariant = 'ok' | 'a' | 'b' | 'c';

const VARIANT_CONFIG: Record<
  ScanVariant,
  { title: string; body: string; icon: string; iconBg: string; iconColor: string }
> = {
  ok: {
    title: 'Клиент подтверждён',
    body: 'Запись переведена в статус «В работе».',
    icon: '✓',
    iconBg: colors.doneBg,
    iconColor: colors.done,
  },
  a: {
    title: 'Не ваш клиент',
    body: 'Этот QR принадлежит другой мойке. Свяжитесь с клиентом.',
    icon: '!',
    iconBg: colors.lateBg,
    iconColor: colors.late,
  },
  b: {
    title: 'Запись не найдена',
    body: 'QR не распознан. Найдите запись вручную через поиск.',
    icon: '?',
    iconBg: colors.confirmBg,
    iconColor: colors.confirm,
  },
  c: {
    title: 'Не удалось считать',
    body: 'Попробуйте поднести QR ближе или улучшить освещение.',
    icon: '↺',
    iconBg: colors.waitBg,
    iconColor: colors.wait,
  },
};

interface ScanResultSheetProps {
  visible: boolean;
  variant: ScanVariant;
  booking: Booking | null;
  onClose: () => void;
  onOpenBooking: () => void;
  onSearch: () => void;
  onRetry: () => void;
}

export default function ScanResultSheet({
  visible,
  variant,
  booking,
  onClose,
  onOpenBooking,
  onSearch,
  onRetry,
}: ScanResultSheetProps) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      mountedRef.current = true;
      setRendered(true);
      setCountdown(5);
      slideAnim.setValue(400);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();

      if (variant === 'ok') {
        timerRef.current = setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              clearInterval(timerRef.current!);
              onClose();
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      }
    } else if (mountedRef.current) {
      clearInterval(timerRef.current!);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 400, duration: 220, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          mountedRef.current = false;
          setRendered(false);
        }
      });
    }
    return () => clearInterval(timerRef.current!);
  }, [visible, variant]);

  if (!rendered) return null;

  const cfg = VARIANT_CONFIG[variant];

  return (
    <Animated.View style={[styles.scrim, { opacity: fadeAnim }]}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.grab} />

        <View style={[styles.icon, { backgroundColor: cfg.iconBg }]}>
          <Text style={[styles.iconText, { color: cfg.iconColor }]}>{cfg.icon}</Text>
        </View>

        <Text style={styles.title}>{cfg.title}</Text>
        <Text style={styles.body}>{cfg.body}</Text>

        {variant === 'ok' && booking && (
          <View style={styles.resultCard}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{booking.clientName}</Text>
              <Text style={styles.resultService}>{booking.service}</Text>
            </View>
            <PlateLabel plate={booking.car.plate} />
          </View>
        )}

        <View style={styles.actions}>
          {variant === 'ok' && (
            <>
              <Button label="Открыть запись" onPress={onOpenBooking} variant="primary" />
              {countdown > 0 && (
                <Text style={styles.countdown}>Закрыть автоматически через {countdown} с</Text>
              )}
            </>
          )}
          {variant === 'a' && (
            <>
              <Button label="Связаться с клиентом" onPress={onClose} variant="danger" />
              <Button label="Закрыть" onPress={onClose} variant="ghost" />
            </>
          )}
          {variant === 'b' && (
            <>
              <Button label="Найти запись вручную" onPress={onSearch} variant="primary" />
              <Button label="Закрыть" onPress={onClose} variant="ghost" />
            </>
          )}
          {variant === 'c' && (
            <>
              <Button label="Сканировать снова" onPress={onRetry} variant="primary" />
              <Button label="Закрыть" onPress={onClose} variant="ghost" />
            </>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,13,11,0.55)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 14,
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  grab: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
    fontFamily: fonts.bold,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 23,
    letterSpacing: -0.4,
    color: colors.ink,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink2,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 300,
    alignSelf: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.bg,
    marginTop: 18,
    marginBottom: 4,
  },
  resultInfo: { flex: 1 },
  resultName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
  },
  resultService: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
    marginTop: 2,
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
  countdown: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 14,
  },
});

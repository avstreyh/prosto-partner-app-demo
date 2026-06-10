import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';
import { useAppContext } from '../store/AppProvider';
import ScanResultSheet, { type ScanVariant } from '../components/ScanResultSheet';

type Props = NativeStackScreenProps<MainStackParamList, 'Scanner'>;

const WINDOW_SIZE = 236;

export default function ScannerScreen({ navigation }: Props) {
  const { journal, setBookingStatus } = useAppContext();

  const [scanning, setScanning] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [resultVariant, setResultVariant] = useState<ScanVariant>('ok');
  const [scannedBookingId, setScannedBookingId] = useState<string | null>(null);

  // scan line animation
  const scanAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, WINDOW_SIZE - 20],
  });

  const handleSimulate = () => {
    if (scanning || resultVisible) return;
    setScanning(true);

    setTimeout(() => {
      const booking = journal.bookings.find((b) => b.id === 'b3') ?? null;
      if (booking) {
        setScannedBookingId(booking.id);
        setBookingStatus(booking.id, 'in_progress');
        setResultVariant('ok');
      } else {
        setResultVariant('b');
      }
      setScanning(false);
      setResultVisible(true);
    }, 1200);
  };

  const handleClose = () => navigation.goBack();

  const handleRetry = () => {
    setResultVisible(false);
    setScannedBookingId(null);
  };

  const handleOpenBooking = () => {
    navigation.goBack();
    if (scannedBookingId) {
      setTimeout(() => {
        navigation.navigate('AppointmentCard', { bookingId: scannedBookingId });
      }, 80);
    }
  };

  const handleSearch = () => navigation.goBack();

  return (
    <View style={styles.dark}>
      {/* Fake camera background */}
      <View style={styles.fakeCam} />

      {/* Top bar */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <Text style={styles.topTitle}>Сканировать QR</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.75}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Scan stage */}
      <View style={styles.stage}>
        <View style={styles.scanWindow}>
          {/* Corner markers */}
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />

          {/* Scan line (hidden while scanning) */}
          {!scanning && !resultVisible && (
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
            />
          )}

          {/* Scanning state */}
          {scanning && (
            <View style={styles.scanningOverlay}>
              <SpinnerView />
              <Text style={styles.scanningText}>Обрабатываем...</Text>
            </View>
          )}
        </View>

        <Text style={styles.hint}>
          {scanning
            ? ' '
            : 'Наведите камеру на QR-код\nклиента из приложения проСТО'}
        </Text>
      </View>

      {/* Bottom action */}
      {!resultVisible && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.glassBtn, scanning && styles.glassBtnDisabled]}
            onPress={handleSimulate}
            activeOpacity={0.8}
            disabled={scanning}
          >
            <Text style={styles.glassBtnIcon}>⊡</Text>
            <Text style={styles.glassBtnText}>Имитировать сканирование</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result sheet */}
      <ScanResultSheet
        visible={resultVisible}
        variant={resultVariant}
        booking={
          scannedBookingId
            ? journal.bookings.find((b) => b.id === scannedBookingId) ?? null
            : null
        }
        onClose={handleClose}
        onOpenBooking={handleOpenBooking}
        onSearch={handleSearch}
        onRetry={handleRetry}
      />
    </View>
  );
}

function SpinnerView() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 800, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
  );
}

const CORNER_SIZE = 40;

const styles = StyleSheet.create({
  dark: { flex: 1, backgroundColor: colors.dark },

  fakeCam: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1815',
    opacity: 0.95,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 3,
  },
  topTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#fff',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { fontSize: 16, color: '#fff' },

  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    zIndex: 2,
  },
  scanWindow: {
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    position: 'relative',
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cTL: {
    top: -3,
    left: -3,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
    borderColor: colors.scan,
  },
  cTR: {
    top: -3,
    right: -3,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
    borderColor: colors.scan,
  },
  cBL: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
    borderColor: colors.scan,
  },
  cBR: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
    borderColor: colors.scan,
  },
  scanLine: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.scan,
    shadowColor: colors.scan,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    gap: 12,
  },
  scanningText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  spinner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.18)',
    borderTopColor: colors.scan,
  },
  hint: {
    marginTop: 30,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 52,
    zIndex: 2,
  },
  glassBtn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  glassBtnDisabled: { opacity: 0.4 },
  glassBtnIcon: { fontSize: 18, color: '#fff' },
  glassBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#fff',
  },
});

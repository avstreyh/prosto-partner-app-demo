import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Permissions'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <View style={styles.logoBox}>
          <Text style={styles.logoMark}>пр</Text>
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.wordmark}>проСТО</Text>
        <Text style={styles.sub}>для партнёров</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoMark: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: '#fff',
    letterSpacing: -1,
  },
  logoDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.scan,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 38,
    letterSpacing: -1.5,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink3,
    marginTop: 6,
  },
});

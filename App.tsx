import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import * as SplashScreenNative from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Onest_400Regular,
  Onest_500Medium,
  Onest_600SemiBold,
  Onest_700Bold,
} from '@expo-google-fonts/onest';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/store/AppProvider';
import RootNavigator from './src/navigation/RootNavigator';

SplashScreenNative.preventAutoHideAsync();

const isWeb = Platform.OS === 'web';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const app = (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        {isWeb ? (
          <View style={styles.webBg}>
            <View style={styles.phoneFrame}>{app}</View>
          </View>
        ) : (
          app
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  webBg: {
    flex: 1,
    backgroundColor: '#d9d6ce',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 390,
    height: 844,
    overflow: 'hidden',
    borderRadius: 44,
    // @ts-ignore — web-only shadow
    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
    backgroundColor: '#f4f2ec',
  },
});

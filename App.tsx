import React, { useEffect, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet, Text, ScrollView } from 'react-native';
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

interface ErrorBoundaryState {
  error: Error | null;
  componentStack: string | null;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, componentStack: null };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] caught:', error);
    console.error('[ErrorBoundary] componentStack:', info.componentStack);
    this.setState({ error, componentStack: info.componentStack ?? null });
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  render() {
    const { error, componentStack } = this.state;
    if (error) {
      return (
        <ScrollView style={eb.scroll} contentContainerStyle={eb.container}>
          <Text style={eb.title}>Runtime Error</Text>
          <Text style={eb.label}>Message:</Text>
          <Text style={eb.code}>{error.message}</Text>
          <Text style={eb.label}>Stack:</Text>
          <Text style={eb.code}>{error.stack ?? '(no stack)'}</Text>
          <Text style={eb.label}>Component stack:</Text>
          <Text style={eb.code}>{componentStack ?? '(none)'}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const eb = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { padding: 16 },
  title: { color: '#ff4444', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  label: { color: '#aaaaaa', fontSize: 12, marginTop: 10, marginBottom: 2 },
  code: { color: '#ffffff', fontSize: 11, fontFamily: 'monospace' },
});

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
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProvider>
    </ErrorBoundary>
  );

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
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

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../store/AppProvider';

import type { AuthStackParamList, MainStackParamList } from './types';

import SplashScreen from '../screens/SplashScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import AuthPhoneScreen from '../screens/AuthPhoneScreen';
import AuthCodeScreen from '../screens/AuthCodeScreen';

import JournalScreen from '../screens/JournalScreen';
import AppointmentCardScreen from '../screens/AppointmentCardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettlementsScreen from '../screens/SettlementsScreen';
import ScannerScreen from '../screens/ScannerScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Permissions" component={PermissionsScreen} />
      <AuthStack.Screen name="AuthPhone" component={AuthPhoneScreen} />
      <AuthStack.Screen name="AuthCode" component={AuthCodeScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Journal" component={JournalScreen} />
      <MainStack.Screen name="AppointmentCard" component={AppointmentCardScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Settlements" component={SettlementsScreen} />
      <MainStack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
    </MainStack.Navigator>
  );
}

export default function RootNavigator() {
  const { auth } = useAppContext();
  return (
    <NavigationContainer>
      {auth.isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

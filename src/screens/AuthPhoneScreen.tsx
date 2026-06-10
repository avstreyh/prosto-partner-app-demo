import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';
import Button from '../components/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthPhone'>;

export default function AuthPhoneScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    setError('');
    navigation.navigate('AuthCode', { phone });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Вход</Text>
          <Text style={styles.title}>Вход для{'\n'}сотрудника</Text>
          <Text style={styles.sub}>Введите номер телефона — пришлём код для входа в смену.</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setError('');
              }}
              placeholder="+7 999 000 00 00"
              placeholderTextColor={colors.ink3}
              keyboardType="phone-pad"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Получить код"
            onPress={handleContinue}
            variant="primary"
            disabled={phone.length < 3}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
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
    marginBottom: 32,
  },
  fieldWrap: { gap: 0 },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink2,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line2,
    paddingHorizontal: 18,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.ink,
  },
  inputError: { borderColor: colors.late },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.late,
    marginTop: 6,
    marginLeft: 4,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 16 },
});

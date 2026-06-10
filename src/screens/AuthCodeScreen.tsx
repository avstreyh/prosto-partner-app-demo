import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme/colors';
import Button from '../components/Button';
import { useAppContext } from '../store/AppProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthCode'>;

const CODE_LENGTH = 4;
// mock: any 4-digit code works
const MOCK_CODE = '1234';

export default function AuthCodeScreen({ navigation, route }: Props) {
  const { login } = useAppContext();
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const cells = Array.from({ length: CODE_LENGTH }, (_, i) => ({
    char: code[i] ?? '',
    filled: !!code[i],
    active: code.length === i,
  }));

  const handleCodeChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    setError('');
    if (digits.length === CODE_LENGTH) {
      verify(digits);
    }
  };

  const verify = (c: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (c === MOCK_CODE) {
        login();
      } else {
        setError('Неверный код. Попробуйте ещё раз.');
        setCode('');
      }
    }, 800);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.eyebrow}>Подтверждение</Text>
          <Text style={styles.title}>Введите код{'\n'}из SMS</Text>
          <Text style={styles.sub}>Отправили на {phone}</Text>

          <TouchableOpacity
            style={styles.codeWrap}
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}
          >
            {cells.map((cell, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  cell.filled && styles.cellFilled,
                  cell.active && styles.cellActive,
                  error && styles.cellError,
                ]}
              >
                <Text style={styles.cellChar}>{cell.char}</Text>
              </View>
            ))}
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.resend}>
            <Text style={styles.resendText}>Отправить код повторно</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button
            label="Войти"
            onPress={() => verify(code)}
            variant="primary"
            loading={loading}
            disabled={code.length < CODE_LENGTH}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  back: { marginBottom: 24 },
  backArrow: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.ink,
  },
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
    marginBottom: 36,
  },
  codeWrap: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 0,
  },
  cell: {
    width: 62,
    height: 70,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: { borderColor: colors.ink },
  cellActive: {
    borderColor: colors.ink,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  cellError: { borderColor: colors.late },
  cellChar: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.ink,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.late,
    textAlign: 'center',
    marginTop: 16,
  },
  resend: { marginTop: 24, alignSelf: 'center' },
  resendText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink2,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 16 },
});

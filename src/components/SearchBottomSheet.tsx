import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts } from '../theme/colors';
import type { Booking } from '../types';
import StatusChip from './StatusChip';
import PlateLabel from './PlateLabel';

interface SearchBottomSheetProps {
  visible: boolean;
  bookings: Booking[];
  onClose: () => void;
  onSelect: (bookingId: string) => void;
}

export default function SearchBottomSheet({
  visible,
  bookings,
  onClose,
  onSelect,
}: SearchBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const mountedRef = useRef(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      mountedRef.current = true;
      setRendered(true);
      setQuery('');
      slideAnim.setValue(600);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mountedRef.current) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 600, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          mountedRef.current = false;
          setRendered(false);
        }
      });
    }
  }, [visible]);

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase();
    return (
      !q ||
      b.clientName.toLowerCase().includes(q) ||
      b.car.plate.toLowerCase().includes(q) ||
      b.car.make.toLowerCase().includes(q) ||
      b.car.model.toLowerCase().includes(q)
    );
  });

  if (!rendered) return null;

  return (
    <Animated.View style={[styles.scrim, { opacity: fadeAnim }]}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.grab} />

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.input}
            placeholder="Имя, номер авто..."
            placeholderTextColor={colors.ink3}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(b) => b.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultRow}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
              activeOpacity={0.75}
            >
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.clientName}</Text>
                <Text style={styles.resultSub}>
                  {item.car.make} {item.car.model} · {item.time}
                </Text>
              </View>
              <View style={styles.resultRight}>
                <PlateLabel plate={item.car.plate} />
                <StatusChip status={item.status} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Ничего не найдено</Text>
          }
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,13,11,0.4)',
    justifyContent: 'flex-end',
    zIndex: 6,
  },
  sheet: {
    height: '78%',
    backgroundColor: colors.bg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  grab: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line2,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  searchIcon: {
    fontSize: 20,
    color: colors.ink3,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
  },
  clearIcon: {
    fontSize: 15,
    color: colors.ink3,
    padding: 4,
  },
  list: { flex: 1 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 12,
  },
  resultInfo: { flex: 1 },
  resultName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
  },
  resultSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink2,
    marginTop: 2,
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 32,
  },
});

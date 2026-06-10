import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/colors';

interface PlateLabelProps {
  plate: string;
}

export default function PlateLabel({ plate }: PlateLabelProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{plate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 7,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.ink,
  },
});

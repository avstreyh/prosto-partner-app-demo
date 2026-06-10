export const colors = {
  bg: '#f4f2ec',
  bg2: '#efece4',
  surface: '#ffffff',
  ink: '#2a2723',
  ink2: '#6f6d67',
  ink3: '#a8a59d',
  line: '#ece9e1',
  line2: '#e2ded3',

  confirm: '#565ec0',
  confirmBg: '#ecedfb',
  work: '#b07a12',
  workBg: '#fbefd3',
  done: '#1e9b61',
  doneBg: '#e3f3ea',
  late: '#d33e4d',
  lateBg: '#fbe7e9',
  wait: '#6f6d67',
  waitBg: '#f0ede6',

  accent: '#1e9b61',
  scan: '#2fb56b',
  dark: '#1c1a18',
} as const;

export const fonts = {
  regular: 'Onest_400Regular',
  medium: 'Onest_500Medium',
  semiBold: 'Onest_600SemiBold',
  bold: 'Onest_700Bold',
  mono: 'JetBrainsMono_400Regular',
} as const;

export const radius = {
  card: 24,
  sm: 16,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#231e18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardLg: {
    shadowColor: '#231e18',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
} as const;

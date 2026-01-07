import { createTheme } from '@shopify/restyle';


const palette = {
  yellowLighter: '#f9d5b9',
  yellowLight: '#f2ab74',
  yellowPrimary: '#EF9651',
  yellowDark: '#dbaa14',

  greenLighter: '#87D0BF',
  greenLight: '#a0d5c2',
  greenPrimary: '#1FAB89',
  greenDark: '#0f766e',
  // #6EC7B1
  grayLighter: '#ececec',
  grayLight: '#f3f3f3',

  mutedLighter: '#d3d3d3',
  mutedLight: '#c5c5c5',
  mutedPrimary: '#737373',
  mutedDark: '#636363',

  description: '#5e5e5e',
  warning: '#ff6467',
  warningLight: '#ff8385',

  overlay: 'rgba(0,0,0,0.4)',
  black: '#0a0a0a',
  white: '#EFEFEF',
  whiter: '#ffffff',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    cardBackground: '#ffffff',
    cardForeground: '#000000',
    primary: palette.greenPrimary,
    primaryLighter: palette.greenLighter,
    primaryLight: palette.greenLight,
    primaryDark: palette.greenDark,
    secondaryLighter: palette.yellowLighter,
    secondaryLight: palette.yellowLight,
    secondary: palette.yellowPrimary,
    secondaryDark: palette.yellowDark,
    grayLighter: palette.grayLighter,
    grayLight: palette.grayLight,
    mutedLighter: palette.mutedLighter,
    mutedLight: palette.mutedLight,
    muted: palette.mutedPrimary,
    mutedDark: palette.mutedDark,
    description: '#5e5e5e',
    transparent: 'transparent',
    input: '#e2e8f0',
    warning: palette.warning,
    warningLight: palette.warningLight,
    white: palette.whiter,
    overlay: palette.overlay,
    shadowColor: palette.black,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    _3xl: 42,
    _4xl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    rounded: 999,
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'l',
      shadowColor: 'shadowColor',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 10,
    },
    elevated: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'xl',
      shadowColor: 'shadowColor',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 10,
    },
  },
  textVariants: {
    header: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 42,
      lineHeight: 42,
    },
    subheader: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 28,
      lineHeight: 28,
    },
    body: {
      fontFamily: 'Nunito_300Light',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyBold: {
      fontFamily: 'Nunito_600SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    description: {
      fontFamily: 'Nunito_300Light',
      color: 'description',
      fontSize: 16,
      lineHeight: 24,
    },
    details: {
      fontFamily: 'Nunito_300Light',
      color: 'mutedDark',
      fontSize: 14,
      lineHeight: 24,
    },
    title: {
      fontSize: 21,
      color: 'mainForeground',
      fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    defaults: {
      fontFamily: 'Nunito_300Light',
    },
  },
  buttonVariants: {
    defaults: {
      paddingVertical: 'm',
      paddingHorizontal: 'l',
      borderRadius: 'm',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'primary',
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
    },
    destructive: {
      backgroundColor: 'warning',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'mainForeground',
    },
    input: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'mutedLighter',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    disabled: {
      opacity: 0.5,
    },
  },
});

export type Theme = typeof theme;
export default theme;

import { createTheme } from '@shopify/restyle';
import { buttonVariants } from '../components/ui/Button';

const palette = {
  yellowLighter: '#fdf5ee',
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
    white: palette.whiter,
    overlay: palette.overlay,
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
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontFamily: 'Roboto_600SemiBold',
      fontSize: 42,
      lineHeight: 42,
    },
    subheader: {
      fontWeight: 'bold',
      fontFamily: 'Roboto_600SemiBold',
      fontSize: 28,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    description: {
      color: 'description',
      fontSize: 16,
      lineHeight: 24,
    },
    title: {
      fontSize: 21,
      fontWeight: 600,
      color: 'mainForeground',
    },
    defaults: {
      fontFamily: ' Nunito_300Light',
    },
  },
  buttonVariants: buttonVariants,
});

export type Theme = typeof theme;
export default theme;

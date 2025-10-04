import { buttonVariants } from '@/components/ui/Button';
import { createTheme } from '@shopify/restyle';

const palette = {
  yellowLight: '#fdca48',
  yellowPrimary: '#EF9651',
  yellowDark: '#dbaa14',

  greenLight: '#44b393',
  greenPrimary: '#1daa88',
  greenDark: '#189375',

  grayLighter: '#ececec',
  grayLight: '#f3f3f3',

  mutedLighter: '#d3d3d3',
  mutedLight: '#c5c5c5',
  mutedPrimary: '#737373',
  mutedDark: '#636363',

  description: '#5e5e5e',

  black: '#0a0a0a',
  white: '#EFEFEF',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    cardBackground: '#ffffff',
    cardForeground: '#000000',
    primary: palette.greenPrimary,
    primaryLight: palette.greenLight,
    secondary: palette.yellowPrimary,
    grayLighter: palette.grayLighter,
    grayLight: palette.grayLight,
    mutedLighter: palette.mutedLighter,
    mutedLight: palette.mutedLight,
    muted: palette.mutedPrimary,
    description: '#5e5e5e',
    transparent: 'transparent',
    input: '#e2e8f0',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
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
    defaults: {
      fontFamily: ' Nunito_300Light',
    },
  },
  buttonVariants: buttonVariants,
});

export type Theme = typeof theme;
export default theme;

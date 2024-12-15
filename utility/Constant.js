import { Dimensions } from 'react-native';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export const PageTheme = {
  white: '#FFF',
  black: '#000',
  gray: 'gray',
  lightTheme: '#E0EEFF',
  midTheme: '#B3D4FF',
  darkTheme: '#6DACFF',
  highContrastTheme: '#004299',
  midContrastTheme: '#0058CC',
  lowContrastTheme: '#2684FF',
};

export const StatusColor = {
  present: '#0CBC8B',
  absent: '#FF1616',
  delay: '#ffff00',
  left: '#3561FE',
  holiday: '#9A9A9A',
};

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

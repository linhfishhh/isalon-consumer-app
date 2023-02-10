import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const defaultFontSize = 15;

export default {
  window: {
    width,
    height
  },
  font: {
    normal: {
      fontFamily: 'SVN-CircularBook',
      fontSize: defaultFontSize
    },
    medium: {
      fontFamily: 'SVN-CircularMedium',
      fontSize: defaultFontSize
    },
    bold: {
      fontFamily: 'SVN-CircularMedium',
      fontSize: defaultFontSize
    }
  },
  isSmallDevice: width < 375,
  microFontSize: 8,
  smallFontSize: 11,
  fontSize: defaultFontSize,
  sectionFontSize: 21,
  largeFontSize: 24,
  titleFontSize: 24,
  navigatorFontSize: 24,
  navigationBarHeight: 45
};

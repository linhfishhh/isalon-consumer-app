import { StyleSheet } from 'react-native';
import Colors from './Colors';
import GlobalStyles from './GlobalStyles';
export default StyleSheet.create({
  pageWrapper: {},
  pageTitle: {
    color: Colors.TEXT_DARK,
    marginBottom: 5,
    fontFamily: GlobalStyles.FONT_NAME
  },
  step: {
    fontSize: 15,
    color: Colors.SILVER,
    marginBottom: 30,
    fontFamily: GlobalStyles.FONT_NAME
  },
  selectPickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  selectPickerLabel: {
    flex: 2,
    justifyContent: 'center'
  },
  selectPickerLabelText: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME
  },
  selectPickerField: {
    flex: 3
  },
  selectPick: {}
});

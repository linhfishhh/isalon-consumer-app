import { StyleSheet } from 'react-native';
import Colors from './Colors';
import GlobalStyles from './GlobalStyles';
export default StyleSheet.create({
  pageWrapper: {},
  pageTitle: {
    color: Colors.LIGHT,
    marginBottom: 5,
    fontFamily: GlobalStyles.FONT_NAME
  },
  error: {
    color: Colors.LIGHT,
    fontSize: 15,
    height: 75,
    fontFamily: GlobalStyles.FONT_NAME
  },
  message: {
    color: Colors.LIGHT,
    fontSize: 15,
    marginBottom: 5,
    fontFamily: GlobalStyles.FONT_NAME
  },
  form: {},
  textFieldError: {
    borderBottomColor: Colors.LIGHT
  },
  buttonError: {
    backgroundColor: Colors.LIGHT
  },
  buttonErrorText: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME
  },
  textFieldInput: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME
  },
  textFieldInputError: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME
  },
  textFieldIconError: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME
  },
  buttonIcon: {
    color: Colors.LIGHT
  },
  buttonIconError: {
    color: Colors.TEXT_DARK
  }
});

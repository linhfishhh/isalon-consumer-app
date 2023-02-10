import {
  StyleSheet,
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { CommonStyles } from '../../constants';

const styles = StyleSheet.create({
  header: {
    height: 105,
    backgroundColor: 'white',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...CommonStyles.navigation_shadow
  },
  header_text_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: Layout.window.width - 85,
    marginLeft: 15,
  },
  subtitle: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor,
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: Colors.itemTextColor,
  },
  back_button: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  content: {
    flex: 1,
  },
  share_group: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continue_button: {
    width: 240,
    height: 44,
    borderRadius: 22,
  },
  button_title: {
    ...Layout.font.bold,
    // fontSize: Layout.largeFontSize,
    color: 'white',
  },
});

export default styles;

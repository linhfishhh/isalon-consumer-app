import {
  StyleSheet,
} from 'react-native';
import { Layout, Colors } from '../../constants';

const maxWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const styles = StyleSheet.create({
  list_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor,
  },
  list: {
    width: maxWidth,
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  text_input: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    height: 50,
  },
  add_group: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel_button: {
    width: 140,
    height: 44,
    backgroundColor: '#bbbdbf',
  },
  ok_button: {
    width: 140,
    height: 44,
  },
  button_title: {
    ...Layout.font.bold,
    // fontSize: Layout.largeFontSize,
    color: 'white',
  }
});

export default styles;

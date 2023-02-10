import {
  StyleSheet,
} from 'react-native';

import { Layout } from '../../constants';

const styles = StyleSheet.create({
  mainContainerStyle: {
    backgroundColor: 'white'
  },
  content: {
    backgroundColor: 'white',
    flex: 1,
  },
  purchase_group: {
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
    width: Layout.window.width - 50,
    height: 44,
  },
  button_title: {
    ...Layout.font.bold,
    // fontSize: Layout.largeFontSize,
    color: 'white',
  }
});

export default styles;

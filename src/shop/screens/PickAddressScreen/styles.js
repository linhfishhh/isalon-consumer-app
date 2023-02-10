import {
  StyleSheet,
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    height: 1,
    marginLeft: 25,
    backgroundColor: Colors.separatorColor,
  },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  item_text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    marginLeft: 25,
  }
});

export default styles;

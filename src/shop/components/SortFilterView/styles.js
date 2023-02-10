import {
  StyleSheet
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 25,
    paddingRight: 25,
    flexDirection: 'row',
    alignItems: 'center'
  },
  space: {
    flex: 1
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sort_down_arrow: {
    marginLeft: 5,
    width: 5,
    height: 3
  },
  filter_icon: {
    width: 21,
    height: 20,
    marginRight: 5
  },
  view_type: {
    width: 21, height: 17
  },
  text: {
    ...Layout.font.bold,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor
  },
  separator: {
    height: 17,
    width: 1,
    backgroundColor: '#bbbdbf',
    marginLeft: 10,
    marginRight: 10,
  }
});

export default styles;

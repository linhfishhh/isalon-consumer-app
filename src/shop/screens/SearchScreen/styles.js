import { StyleSheet } from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const paddingLeft = 25;
const maxScreenWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'column'
  },
  list: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundColor,
  },
  header_container: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10
  },
  section_title: {
  },
  column_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  tags: {
    marginLeft: 25, marginRight: 25, marginTop: 8, marginBottom: 15,
  },
  clear_history_button: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.tintColor,
  },
  fake_item: {
    width: maxScreenWidth - 50,
    height: 170,
    marginLeft: paddingLeft
  },
  search_row: {
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25
  },
  search_text: {
    ...Layout.font.medium,
    fontSize: 17,
    color: Colors.itemTextColor
  }
});

export default styles;
export {
  paddingLeft,
  maxScreenWidth
};

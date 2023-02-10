import { StyleSheet } from 'react-native';
import { Layout, Colors, CommonStyles } from '../../constants';

const maxWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const styles = StyleSheet.create({
  header: {
    height: 95,
    backgroundColor: 'white',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...CommonStyles.navigation_shadow
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: Colors.itemTextColor,
    marginLeft: 25,
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
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
  },
  text_input: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
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
  add_new_button: {
    width: 160,
    height: 44,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  button_title: {
    ...Layout.font.bold,
    // fontSize: Layout.largeFontSize,
    color: 'white',
  },
  edit_button: {

  },
  edit_button_title: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
  },
});

export default styles;

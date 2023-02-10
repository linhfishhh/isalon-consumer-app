import { StyleSheet } from 'react-native';

import { Layout, Colors, CommonStyles } from '../../constants';

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
    marginLeft: 20,
    width: Layout.window.width - 90,
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
  content: {
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
  }
});

export default styles;

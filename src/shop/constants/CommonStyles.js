import { StyleSheet, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Layout from './Layout';
import Colors from './Colors';

const CommonStyles = StyleSheet.create({
  main_container_white: {
    backgroundColor: 'white'
  },
  navigation_shadow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
    // ...Platform.select({
    //   ios: {
    //     shadowColor: 'black',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.18,
    //     shadowRadius: 1
    //   },
    //   android: {
    //     elevation: 1
    //   }
    // })
  },
  text_input: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    height: 40
  },
  padding_top_for_safearea: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: getStatusBarHeight(),
      }
    })
  }
});

export default CommonStyles;

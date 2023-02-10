import {
  StyleSheet
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  nav: {
    height: Layout.navigationBarHeight,
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    marginBottom: 5,
    alignItems: 'center'
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  deliver_address_container: {

  },
  cart_list: {
    flex: 1,
  },
  payment_container: {

  },
});

export default styles;

import {
  StyleSheet
} from 'react-native';
import { getInset } from 'react-native-safe-area-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const bottomMargin = getInset('bottom', false);
const topMargin = getStatusBarHeight();

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10 + topMargin,
    marginBottom: 0,
    height: 45,
    alignItems: 'center',
  },
  back_button: {
    width: 18, height: 15,
  },
  search_button: {
    width: 20, height: 20,
  },
  share_button: {
    width: 21, height: 23,
  },
  heart_button: {
    width: 22, height: 19,
  },
  cart_button: {
    width: 38,
    height: 38,
    marginLeft: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more_button: {
    width: 30, height: 6,
  },
  space: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white'
  },
  product_summary: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  product_combo: {
    flexDirection: 'column',
  },
  product_detail: {
    flexDirection: 'column',
  },
  purchased_together: {
    flexDirection: 'column',
  },
  shipping_location: {
    flexDirection: 'column',
  },
  customer_rights: {
    flexDirection: 'column',
  },
  evaluation_container: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  ask_container: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  discount_code_container: {
    flexDirection: 'column',
  },
  discount_code: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  variant_chooser: {
    flexDirection: 'column',
  },
  buy_product_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    height: 66 + bottomMargin,
    paddingBottom: bottomMargin,
    backgroundColor: 'white'
  },
  summary_text: {
    ...Layout.font.medium,
    fontSize: 21,
    color: Colors.itemTextColor,
    marginLeft: 25,
    marginRight: 25,
  },
  price_holder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 8,
    marginBottom: 8,
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: 14,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 10
  },
  new_price: {
    ...Layout.font.medium,
    fontSize: 24,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  },
  discount_holder: {
    width: 46,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    fontSize: 16,
  },
  rate_holder: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
  },
  free_ship_icon: {
    width: 28, height: 13
  },
  right_arrow: {
    width: 8, height: 14,
  },
  product_detail_summary: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 15,
    // paddingTop: 5, paddingBottom: 5,
    maxHeight: 100,
    overflow: 'hidden'
  }
});

export default styles;

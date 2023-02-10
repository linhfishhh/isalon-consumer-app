import {
  StyleSheet
} from 'react-native';
import { Colors, Layout } from '../../shop/constants';

const maxScreenWidth = Layout.window.width > 700 ? 700 : Layout.window.width;
const productItemWidth = maxScreenWidth - 50;
const productItemHeight = 170;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  cart_list: {
    flex: 1,
  },
  product_item_container: {
    width: maxScreenWidth,
    height: productItemHeight,
    backgroundColor: 'white',
  },
  product_item_style: {
    width: productItemWidth,
    height: productItemHeight - 20,
    marginLeft: 25,
    marginVertical: 10

  }
});

export default styles;

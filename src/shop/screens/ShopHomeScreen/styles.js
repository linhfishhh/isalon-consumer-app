import {
  StyleSheet,
} from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const paddingLeft = 25;
const maximumProductItemWidth = (Layout.window.width - 2 * paddingLeft) / 2;
const defaultProductItemWidth = 130;
const productItemWidth = (maximumProductItemWidth > 1.5 * defaultProductItemWidth)
  ? 1.5 * defaultProductItemWidth : maximumProductItemWidth;
const productItemHeight = ((productItemWidth - 10) * 4) / 3 + 100;
const numberOfProductPerColumn = (maximumProductItemWidth > 1.5 * defaultProductItemWidth) ? 3 : 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 24,
  },
  list: {

  },
  header_container: {
    flexDirection: 'column'
  },
  section_title: {
  },
  column_wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: (Layout.window.width - numberOfProductPerColumn * productItemWidth) / 2,
    backgroundColor: Colors.backgroundColor
  },
  product_item_style: {
    width: productItemWidth,
    height: productItemHeight
  },
  my_cart_button: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  }
});

export default styles;
export {
  numberOfProductPerColumn,
};

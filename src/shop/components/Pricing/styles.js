import {
  StyleSheet,
} from 'react-native';
import { Layout, Colors } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  price_holder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  old_price: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: Layout.fontSize,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  },
  discount_holder: {
    width: 32,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    fontSize: 10,
  },
});

export default styles;

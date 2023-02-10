import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import styles from './styles';
import { formatCurrency, getProductPrice } from '../../utils';
import DiscountView from '../DiscountView';

import discountHolderGreen from '../../../assets/images/shop/ic_discount_holder_green.png';

type Props = {
  product: Object,
};

export default function Pricing({ product }: Props) {
  const {
    oldPrice,
    newPrice,
    discount
  } = getProductPrice(product);
  return (
    <View style={styles.container}>
      {discount !== 0 ? <Text style={styles.old_price}>{formatCurrency(oldPrice)}</Text> : null}
      <View style={styles.price_holder}>
        <Text style={styles.new_price}>{formatCurrency(newPrice)}</Text>
        {
          discount > 0 ? (
            <DiscountView
              style={styles.discount_holder}
              amount={discount}
              source={discountHolderGreen}
            />
          ) : null
        }
      </View>
    </View>
  );
}

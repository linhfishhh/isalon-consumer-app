import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Img from './Img';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import DiscountView from './DiscountView';

import discountHolder from '../../assets/images/shop/ic_discount_holder_orange.png';
import { formatCurrency, getThumbImageUrl, getProductPrice } from '../utils';

type Props = {};

export default function TargetedUserProductItem({ navigation, product }: Props) {
  const {
    oldPrice,
    newPrice,
    discount
  } = getProductPrice(product);

  const onPress = React.useCallback(() => {
    if (navigation) {
      navigation.push('ProductScreen', { product });
    }
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.cover_container}>
        <Img
          source={{ uri: getThumbImageUrl(product.mainImageId) }}
          style={styles.sample_img}
        />
        {discount > 0 ? (
          <DiscountView style={styles.discount_holder} amount={discount} source={discountHolder} />
        ) : null }
      </View>
      <View style={styles.price_holder}>
        {oldPrice !== newPrice ? (
          <Text style={styles.old_price}>{formatCurrency(oldPrice)}</Text>
        ) : null}
        <Text style={styles.new_price}>{formatCurrency(newPrice)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'white',
    width: 120,
    height: 210,
    borderRadius: 3,
    overflow: 'hidden',
  },
  cover_container: {
    // margin: 5,
    width: 120,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discount_holder: {
    width: 50,
    height: 28,
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sample_img: {
    width: 120,
    height: 160,
  },
  price_holder: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: 16,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  }
});

import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View
} from 'react-native';
import _ from 'lodash';
import Img from './Img';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import RateAmountView from './RateAmountView';
import DiscountView from './DiscountView';
import { formatCurrency, getThumbImageUrl, getProductPrice } from '../utils';

import discountHolder from '../../assets/images/shop/ic_discount_holder_orange.png';

type Props = {
  product: Object,
  navigation: Object
};

export default function FlashSaleProductItem({ product, navigation }: Props) {
  const onPress = () => {
    navigation.push('ProductScreen', { product });
  };
  const {
    oldPrice,
    newPrice,
    discount
  } = getProductPrice(product);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.cover_container}>
        <Img
          source={{ uri: getThumbImageUrl(product.mainImageId) }}
          style={styles.sample_img}
        />
        {discount > 0 ? (
          <DiscountView
            style={styles.discount_holder}
            amount={discount}
            source={discountHolder}
          />
        ) : null}
      </View>
      <Text style={styles.brand_name}>{_.get(product, 'brand.name')}</Text>
      <Text style={styles.short_desc} numberOfLines={2} ellipsizeMode="tail">
        {_.get(product, 'name')}
      </Text>
      <View style={styles.price_holder}>
        {discount !== 0 ? (
          <Text style={styles.old_price}>{formatCurrency(oldPrice)}</Text>
        ) : null}
        <Text style={styles.new_price}>{formatCurrency(newPrice)}</Text>
      </View>
      <RateAmountView
        rate={product.productRate ? product.productRate.rate.toFixed(1) : 0}
        numberOfUsers={product.productRate ? product.productRate.numberTotal : 0}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 130,
    // height: 255,
    padding: 5
  },
  cover_container: {
    backgroundColor: 'white',
    width: 120,
    height: 160,
    borderRadius: 3,
    // margin: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.imageBorder,
    borderWidth: 0.5
  },
  discount_holder: {
    width: 50,
    height: 28,
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sample_img: {
    width: 120,
    height: 160
  },
  brand_name: {
    ...Layout.font.normal,
    fontSize: Layout.microFontSize,
    color: Colors.brandNameTextColor,
    textAlign: 'left',
    marginTop: 10
  },
  short_desc: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.productShortDescTextColor,
    textAlign: 'left'
  },
  price_holder: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 15
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: Layout.fontSize,
    color: Colors.newPriceTextColor,
    textAlign: 'left'
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './styles';
import DiscountView from '../../components/DiscountView';
import RateAmountView from '../../components/RateAmountView';
// import Img from '../../components/Img';
import Space, { FixedSpace } from '../../components/Space';
import { formatCurrency } from '../../utils';
import Separator from '../../components/Separator';
import icDiscountHolder from '../../../assets/images/shop/ic_discount_holder_green.png';
// import icFreeship from '../../../assets/images/shop/ic_free_ship.png';

type Props = {
  style: Object,
  product: Object
};

function ProductSummary({
  style,
  product,
  productDetails,
}: Props) {
  const selectedVariant = _.get(productDetails, `${product.productId}.selectedVariant`);
  let variant = _.isEmpty(selectedVariant) ? _.get(product, 'defaultProductVariant') : selectedVariant;
  variant = variant || product;
  const oldPrice = _.get(variant, 'price.originRetailPrice');
  const flashSalePrice = _.get(variant, 'flashSaleProductVariant') || _.get(variant, 'flashSaleProduct');
  const newPrice = _.get(flashSalePrice || variant, 'price.retailPrice');
  const discount = oldPrice > 0 ? Math.floor(((oldPrice - newPrice) * 100) / oldPrice) : 0;
  return (
    <View style={{
      ...styles.product_summary,
      ...style
    }}
    >
      <Text style={styles.summary_text} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
      <View style={styles.price_holder}>
        <Text style={styles.new_price}>{formatCurrency(newPrice)}</Text>
        {oldPrice !== newPrice ? (
          <Text style={styles.old_price}>{formatCurrency(oldPrice)}</Text>
        ) : null}
        {discount > 0
          ? (
            <DiscountView
              style={styles.discount_holder}
              amount={discount}
              source={icDiscountHolder}
            />
          ) : null}
      </View>
      <View style={styles.rate_holder}>
        <RateAmountView
          rate={product.productRate ? product.productRate.rate.toFixed(1) : 0}
          numberOfUsers={product.productRate ? product.productRate.numberTotal : 0}
          rateTextStyle={internalStyles.rate}
          countStyle={internalStyles.count}
          size={14}
        />
        <Space />
        {/* <Img source={icFreeship} style={styles.free_ship_icon} /> */}
      </View>
      <FixedSpace size={20} />
      <Separator />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  rate: {
    fontSize: 15,
  },
  count: {
    fontSize: 11,
  }
});

export default connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
  }), {}
)(ProductSummary);

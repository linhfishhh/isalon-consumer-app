import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import DiscountView from '../../components/DiscountView';
import { WebImage } from '../../components/Img';
import styles from './styles';
import { getThumbImageUrl, formatCurrency, getProductPrice } from '../../utils';
import discountHolder from '../../../assets/images/shop/ic_discount_holder_green.png';

export default class Header extends React.PureComponent {
  render() {
    const { product, selectedVariant } = this.props;
    const variant = _.isEmpty(selectedVariant) ? product : selectedVariant;
    const {
      oldPrice,
      newPrice,
      discount
    } = getProductPrice(variant);
    const colorCode = _.get(variant, 'color');
    const selectedOptions = _.map(_.get(variant, 'variantValues'), 'name').join(', ');

    return (
      <View style={styles.overview_container}>
        <View style={styles.cover_container}>
          <WebImage
            source={getThumbImageUrl(product.mainImageId)}
            style={styles.sample_img}
          />
        </View>
        <View style={styles.overview_desc}>
          <Text style={styles.new_price}>{formatCurrency(newPrice)}</Text>
          {discount !== 0 ? (
            <View style={styles.price_holder}>
              <Text style={styles.old_price}>{formatCurrency(oldPrice)}</Text>
              <DiscountView
                style={styles.discount_holder}
                amount={discount}
                source={discountHolder}
              />
            </View>
          ) : null}
          <Text style={styles.selected_variant}>{selectedOptions}</Text>
          {colorCode ? <Text style={styles.selected_variant}>{`Mã màu: ${colorCode}`}</Text> : null}
        </View>
      </View>
    );
  }
}

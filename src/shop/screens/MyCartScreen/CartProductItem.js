import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';
import Space from '../../components/Space';
import { WebImage } from '../../components/Img';
import DiscountView from '../../components/DiscountView';
import AmountCounter from '../../components/AmountCounter';
import {
  getThumbImageUrl,
  formatCurrency,
  getProductPrice,
} from '../../utils';
import {
  addProductToCart as addProductToCartAction,
  removeProductFromCart as removeProductFromCartAction,
  updateCartItem as updateCartItemAction,
} from '../../redux/cart/actions';

import discountHolder from '../../../assets/images/shop/ic_discount_holder_green.png';
import checkboxNormal from '../../../assets/images/shop/ic_radio_off.png';
import checkboxSelected from '../../../assets/images/shop/ic_radio_on.png';

type Props = {
  product: Object,
  editable?: Boolean,
};

function CartProductItem({
  navigation,
  cartItem,
  editable,
  addProductToCart,
  removeProductFromCart,
  updateCartItem,
}: Props) {
  const { isSelected, product, productVariant } = cartItem;
  const {
    oldPrice,
    newPrice,
    discount
  } = getProductPrice(product, productVariant);
  const quantity = _.get(cartItem, 'quantity') || 0;
  const { cartItemId } = cartItem;

  const onCheckBoxClick = () => {
    updateCartItem({
      cartItemId,
      isSelected: !isSelected
    });
  };

  const onChange = ({ amount }) => {
    let payload = {
      productId: product.productId,
      quantity: 1,
    };
    if (cartItem.productVariant) {
      payload = {
        ...payload,
        productVariantId: cartItem.productVariant.productVariantId,
      };
    }
    if (amount > 0) {
      addProductToCart([payload]);
    } else {
      removeProductFromCart(payload);
    }
  };

  const openProductDetail = React.useCallback(() => {
    navigation.push('ProductScreen', { product });
  });

  return (
    <View style={internalStyles.root}>
      <TouchableOpacity style={internalStyles.container} onPress={openProductDetail}>
        {editable ? (
          <ImageButton
            style={internalStyles.checkbox}
            source={isSelected ? checkboxSelected : checkboxNormal}
            onPress={onCheckBoxClick}
          />
        ) : null}
        <View style={internalStyles.cover_container}>
          <WebImage
            source={getThumbImageUrl(_.get(product, 'mainImageId'))}
            style={internalStyles.sample_img}
          />
        </View>
        <View style={internalStyles.overview_desc}>
          <Text style={internalStyles.desc} numberOfLines={2}>{product.name}</Text>
          <Text style={internalStyles.brand}>{_.get(product, 'brand.name')}</Text>
          <Text style={internalStyles.new_price}>{formatCurrency(newPrice)}</Text>
          <View style={internalStyles.price_holder}>
            {discount !== 0
              ? <Text style={internalStyles.old_price}>{formatCurrency(oldPrice)}</Text> : null}
            {discount !== 0
              ? (
                <DiscountView
                  style={internalStyles.discount_holder}
                  amount={discount}
                  source={discountHolder}
                />
              ) : null}
            <Space />
            {editable
              ? <AmountCounter initialValue={quantity} align="left" onChange={onChange} />
              : <Text style={internalStyles.amount_text}>{`Số lượng: ${quantity}`}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

CartProductItem.defaultProps = {
  editable: true,
};

const internalStyles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    height: 130,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  checkbox: {
    width: 20, height: 20,
  },
  cover_container: {
    backgroundColor: 'white',
    width: 81,
    height: 110,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d0d2d3',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sample_img: {
    width: 81,
    height: 110,
  },
  overview_desc: {
    flexDirection: 'column',
    width: Layout.window.width - 150,
    marginLeft: 10,
  },
  discount_holder: {
    width: 42,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    fontSize: Layout.smallFontSize,
  },
  price_holder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  },
  desc: {
    ...Layout.font.normal,
    color: Colors.itemTextColor
  },
  brand: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor
  },
  amount_text: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
  }
});

export default connect(
  null,
  {
    addProductToCart: addProductToCartAction,
    removeProductFromCart: removeProductFromCartAction,
    updateCartItem: updateCartItemAction,
  }
)(CartProductItem);

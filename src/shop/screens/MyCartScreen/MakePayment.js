import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Space from '../../components/Space';
import { formatCurrency } from '../../utils';
import GradientButton from '../../components/Button/GradientButton';

type Props = {
  cart: Object,
};

export default function MakePayment({ navigation, cart }: Props) {
  const allItems = _.get(cart, 'cartItems');
  const cartItems = React.useMemo(() => {
    if (allItems && allItems.length > 0) {
      const allItemCart = _.get(allItems[0], 'data') || [];
      return allItemCart.filter((item) => item.isSelected);
    }
    return undefined;
  }, [allItems]);

  const onMakePaymentClick = () => {
    if (cartItems && cartItems.length > 0) {
      navigation.push('PaymentScreen', { cartItems, buyNow: false });
    }
  };

  return (
    <View style={internalStyles.container}>
      <View style={internalStyles.ship_container}>
        <Text style={internalStyles.amount_text}>Phí vận chuyển</Text>
        <Space />
        <Text style={internalStyles.ship_fee_text}>{formatCurrency(_.get(cart, 'estimatedFee.shippingCost'))}</Text>
      </View>
      <View style={internalStyles.amount_container}>
        <Text style={internalStyles.amount_text}>Thành tiền</Text>
        <Space />
        <View style={internalStyles.price_container}>
          <Text style={internalStyles.price_text}>{formatCurrency(_.get(cart, 'estimatedFee.estimatedTotalPrice'))}</Text>
          <Text style={internalStyles.vat_text}>Đã bao gồm VAT</Text>
        </View>
      </View>
      <Space />
      <GradientButton
        enabled={!_.isEmpty(cartItems)}
        style={internalStyles.purchase_button}
        title="TIẾN HÀNH THANH TOÁN"
        titleStyle={internalStyles.purchase_button_title}
        onPress={onMakePaymentClick}
      />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 140,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  ship_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  amount_text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
  },
  price_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  price_text: {
    ...Layout.font.bold,
    color: Colors.tintColor,
    fontSize: Layout.titleFontSize,
  },
  ship_fee_text: {
    ...Layout.font.normal,
    color: Colors.tintColor,
  },
  vat_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
  },
  purchase_button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    height: 45,
    backgroundColor: Colors.tintColor,
  },
  purchase_button_title: {
    ...Layout.font.normal,
    color: 'white',
  }
});

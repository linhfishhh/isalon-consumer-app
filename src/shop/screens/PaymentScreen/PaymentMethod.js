import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Layout, Colors } from '../../constants';
import { formatCurrency } from '../../utils';

type Props = {};

function PaymentMethodItem(props: Props) {
  const {
    orderInfo
  } = props;

  return (
    <View style={styles.item}>
      <Icon
        name="check-circle"
        color="#39b54a"
        size={18}
        style={styles.checkmark}
      />
      <Text style={styles.price}>{formatCurrency(_.get(orderInfo, 'total'))}</Text>
      <Text style={styles.info_text}>Thanh toán tiền mặt khi nhận hàng</Text>
    </View>
  );
}

function PaymentMethod(props: Props) {
  const {
    orderInfo
  } = props;

  return (
    <View style={styles.container}>
      <PaymentMethodItem orderInfo={orderInfo} />
    </View>
  );
}

export default connect(
  (state) => ({
    orderInfo: state.shopOrder.orderInfo
  })
)(PaymentMethod);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  item: {
    width: 180,
    height: 100,
    borderRadius: 5,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 5,
    top: 5,
  },
  price: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: Colors.tintColor,
  },
  info_text: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    width: 130,
    textAlign: 'center',
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Layout, Colors } from '../../constants';
import {
  formatCurrency
} from '../../utils';

class PaymentInfo extends React.PureComponent {
  render() {
    const { orderInfo } = this.props;
    return (
      <View style={internalStyles.container}>
        <Text style={internalStyles.title_text}>Tổng cộng</Text>
        <View style={internalStyles.total_amount_container}>
          <Text style={internalStyles.amount_text}>{formatCurrency(_.get(orderInfo, 'total'))}</Text>
          <Text style={internalStyles.vat_info}>Đã bao gồm VAT</Text>
        </View>
      </View>
    );
  }
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  title_text: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
  },
  amount_text: {
    ...Layout.font.bold,
    color: Colors.tintColor,
  },
  total_amount_container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  vat_info: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
  }
});

export default connect(
  (state) => ({
    orderInfo: state.shopOrder.orderInfo,
  }),
  {}
)(PaymentInfo);

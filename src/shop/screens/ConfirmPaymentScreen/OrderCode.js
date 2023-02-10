import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Layout, Colors } from '../../constants';

type Props = {};

export default function OrderCode({ orderInfo }: Props) {
  const createdAt = _.get(orderInfo, 'createdAt');
  const createdAtLabel = moment(createdAt).format('dddd, DD MMMM - YYYY');
  return (
    <View style={internalStyles.container}>
      <View style={internalStyles.order_code_container}>
        <Text style={internalStyles.order_label}>Mã đơn hàng: </Text>
        <Text style={internalStyles.order_code}>{`#${orderInfo.orderId}`}</Text>
      </View>
      <Text style={internalStyles.order_date}>{`Ngày đặt hàng: ${createdAtLabel}`}</Text>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 20,
    paddingBottom: 20,
  },
  order_code_container: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
  },
  order_label: {
    ...Layout.font.medium,
    fontSize: Layout.sectionFontSize,
    color: Colors.itemTextColor,
  },
  order_code: {
    ...Layout.font.medium,
    fontSize: Layout.sectionFontSize,
    color: Colors.tintColor,
  },
  order_date: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    marginLeft: 25,
    marginRight: 25,
  }
});

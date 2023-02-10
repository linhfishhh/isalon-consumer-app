import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Layout, Colors } from '../../constants';
import SectionTitle from '../../components/SectionTitle';

export default function PaymentMethod() {
  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Hình thức thanh toán" style={internalStyles.title} />
      <Text style={internalStyles.method_text}>Thanh toán tiền mặt khi nhận hàng</Text>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingRight: 25,
    paddingBottom: 20,
  },
  title: {
    backgroundColor: 'white'
  },
  method_text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    paddingLeft: 25,
    width: Layout.window.width - 50,
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import { Layout, Colors } from '../../constants';
import SectionTitle from '../../components/SectionTitle';

type Props = {};

export default function ShipLocation({ orderInfo }: Props) {
  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Thông tin giao hàng" style={internalStyles.title} />
      <View style={internalStyles.selected_addr_container}>
        <Text style={internalStyles.name}>{_.get(orderInfo, 'receiverName')}</Text>
        <Text style={internalStyles.phone}>{_.get(orderInfo, 'receiverPhone')}</Text>
        <Text style={internalStyles.address}>{_.get(orderInfo, 'receiverAddress')}</Text>
      </View>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    backgroundColor: 'white'
  },
  selected_addr_container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },
  name: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
  },
  phone: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    width: Layout.window.width - 50,
  },
  address: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    width: Layout.window.width - 50,
  }
});

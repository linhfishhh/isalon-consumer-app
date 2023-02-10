import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

type Props = {};

export default function AddressGroup({ address }: Props) {
  return (
    <View style={internalStyles.container}>
      <Text style={internalStyles.name}>{_.get(address, 'name')}</Text>
      <Text style={internalStyles.phone}>{_.get(address, 'phone')}</Text>
      <Text style={internalStyles.address}>{_.get(address, 'addressDetail')}</Text>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
  },
  name: {
    ...Layout.font.bold,
    fontSize: 17,
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

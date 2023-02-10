import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SectionTitle from '../../components/SectionTitle';
import ShipMethodGroup from './ShipMethodGroup';

export default function ShipMethod() {
  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Hình thức giao hàng" style={internalStyles.title} />
      <ShipMethodGroup />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    backgroundColor: 'white',
  }
});

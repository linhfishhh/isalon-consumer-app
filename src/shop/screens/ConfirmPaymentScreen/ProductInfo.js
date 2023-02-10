import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SectionTitle from '../../components/SectionTitle';
import CartProductItem from '../MyCartScreen/CartProductItem';
import ComboProductItem from '../MyCartScreen/ComboProductItem';

type Props = {};

export default function ProductInfo(props: Props) {
  const { cartItems } = props;
  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Thông tin sản phẩm" style={internalStyles.section_style} />
      {
        cartItems.map((row) => (row.comboInfo
          ? (
            <ComboProductItem
              key={row.comboInfo.comboId}
              combo={row}
              editable={false}
            />
          )
          : (
            <CartProductItem
              key={row.productId}
              cartItem={row}
              editable={false}
            />
          )))
      }
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingBottom: 20,
  },
  section_style: {
    marginBottom: 10,
    backgroundColor: 'white'
  }
});

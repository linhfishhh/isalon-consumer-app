import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ImageButton from '../../shop/components/ImageButton';
import icCartDelete from '../../assets/images/shop/ic_cart_delete.png';
import { Colors } from '../../shop/constants';

type Props = {};

export default function DeleteRowMenu({ rowData, rowMap, onDelete }: Props) {
  const onDeletePress = () => {
    rowMap[`${rowData.item.productId}`].closeRow();
    if (onDelete) {
      onDelete(rowData.item);
    }
  };

  return (
    <View style={internalStyles.container}>
      <ImageButton
        source={icCartDelete}
        style={internalStyles.delete_button}
        onPress={onDeletePress}
      />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 170,
    padding: 30,
    backgroundColor: Colors.backgroundColor
  },
  delete_button: {
    width: 43,
    height: 43,
    marginLeft: 5,
  }
});

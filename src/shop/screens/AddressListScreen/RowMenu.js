import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import { VectorIconButton } from '../../components/Button';
import ImageButton from '../../components/ImageButton';

import icDelete from '../../../assets/images/shop/ic_cart_delete.png';

type Props = {};

export default function RowMenu({
  rowData, rowMap, onEdit, onDelete
}: Props) {
  const onEditPress = () => {
    rowMap[(rowData.item + rowData.index)].closeRow();
    if (onDelete) {
      onEdit(rowData.item);
    }
  };

  const onDeletePress = () => {
    rowMap[(rowData.item + rowData.index)].closeRow();
    if (onDelete) {
      onDelete(rowData.item);
    }
  };

  return (
    <View style={internalStyles.container}>
      <VectorIconButton
        name="edit"
        color="white"
        size={30}
        style={internalStyles.fav_button}
        onPress={onEditPress}
      />
      <ImageButton
        source={icDelete}
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
    padding: 10,
    backgroundColor: Colors.backgroundColor,
    height: '100%',
    flex: 1,
  },
  fav_button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.tintColor,
  },
  delete_button: {
    width: 44,
    height: 44,
    marginLeft: 5,
  }
});

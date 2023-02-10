import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImageButton from '../../components/ImageButton';
import icCartDelete from '../../../assets/images/shop/ic_cart_delete.png';
import favOn from '../../../assets/images/shop/ic_cart_fav_on.png';
import favOff from '../../../assets/images/shop/ic_cart_fav_off.png';
import {
  updateProductFavorite as updateProductFavoriteAction,
} from '../../redux/product/actions';

type Props = {};

function RowMenu({
  rowData,
  rowMap,
  onDelete,
  updateProductFavorite,
}: Props) {
  const favorited = _.get(rowData, 'item.product.isFavorite', false);
  const [isFavorited, setIsFavorited] = React.useState(favorited);
  const productId = _.get(rowData, 'item.product.productId', 0);
  const onFavPress = () => {
    setIsFavorited(!isFavorited);
    updateProductFavorite(productId, !isFavorited);
  };

  const onDeletePress = () => {
    const cartItemId = _.get(rowData, 'item.cartItemId');
    rowMap[`${cartItemId}`].closeRow();
    if (onDelete) {
      onDelete(rowData.item);
    }
  };

  return (
    <View style={internalStyles.container}>
      <ImageButton
        source={isFavorited ? favOn : favOff}
        style={internalStyles.fav_button}
        onPress={onFavPress}
      />
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
    height: 134,
    padding: 10,
  },
  fav_button: {
    width: 43, height: 43,
  },
  delete_button: {
    width: 43,
    height: 43,
    marginLeft: 5,
  }
});

export default connect(
  null,
  {
    updateProductFavorite: updateProductFavoriteAction,
  }
)(RowMenu);

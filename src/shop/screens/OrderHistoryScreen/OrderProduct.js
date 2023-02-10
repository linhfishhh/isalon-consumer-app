import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../styles/Colors';
import Layout from '../../constants/Layout';
import { getThumbImageUrl, formatCurrency } from '../../utils';
import Img, { WebImage } from '../../components/Img';
import noThumb from '../../../assets/images/no-thumb.png';

function OrderProduct(props) {
  const { data, navigation } = props;

  const openProductDetail = (dataItem) => {
    const { product } = dataItem;
    if (product) {
      navigation.push('ProductScreen', { product });
    }
  };

  return data.map((dataItem) => (
    <TouchableOpacity
      key={dataItem.orderItemId}
      style={Styles.productItem}
      onPress={() => openProductDetail(dataItem)}
    >
      <View style={Styles.productImage}>
        {dataItem.product ? (
          <WebImage
            source={getThumbImageUrl(dataItem.product.mainImageId)}
            resizeMode="contain"
            style={Styles.image}
          />
        ) : (
          <Img
            source={noThumb}
            resizeMode="contain"
            style={Styles.image}
          />
        ) }

      </View>
      <View style={Styles.productInfo}>
        <Text style={Styles.productName} numberOfLines={2} ellipsizeMode="tail">{dataItem.product && dataItem.product.name}</Text>
        <Text style={Styles.productBrand}>
          {dataItem.product && dataItem.product.brand && dataItem.product.brand.name}
        </Text>
        <Text style={Styles.productPrice}>
          {formatCurrency(dataItem.pricePerProduct)}
        </Text>
        <Text style={Styles.productQuantity}>{`x${dataItem.quantity}`}</Text>
      </View>
    </TouchableOpacity>
  ));
}

export default OrderProduct;

const Styles = StyleSheet.create({
  productItem: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  productImage: {
    width: 100,
    height: 130,
    borderRadius: 4,
    borderColor: Colors.GRAYS,
    borderWidth: 1
  },
  image: {
    flex: 1
  },
  productInfo: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: 15,
    marginTop: 10,
    flexGrow: 1,
    flexShrink: 1
  },
  productName: {
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.DARK,
    fontSize: Layout.fontSize
  },
  productBrand: {
    marginTop: 3,
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.SILVER,
    fontSize: 13
  },
  productPrice: {
    marginTop: 3,
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.PRIMARY,
    fontSize: Layout.fontSize
  },
  productQuantity: {
    marginTop: 3,
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.SILVER,
    fontSize: 13
  }
});

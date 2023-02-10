import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Img, { WebImage } from '../Img';
import RateAmountView from '../RateAmountView';
import styles from './styles';
import Pricing from '../Pricing';
import { getThumbImageUrl } from '../../utils';
import { Colors } from '../../constants';

import icFreeShip from '../../../assets/images/shop/ic_free_ship.png';

type Props = {
  style?: Object,
  product?: Object,
  navigation: Object,
};

export default function ProductItemVertical({ product, style, navigation }: Props) {
  const externalStyles = StyleSheet.create({
    container: {
      ...style,
      flexDirection: 'column',
      padding: 5,
    },
    cover_container: {
      backgroundColor: 'white',
      width: style.width - 10,
      height: ((style.width - 10) * 4) / 3,
      borderRadius: 3,
      // margin: 5,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderColor: Colors.imageBorder,
      borderWidth: 0.5,
    },
    sample_img: {
      width: style.width - 10,
      height: ((style.width - 10) * 4) / 3,
    },
  });

  const onOpenDetail = () => {
    if (navigation) {
      navigation.push('ProductScreen', { product });
    }
  };

  return (
    <TouchableOpacity style={externalStyles.container} onPress={onOpenDetail}>
      <View style={externalStyles.cover_container}>
        <WebImage
          source={getThumbImageUrl(product.mainImageId)}
          style={externalStyles.sample_img}
        />
      </View>
      {/* <Text style={styles.brand_name}>LAKME</Text> */}
      <Text style={styles.short_desc} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
      <Pricing product={product} />
      <RateAmountView
        rate={product.productRate ? product.productRate.rate.toFixed(1) : 0}
        numberOfUsers={product.productRate ? product.productRate.numberTotal : 0}
      />
      <View style={styles.free_ship}>
        <Img source={icFreeShip} style={styles.free_ship_icon} />
        <Text style={styles.free_ship_location}>Hà nội</Text>
      </View>
    </TouchableOpacity>
  );
}

ProductItemVertical.defaultProps = {
  style: {
    width: 130,
    height: 160,
  },
  product: {
    name: '',
    price: {
      originRetailPrice: 0,
      retailPrice: 0,
    },
  }
};

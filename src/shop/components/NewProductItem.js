import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Img from './Img';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import { getThumbImageUrl } from '../utils';
import Pricing from './Pricing';

type Props = {
  product: Object,
};

export default function NewProductItem({ product, navigation }: Props) {
  const onOpenDetail = () => {
    navigation.push('ProductScreen', { product });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onOpenDetail}>
      <Img
        source={{ uri: getThumbImageUrl(product.mainImageId) }}
        style={styles.sample_img}
      />
      <View style={styles.detail_container}>
        <Text style={styles.short_desc} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
        <Pricing product={product} />
      </View>
    </TouchableOpacity>
  );
}

const ITEM_WIDTH = 60;
const ITEM_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: Layout.window.width - 220 - ITEM_WIDTH,
    marginBottom: 5,
  },
  sample_img: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  detail_container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    marginLeft: 5
  },
  short_desc: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.productShortDescTextColor,
    textAlign: 'left',
    marginBottom: 8,
  },
});

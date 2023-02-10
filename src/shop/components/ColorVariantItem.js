import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Img, { WebImage } from './Img';
import { getThumbImageUrl } from '../utils';

import checkmarkIcon from '../../assets/images/shop/ic_variant_checkmark.png';

type Props = {};

export default function ColorVariantItem({ item, selected, onPress }: Props) {
  const onSelect = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity style={internalStyles.item_container} onPress={onSelect}>
      <View style={internalStyles.item_cover}>
        <WebImage
          source={getThumbImageUrl(item.mainImageId)}
          style={internalStyles.item}
          resizeMode="cover"
        />
      </View>
      {selected ? <Img style={internalStyles.checkmark} source={checkmarkIcon} /> : null }
      <Text style={internalStyles.item_name} numberOfLines={2}>{item.sku}</Text>
    </TouchableOpacity>
  );
}

const internalStyles = StyleSheet.create({
  item_container: {
    width: 70,
    height: 120,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8
  },
  item_cover: {
    width: 60,
    height: 60,
    borderColor: '#d0d2d3',
    borderWidth: 1,
    borderRadius: 30,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 15,
    right: 5,
  },
  item: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  item_name: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    textAlign: 'center',
    color: Colors.imageCountColor
  }
});

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import internalStyles, { ITEMS_VISIBLE } from './styles';
import Img, { WebImage } from '../../../components/Img';
import { getThumbImageUrl } from '../../../utils';
import icCheckmark from '../../../../assets/images/shop/ic_variant_checkmark.png';

type Props = {};

export default function Item({
  item, index, selected, totalElements
}: Props) {
  return (
    <View style={internalStyles.item_container}>
      <View style={internalStyles.item_cover}>
        <WebImage
          source={getThumbImageUrl(item.mainImageId)}
          style={internalStyles.item}
          resizeMode="cover"
        />
      </View>
      {selected ? <Img style={internalStyles.checkmark} source={icCheckmark} /> : null}
      {
        index < (ITEMS_VISIBLE - 1)
          ? (<Text style={internalStyles.item_name} numberOfLines={2}>{item.sku}</Text>) : null
      }
      {
        index === (ITEMS_VISIBLE - 1) && totalElements >= ITEMS_VISIBLE
          ? (
            <View style={internalStyles.overlay}>
              <Text style={internalStyles.remain_amount_text}>
                {`+${totalElements - ITEMS_VISIBLE + 1}`}
              </Text>
            </View>
          ) : null
      }
    </View>
  );
}

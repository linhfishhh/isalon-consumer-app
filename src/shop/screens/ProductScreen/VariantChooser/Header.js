import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import internalStyles from './styles';
import Img from '../../../components/Img';
import Space from '../../../components/Space';
import icRight from '../../../../assets/images/shop/ic_right_arrow_accessory.png';

type Props = {};

function Header({
  selectedVariant,
}: Props) {
  const selectedOptions = _.map(_.get(selectedVariant, 'variantValues'), 'name').join(', ');

  return (
    <View style={internalStyles.title_container}>
      <Text style={internalStyles.title}>Lựa chọn</Text>
      <Text style={internalStyles.value}>{selectedOptions}</Text>
      <Space />
      <Img style={internalStyles.right_arrow} source={icRight} />
    </View>
  );
}

export default React.memo(Header);

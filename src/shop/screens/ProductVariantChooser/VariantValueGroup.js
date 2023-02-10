import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import Colors from '../../constants/Colors';
import Separator from '../../components/Separator';
import styles from './styles';
import VariantValueTag from './VariantValueTag';

type Props = {};

export default function VariantValueGroup(props: Props) {
  const { group, option, onSelect } = props;
  return (
    <View style={styles.variant_group_container}>
      <Text style={styles.section_title}>{group.name}</Text>
      <View style={styles.variant_group_content}>
        {
          group.variantValues.map((variantValue) => (
            <VariantValueTag
              key={variantValue.variantValueId}
              variant={group}
              variantValue={variantValue}
              selected={(_.get(option, 'variantValueId') === variantValue.variantValueId)}
              onPress={onSelect}
            />
          ))
        }
      </View>
      <Separator color={Colors.backgroundColor} />
    </View>
  );
}

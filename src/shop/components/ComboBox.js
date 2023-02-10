import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Layout, Colors } from '../constants';
import Separator from './Separator';
import Space from './Space';

type Props = {};

export default function ComboBox({
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.text_container}>
        <Text style={styles.text}>{title}</Text>
        <Space />
        <Icon name="menu-down" color={Colors.itemTextColor} size={16} />
      </View>
      <Separator height={1} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  text_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
  },
  down_arrow: {
    width: 16,
    height: 16,
  }
});

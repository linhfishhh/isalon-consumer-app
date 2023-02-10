import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Layout, Colors } from '../constants';
import Img from './Img';

type Props = {};

const checkboxNormal = require('../../assets/images/shop/ic_radio_off.png');
const checkboxSelected = require('../../assets/images/shop/ic_radio_on.png');

export default function CheckBox({
  title,
  selected,
  onChange,
  enabled,
}: Props) {
  const onPress = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!enabled}>
      <Img
        style={styles.checkbox}
        source={selected ? checkboxSelected : checkboxNormal}
      />
      <Text style={enabled ? styles.text : styles.text_disabled}>{title}</Text>
    </TouchableOpacity>
  );
}

CheckBox.defaultProps = {
  enabled: true,
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    marginLeft: 10,
  },
  text_disabled: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    marginLeft: 10,
  },
  checkbox: {
    width: 20, height: 20,
  },
});

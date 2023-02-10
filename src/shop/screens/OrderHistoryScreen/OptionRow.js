import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Img from '../../components/Img';

import radioOn from '../../../assets/images/shop/ic_radio_on.png';
import radioOff from '../../../assets/images/shop/ic_radio_off.png';

export default function OptionRow(props) {
  const {
    selected,
    option,
    selectOption,
    index
  } = props;

  const onPress = () => {
    if (selectOption) {
      selectOption(index);
    }
  };

  return (
    <TouchableOpacity style={styles.option_row} onPress={onPress}>
      <Img style={styles.radio} source={selected === true ? radioOn : radioOff} />
      <Text style={styles.option_text}>{option}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option_row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40
  },
  radio: {
    width: 20,
    height: 20,
    marginHorizontal: 20,
  },
  option_text: {
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor
  }
});

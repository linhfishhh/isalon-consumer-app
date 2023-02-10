import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import Colors from '../constants/Colors';

export default function TwoStateButton({
  style,
  textStyle,
  selected,
  title,
  onPress
}) {
  const innerStyle = {
    ...style,
    backgroundColor: selected ? Colors.newPriceTextColor : 'white',
  };
  const innerTextStyle = {
    ...textStyle,
    color: selected ? 'white' : Colors.newPriceTextColor,
  };
  return (
    <TouchableOpacity style={innerStyle} onPress={onPress}>
      <Text style={innerTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

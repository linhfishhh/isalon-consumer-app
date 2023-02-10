import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';
import Layout from '../constants/Layout';

type Props = {
  style?: Object,
  titleStyle?: Object,
  title: String,
  onPress: Function,
};

export default function TextButton({
  style, titleStyle, title, onPress
}: Props) {
  const buttonStyle = {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

TextButton.defaultProps = {
  style: {
    width: 25, height: 25
  },
  titleStyle: {
    ...Layout.font.normal
  }
};

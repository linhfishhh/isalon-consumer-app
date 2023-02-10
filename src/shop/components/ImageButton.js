import React from 'react';
import {
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  style?: Object,
  iconStyle: Object,
  source: Object,
  hitSlop?: Object,
  onPress: Object,
  resizeMode?: String,
};

export default function ImageButton({
  style, iconStyle, source, hitSlop, onPress, resizeMode
}: Props) {
  const newIconStyle = iconStyle || style;
  return (
    <TouchableOpacity style={style} hitSlop={hitSlop} onPress={onPress}>
      <FastImage style={newIconStyle} source={source} resizeMode={resizeMode} />
    </TouchableOpacity>
  );
}

ImageButton.defaultProps = {
  style: {
    width: 25, height: 25
  },
  hitSlop: {
    top: 5, left: 5, bottom: 5, right: 5
  },
  resizeMode: 'contain',
};

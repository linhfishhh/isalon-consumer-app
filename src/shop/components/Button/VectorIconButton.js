import React from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  style?: Object,
  hitSlop?: Object,
  onPress: Object,
  name: String,
  size: Object,
  color: String
};

export default function VectorIconButton({
  style, hitSlop, onPress, name, size, color
}: Props) {
  return (
    <TouchableOpacity
      style={{
        ...style,
        ...internalStyles.btn
      }}
      hitSlop={hitSlop}
      onPress={onPress}
    >
      <Icon name={name} color={color} size={size} />
    </TouchableOpacity>
  );
}

VectorIconButton.defaultProps = {
  style: {
    width: 25, height: 25
  },
  hitSlop: {
    top: 5, left: 5, bottom: 5, right: 5
  }
};

const internalStyles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

type Props = {
  style: Object,
  onPress: Function,
};

const hitSlop = {
  top: 10, left: 10, bottom: 10, right: 10
};

export default function ViewAllButton({ style, onPress }: Props) {
  const [viewAllStyle] = React.useState({
    ...styles.container,
    ...style
  });
  return (
    <TouchableOpacity
      style={viewAllStyle}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      <Text style={styles.text}>Tất cả</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.tintColor,
  },
  right_arrow: {
    marginLeft: 2,
    width: 6,
    height: 6
  }
});

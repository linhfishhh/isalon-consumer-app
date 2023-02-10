import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Colors from '../constants/Colors';

type Props = {
  height?: Number,
  marginLeft?: Number,
  color?: String,
};

export default function Separator({ height, marginLeft, color }: Props) {
  const styles = StyleSheet.create({
    separator: {
      backgroundColor: color,
      height,
      marginLeft,
    }
  });

  return (
    <View style={styles.separator} />
  );
}

Separator.defaultProps = {
  height: 5,
  marginLeft: 0,
  color: Colors.separatorColor,
};

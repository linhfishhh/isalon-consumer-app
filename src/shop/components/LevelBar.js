import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

type Props = {
  tintColor: String,
  trackColor: String,
};

export default function LevelBar({
  style, tintColor, trackColor, percent
}: Props) {
  const styles = StyleSheet.create({
    track: {
      ...style,
      backgroundColor: trackColor,
    },
    tint: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: tintColor,
      width: percent,
    },
  });
  return (
    <View style={styles.track}>
      <View style={styles.tint} />
    </View>
  );
}

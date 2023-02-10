import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

type Props = {};

export default function Space() {
  return (
    <View style={styles.space} />
  );
}

const styles = StyleSheet.create({
  space: {
    flex: 1
  }
});

export function FixedSpace({ size }: Props) {
  const style = StyleSheet.create({
    content: {
      width: size,
      height: size,
    }
  });
  return (
    <View style={style.content} />
  );
}

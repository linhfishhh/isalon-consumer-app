import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Layout from '../constants/Layout';

type Props = {
  title?: String,
  titleColor?: String,
  backgroundColor?: String,
  width?: Number,
  height?: Number,
};

export default function TagName({
  title,
  titleColor,
  backgroundColor,
  width,
  height,
}: Props) {
  const containerStyle = {
    ...styles.container,
    width,
    height,
    borderRadius: height / 2,
    backgroundColor,
  };
  const titleText = {
    ...styles.title_text,
    color: titleColor,
  };
  return (
    <View style={containerStyle}>
      <Text style={titleText}>{title}</Text>
    </View>
  );
}

TagName.defaultProps = {
  title: '',
  titleColor: 'white',
  backgroundColor: '#39b54a',
  width: 60,
  height: 24,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
  }
});

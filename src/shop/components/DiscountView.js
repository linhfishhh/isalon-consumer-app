import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Layout from '../constants/Layout';
import Img from './Img';

type Props = {
  style?: Object,
  source: Object,
  amount?: Number,
};

export default function DiscountView({ style, source, amount }: Props) {
  return (
    <View style={{
      ...styles.discount_holder,
      ...style
    }}
    >
      <Img
        source={source}
        style={{
          ...styles.discount_bg,
          width: style.width,
          height: style.height
        }}
      />
      <Text style={{
        ...styles.discount_text,
        fontSize: style.fontSize,
      }}
      >
        {`-${amount}%`}
      </Text>
    </View>
  );
}

DiscountView.defaultProps = {
  amount: 30,
  style: {
    width: 50,
    height: 28,
    fontSize: 16
  }
};

const styles = StyleSheet.create({
  discount_holder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  discount_bg: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  discount_text: {
    ...Layout.font.bold,
    color: 'white',
    textAlign: 'center',
  },
});

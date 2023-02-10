import React from 'react';
import ProductItemVertical from './ProductItemVertical';
import ProductItemHorizontal from './ProductItemHorizontal';

type Props = {
  style?: Object,
  horizontal?: Boolean,
  navigation: Object,
};

export default function ProductItem({
  style, product, horizontal, navigation
}: Props) {
  return (
    horizontal
      ? (
        <ProductItemHorizontal
          style={style}
          product={product}
          navigation={navigation}
        />
      )
      : (
        <ProductItemVertical
          style={style}
          product={product}
          navigation={navigation}
        />
      )
  );
}

ProductItem.defaultProps = {
  style: {
    width: 130,
    height: 160,
  },
  horizontal: false,
};

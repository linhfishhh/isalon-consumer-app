import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import ImageButton from '../../components/ImageButton';
import styles from './styles';
import CartToolbarItem from '../../components/CartToolbarItem';
import icBack from '../../../assets/images/shop/ic_back_white.png';
import icHeart from '../../../assets/images/shop/ic_heart_button.png';
import icHeartSelected from '../../../assets/images/shop/ic_heart_button_selected.png';
import icMore from '../../../assets/images/shop/ic_more_menu.png';

export default function OverlayNavigationBar({ product }) {
  return (
    <View style={internalStyles.container}>
      <View style={styles.nav}>
        <ImageButton
          style={internalStyles.button_style}
          iconStyle={styles.back_button}
          source={icBack}
        />
        <View style={styles.space} />
        <ImageButton
          style={internalStyles.button_style}
          iconStyle={styles.heart_button}
          source={_.get(product, 'isFavorite', false) ? icHeartSelected : icHeart}
        />
        <CartToolbarItem style={internalStyles.overlay_cart_item} />
        <ImageButton
          style={internalStyles.button_style}
          iconStyle={styles.more_button}
          source={icMore}
        />
      </View>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button_style: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0000004C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay_cart_item: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0000004C',
    marginLeft: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

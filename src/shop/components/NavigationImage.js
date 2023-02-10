import React from 'react';
import {
  ImageBackground, StyleSheet
} from 'react-native';
import Layout from '../constants/Layout';
import navBg from '../../assets/images/shop/bg_nav.png';

export default function NavigationImage() {
  return (
    <ImageBackground
      style={styles.nav_header_bg}
      source={navBg}
      resizeMethod="scale"
      resizeMode="stretch"
    />
  );
}

const styles = StyleSheet.create({
  nav_header_bg: {
    height: 195 * (Layout.window.width / 375.0),
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
});

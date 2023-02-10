import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Img from '../Img';
import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';
import icCartButton from '../../../assets/images/shop/ic_cart_button.png';

type Props = {};

function CartToolbarItem({ style, quantity, navigation }: Props) {
  const onPress = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      navigation.push('MyCartScreen');
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View style={styles.container}>
        <Img source={icCartButton} style={styles.cart_img} />
        {quantity > 0 ? (
          <View style={styles.cart_count_holder}>
            <Text style={styles.cart_count_text}>{quantity}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

CartToolbarItem.defaultProps = {
  quantity: 0,
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cart_img: {
    width: 25, height: 25,
  },
  cart_count_holder: {
    backgroundColor: '#21232C',
    borderColor: 'white',
    borderWidth: 1,
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 4,
    left: 10,
  },
  cart_count_text: {
    ...Layout.font.normal,
    fontSize: 10,
    color: 'white',
  }
});

export default connect(
  (state) => ({
    quantity: state.shopCart.quantity,
  }), {}
)(CartToolbarItem);

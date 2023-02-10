import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Img from '../../components/Img';
import icCart from '../../../assets/images/shop/ic_my_cart_button.png';

type Props = {

};

function MyCartButton({ style, quantity, navigation }: Props) {
  const buttonStyle = {
    ...styles.root,
    ...style
  };

  const onPress = () => {
    navigation.push('MyCartScreen');
  };

  return (
    <View style={buttonStyle}>
      {quantity > 0 ? (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <Img source={icCart} style={styles.cart_img} />
          <View style={styles.cart_count_holder}>
            <Text style={styles.cart_count_text}>{quantity}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

MyCartButton.defaultProps = {
  quantity: 0,
};

const styles = StyleSheet.create({
  root: {
    width: 44, height: 44,
  },
  container: {
    width: 44,
    height: 44,
    backgroundColor: '#00A69C',
    borderRadius: 22,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cart_img: {
    width: 44, height: 44,
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
    top: 8,
    left: 18,
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
  }),
  {}
)(MyCartButton);

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import AppLink from 'react-native-app-link';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import styles from './styles';
import Img from '../../components/Img';
import Space from '../../components/Space';
import { isAuthenticated } from '../../utils/auth';
import NavigationService from '../../../NavigationService';
import icChat from '../../../assets/images/shop/ic_chat.png';

type Props = {};

function Footer(props: Props) {
  const {
    product,
    productDetails,
    onBuyNow,
    onAddToCart,
    onRequestLogin
  } = props;

  const productId = _.get(product, 'productId', -1);
  const selectedVariant = _.get(productDetails, `${productId}.selectedVariant`);
  const productQuantity = _.get(productDetails, `${productId}.quantity`, 1);

  const buyNow = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      const cartItem = {
        cartItemId: 0,
        product,
        productVariant: selectedVariant,
        quantity: productQuantity,
      };
      if (onBuyNow) {
        onBuyNow(cartItem);
      }
    } else if (onRequestLogin) {
      onRequestLogin();
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const addToCart = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      let payload = {
        productId: product.productId,
        quantity: productQuantity,
      };
      if (selectedVariant) {
        payload = {
          ...payload,
          productVariantId: selectedVariant.productVariantId,
        };
      }
      if (onAddToCart) {
        onAddToCart(payload);
      }
    } else if (onRequestLogin) {
      onRequestLogin();
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const onChat = React.useCallback(() => {
    AppLink.maybeOpenURL('fb-messenger://user-thread/941543739381495', {
      appName: 'Messenger',
      appStoreId: '454638411',
      appStoreLocale: 'vi-VN',
      playStoreId: 'com.facebook.orca'
    }).then(() => {
      // do stuff
    }).catch(() => {
      // TODO
    });
  }, []);

  return (
    <View style={styles.buy_product_container}>
      <TouchableOpacity style={internalStyles.chat_button} onPress={onChat}>
        <Img style={internalStyles.chat_icon} source={icChat} />
        <Text style={internalStyles.chat_text}>Chat</Text>
      </TouchableOpacity>
      <Space />
      <TouchableOpacity style={internalStyles.buy_button} onPress={buyNow}>
        <Text style={internalStyles.buy_text}>Mua ngay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={internalStyles.add_to_cart_button} onPress={addToCart}>
        <Text style={internalStyles.add_to_cart_text} numberOfLines={2}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  chat_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  chat_icon: {
    width: 24, height: 24
  },
  chat_text: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    marginLeft: 8
  },
  buy_button: {
    backgroundColor: '#ff5c39',
    borderRadius: 3,
    width: 102,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buy_text: {
    ...Layout.font.bold,
    fontSize: 13,
    color: 'white'
  },
  add_to_cart_button: {
    backgroundColor: '#f6921e',
    borderRadius: 3,
    width: 102,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add_to_cart_text: {
    ...Layout.font.bold,
    fontSize: 13,
    color: 'white',
    width: 80,
    textAlign: 'center'
  }
});

const FooterWrapper = React.memo(Footer);

export default connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
  })
)(FooterWrapper);

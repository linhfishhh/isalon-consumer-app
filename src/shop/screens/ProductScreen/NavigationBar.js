import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import Menu, { MenuItem } from 'react-native-material-menu';
import ImageButton from '../../components/ImageButton';
import styles from './styles';
import CartToolbarItem from '../../components/CartToolbarItem';
import navBg from '../../../assets/images/shop/bg_nav.png';
import icBack from '../../../assets/images/shop/ic_back_white.png';
import icHeart from '../../../assets/images/shop/ic_heart_button.png';
import icHeartSelected from '../../../assets/images/shop/ic_heart_button_selected.png';
import icMore from '../../../assets/images/shop/ic_more_menu.png';
import { getImageUrl } from '../../utils';
import {
  updateProductFavorite as updateProductFavoriteAction
} from '../../redux/product/actions';
import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';

type Props = {
  navigation: Object,
  productId: Number,
  productDetails: Object,
  updateProductFavorite: Function,
};

const backHitSlop = {
  top: 10, left: 10, right: 10, bottom: 10
};

function NavigationBar({
  navigation,
  productId,
  productDetails,
  updateProductFavorite
}: Props) {
  const product = _.get(productDetails, `${productId}.detail`);
  const menuRef = React.useRef(null);

  const onBack = () => {
    navigation.goBack();
  };

  const onHome = () => {
    menuRef.current.hide();
    navigation.popToTop();
  };

  const onSearch = () => {
    menuRef.current.hide();
    navigation.push('SearchScreen');
  };

  const onShare = () => {
    menuRef.current.hide();
    // const options = {
    //   title: _.get(product, 'name'),
    //   message: _.get(product, 'name'),
    //   url: getImageUrl(_.get(product, 'mainImageId')),
    //   social: Share.Social.FACEBOOK,
    // };
    // Share.open(options)
    //   .then(() => {})
    //   .catch(() => {});
    const fileUrl = getImageUrl(_.get(product, 'mainImageId'));
    let filePath = null;
    const configOptions = { fileCache: true };
    RNFetchBlob.config(configOptions)
      .fetch('GET', fileUrl)
      .then((resp) => {
        filePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        const shareData = `data:image/jpeg;base64,${base64Data}`;
        await Share.open({
          title: _.get(product, 'name'),
          message: _.get(product, 'name'),
          url: shareData
        });
        // remove the image or pdf from device's storage
        await RNFS.unlink(filePath);
      });
  };

  const onShowMoreMenu = () => {
    menuRef.current.show();
  };

  const onFavorite = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      if (product) {
        const favorited = _.get(product, 'isFavorite', false);
        updateProductFavorite(product.productId, !favorited);
      }
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  return (
    <View style={internalStyles.container}>
      <ImageBackground
        style={internalStyles.nav_header_bg}
        source={navBg}
        resizeMethod="scale"
        resizeMode="stretch"
      />
      <View style={styles.nav}>
        <ImageButton
          style={internalStyles.button_style}
          iconStyle={styles.back_button}
          source={icBack}
          hitSlop={backHitSlop}
          onPress={onBack}
        />
        <View style={styles.space} />
        <ImageButton
          style={internalStyles.button_style}
          iconStyle={styles.heart_button}
          source={_.get(product, 'isFavorite', false) ? icHeartSelected : icHeart}
          hitSlop={backHitSlop}
          onPress={onFavorite}
        />
        <CartToolbarItem style={styles.cart_button} navigation={navigation} />
        <View style={internalStyles.more_container_style}>
          <Menu
            ref={menuRef}
            button={(
              <ImageButton
                style={internalStyles.button_style}
                iconStyle={styles.more_button}
                source={icMore}
                hitSlop={backHitSlop}
                onPress={onShowMoreMenu}
              />
            )}
          >
            <MenuItem onPress={onHome}>Trang chủ</MenuItem>
            <MenuItem onPress={onSearch}>Tìm kiếm</MenuItem>
            <MenuItem onPress={onShare}>Chia sẻ</MenuItem>
          </Menu>
        </View>
      </View>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  nav_header_bg: {
    height: 195,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  button_style: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more_container_style: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
  }), {
    updateProductFavorite: updateProductFavoriteAction,
  }
)(NavigationBar);

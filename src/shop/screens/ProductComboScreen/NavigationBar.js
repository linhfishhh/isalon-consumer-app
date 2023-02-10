import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Layout from '../../constants/Layout';
import ImageButton from '../../components/ImageButton';
import CartToolbarItem from '../../components/CartToolbarItem';
import icBack from '../../../assets/images/shop/ic_back_white.png';

type Props = {};

export default function NavigationBar({ navigation }: Props) {
  const backHitSlop = {
    top: 10, left: 10, right: 10, bottom: 10
  };

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={internalStyles.nav}>
      <ImageButton
        style={internalStyles.back_button}
        source={icBack}
        hitSlop={backHitSlop}
        onPress={onBack}
      />
      <View style={internalStyles.title_container}>
        <Text style={internalStyles.title} numberOfLines={1}>
          Mua 5 sản phẩm để được giảm giá 15% cho toàn bộ nhãn hàng Lakme
        </Text>
        <Text style={internalStyles.sub_title} numberOfLines={1}>
          Kết thúc trong 20 ngày 08:18:00
        </Text>
      </View>
      <CartToolbarItem />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  nav: {
    height: Layout.navigationBarHeight,
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    marginBottom: 5,
    alignItems: 'center'
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
  title_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: 'white',
    marginLeft: 8,
    width: Layout.window.width - 120,
    textAlign: 'center',
  },
  sub_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: 'white',
    marginLeft: 8,
    width: Layout.window.width - 120,
    textAlign: 'center',
  }
});

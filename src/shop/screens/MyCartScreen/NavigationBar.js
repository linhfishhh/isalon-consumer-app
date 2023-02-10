import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import ImageButton from '../../components/ImageButton';
import TextButton from '../../components/TextButton';
import styles from './styles';
import Space from '../../components/Space';
import WAAlert from '../../../components/WAAlert';
import {
  deleteCartItems as deleteCartItemsAction,
} from '../../redux/cart/actions';
import icBack from '../../../assets/images/shop/ic_back_white.png';

type Props = {};

const backHitSlop = {
  top: 10, left: 10, right: 10, bottom: 10
};

function NavigationBar({
  navigation,
  cart,
  deleteCartItems
}: Props) {
  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [selectedCartItems, setSelectedCartItems] = React.useState([]);

  React.useEffect(() => {
    const cartItems = _.get(cart, 'cartItems') || [];
    const items = [];
    cartItems.forEach((element) => {
      const cartDataItems = _.get(element, 'data') || [];
      cartDataItems.forEach((item) => {
        if (item.isSelected) {
          items.push(item);
        }
      });
    });
    setSelectedCartItems(items);
  }, [cart]);

  const onDeletePress = () => {
    setConfirmDelete(true);
  };

  const onDismissModal = () => {
    if (isDelete) {
      const ids = _.map(selectedCartItems, 'cartItemId').join(',');
      if (ids && ids.length > 0) {
        deleteCartItems(ids);
      }
      setIsDelete(false);
    }
  };

  const onConfirmDelete = () => {
    setConfirmDelete(false);
    setIsDelete(true);
  };

  const onCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <View style={styles.nav}>
      <ImageButton
        style={styles.back_button}
        source={icBack}
        hitSlop={backHitSlop}
        onPress={onBack}
      />
      <Text style={internalStyles.title}>Giỏ hàng của tôi</Text>
      <Space />
      {!_.isEmpty(selectedCartItems) ? (
        <TextButton
          style={internalStyles.edit_button}
          titleStyle={internalStyles.edit_button_title}
          title="Xóa"
          onPress={onDeletePress}
        />
      ) : null}
      <WAAlert
        show={confirmDelete}
        title="Xoá khỏi giỏ hàng"
        question="Bạn có muốn xoá sản phẩm này?"
        titleFirst
        yes={onConfirmDelete}
        no={onCancelDelete}
        yesTitle="Xoá"
        noTitle="Huỷ"
        onDismiss={onDismissModal}
      />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  edit_button: {

  },
  edit_button_title: {
    ...Layout.font.normal,
    color: 'white',
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: 'white',
    marginLeft: 25,
  }
});

export default connect(
  (state) => ({
    cart: state.shopCart.cart,
  }),
  {
    deleteCartItems: deleteCartItemsAction
  }
)(NavigationBar);

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import WAButton from '../../../components/WAButton';
import Img from '../../components/Img';
import shopping from '../../../assets/images/shop/ic_oh_shopping.png';
import card from '../../../assets/images/shop/ic_oh_card.png';
import shipping from '../../../assets/images/shop/ic_oh_shipping.png';

const dataEmptyView = (orderStatus) => {
  switch (orderStatus) {
    case 'pending':
      return {
        icon: shipping,
        title: 'Không có đơn hàng nào chờ thanh toán'
      };
    case 'paid':
      return {
        icon: card,
        title: 'Không có đơn hàng nào đã thanh toán'
      };
    case 'cancel':
      return {
        icon: shopping,
        title: 'Không có đơn hàng nào đã huỷ'
      };
    default:
      return {
        icon: shopping,
        title: 'Bạn chưa mua hàng tại isalon'
      };
  }
};

function OrderEmpty(props) {
  const { orderStatus, navigation, updateTabIndex } = props;

  const data = dataEmptyView(orderStatus);

  const onContinue = () => {
    updateTabIndex(2);
    navigation.popToTop();
  };

  return (
    <View style={Styles.emptyView}>
      <View style={Styles.grayView}>
        <Img source={data.icon} style={Styles.icon} />
      </View>
      <View style={Styles.lightView}>
        <Text style={Styles.title}>{data.title}</Text>
        <WAButton text="TIẾP TỤC MUA SẮM" style={Styles.button} onPress={onContinue} />
      </View>
    </View>
  );
}

OrderEmpty.propTypes = {
  orderStatus: PropTypes.string
};

OrderEmpty.defaultProps = {
  orderStatus: '',
};

export default OrderEmpty;

const Styles = StyleSheet.create({
  emptyView: {
    alignItems: 'stretch',
    flex: 1
  },
  grayView: {
    flex: 1,
    backgroundColor: Colors.searchFieldColor,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  icon: {
    marginTop: 10,
    width: 120,
    height: 120,
    bottom: -40
  },
  lightView: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  title: {
    fontFamily: Layout.font.medium.fontFamily,
    color: '#A6A8AB',
    fontSize: Layout.fontSize,
    marginTop: 70
  },
  button: {
    fontFamily: Layout.font.bold.fontFamily,
    color: Colors.LIGHT,
    marginTop: 30,
    fontSize: 15,
    borderRadius: 3,
    height: 45,
    fontWeight: 'bold'
  }
});

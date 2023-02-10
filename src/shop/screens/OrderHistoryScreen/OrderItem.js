import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Colors from '../../../styles/Colors';
import Img from '../../components/Img';
import Layout from '../../constants/Layout';
import { formatCurrency, datetimeFormat } from '../../utils';
import OrderProduct from './OrderProduct';
import delivered from '../../../assets/images/shop/ic_oh_delivered.png';
import progress from '../../../assets/images/shop/ic_oh_progress.png';

function setOrderStatus(status) {
  let color = Colors.SILVER;
  let text = '';
  let background = '';
  switch (status) {
    case 'USER_CANCEL':
    case 'MANAGER_CANCEL':
      color = '#EC1C24';
      text = 'Đã huỷ';
      background = Colors.LIGHT;
      break;
    case 'SHIP_FAILED':
      color = '#F05D3E';
      text = 'Giao hàng thất bại';
      background = Colors.LIGHT;
      break;
    case 'RETURN':
      color = Colors.SILVER;
      text = 'Trả lại hàng';
      background = Colors.LIGHT;
      break;
    case 'UNCONFIRMED':
      color = Colors.SILVER;
      text = 'Đang xử lý';
      background = Colors.LIGHT;
      break;
    case 'CONFIRMED':
    case 'SHIPPING':
      color = Colors.PRIMARY;
      text = 'Chờ vận chuyển';
      background = Colors.LIGHT;
      break;
    case 'SHIP_SUCCESS':
    case 'DONE':
      color = Colors.LIGHT;
      text = 'Đã thanh toán';
      background = '#39B54A';
      break;
    default: break;
  }
  return { text, color, background };
}

function getShippingStatus(status) {
  let color = '';
  let text = '';
  let icon;
  switch (status) {
    case 'SHIPPING':
      color = '#F05D3E';
      text = 'Đang giao hàng';
      icon = progress;
      break;
    case 'SHIP_SUCCESS':
    case 'DONE':
      color = '#F05D3E';
      text = 'Đã giao hàng';
      icon = delivered;
      break;
    default: break;
  }
  return { text, color, icon };
}

function OrderItem(props) {
  const { data, navigation, onCancel } = props;

  const orderStatus = setOrderStatus(data.status);
  const shippingStatus = getShippingStatus(data.status);

  const totalQuantity = data.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const allowCancelOrder = data.status === 'UNCONFIRMED' || data.status === 'CONFIRMED';

  return (
    <View style={Styles.orderInfo}>
      <View style={Styles.item}>
        <View style={Styles.titleWrapper}>
          <Text style={Styles.orderIdLabel}>Mã đơn hàng:</Text>
          <Text style={Styles.orderIdText}>{`#${data.orderId}`}</Text>
        </View>
        <View style={Styles.subTitleWrapper}>
          <View style={Styles.orderDate}>
            <Text style={Styles.dateText}>
              {`Ngày đặt hàng: ${datetimeFormat(data.createdAt)}`}
            </Text>
            {data.shippedAt && (
              <Text style={Styles.dateText}>
                {`Đã thanh toán: ${datetimeFormat(data.shippedAt)}`}
              </Text>
            )}
          </View>
          <View style={Styles.orderStatus}>
            <Text
              style={[
                {
                  color: orderStatus.color,
                  backgroundColor: orderStatus.background
                },
                Styles.orderStatusText
              ]}
            >
              {orderStatus.text}
            </Text>
          </View>
        </View>
        <View style={Styles.productList}>
          <OrderProduct data={data.items} navigation={navigation} />
        </View>
        <View style={Styles.orderTotal}>
          <View style={Styles.shippingStatus}>
            {shippingStatus.icon && (
              <>
                <Img source={shippingStatus.icon} style={Styles.shippingStatusIcon} />
                <Text
                  style={[Styles.shippingStatusText, { color: shippingStatus.color }]}
                >
                  {shippingStatus.text}
                </Text>
              </>
            )}
          </View>
          <View style={Styles.total}>
            <Text
              style={Styles.totalQuantity}
            >
              {`${totalQuantity} sản phẩm, tổng cộng: `}
            </Text>
            <Text style={Styles.totalPrice}>{formatCurrency(data.total)}</Text>
          </View>
        </View>
      </View>
      { allowCancelOrder && (
        <View style={Styles.cancel_wrapper}>
          <TouchableOpacity style={Styles.cancel_button} onPress={() => onCancel(data)}>
            <Text style={Styles.cancel_text}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default OrderItem;

const Styles = StyleSheet.create({
  orderInfo: {
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 5,
  },
  item: {
    paddingTop: 20,
    paddingBottom: 45,
    paddingLeft: 30,
    paddingRight: 30
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  orderIdLabel: {
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.DARK,
    fontSize: 19,
    marginRight: 5
  },
  orderIdText: {
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.PRIMARY,
    fontSize: 19
  },
  subTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderDate: {
    flex: 2
  },
  dateText: {
    fontFamily: Layout.font.normal.fontFamily,
    color: Colors.SILVER,
    fontSize: 13
  },
  orderStatus: {
    flex: 1,
    alignItems: 'flex-end'
  },
  orderStatusText: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontFamily: Layout.font.normal.fontFamily,
    fontSize: 11,
    overflow: 'hidden'
  },
  productList: {
    alignItems: 'center'
  },
  orderTotal: {
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 20,
    right: 30
  },
  shippingStatus: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5
  },
  shippingStatusIcon: {
    width: 20,
    height: 12,
    marginRight: 5
  },
  shippingStatusText: {
    fontFamily: Layout.font.medium.fontFamily,
    fontSize: 11
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  totalQuantity: {
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.DARK,
    fontSize: Layout.fontSize
  },
  totalPrice: {
    fontFamily: Layout.font.medium.fontFamily,
    color: Colors.PRIMARY,
    fontSize: Layout.fontSize
  },
  cancel_wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  cancel_button: {
    borderRadius: 3,
    borderWidth: 1,
    width: 80,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#A6A8AB',
  },
  cancel_text: {
    ...Layout.font.bold,
    fontSize: 15,
    color: '#A6A8AB',
  },
});

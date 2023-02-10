import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { formatCurrency } from '../../utils';
import icApply from '../../../assets/images/shop/ic_voucher_apply_button.png';

type Props = {
  item: Object,
};

moment.locale('vi');

export default function VoucherItem({ item, onPress }: Props) {
  const onPressItem = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const cash = _.get(item, 'giftPackage.cash');
  const percent = _.get(item, 'giftPackage.percent');
  const appliedCash = _.get(item, 'giftPackage.appliedCash');
  const maxCash = _.get(item, 'giftPackage.maxCash');
  const startAt = _.get(item, 'giftPackage.startAt');
  const expireAt = _.get(item, 'giftPackage.expiredAt');
  const { code } = item;

  let msg = 'Giảm giá';
  let amount = '';
  if (cash) {
    msg += ` ${formatCurrency(cash)}`;
    amount = formatCurrency(cash);
  } else if (percent) {
    amount = `${percent}%`;
    msg += ` ${amount}`;
  }
  if (appliedCash) {
    msg += ` cho đơn hàng từ ${formatCurrency(appliedCash)}`;
  }
  if (maxCash) {
    msg += ` , tối đa ${formatCurrency(maxCash)}`;
  }

  const startDate = moment(startAt, 'YYYY-MM-DD HH:mm::ss').format('DD/MM');
  const endDate = moment(expireAt, 'YYYY-MM-DD HH:mm::ss').format('DD/MM/YYYY');

  const duration = `Từ ${startDate} đến ${endDate}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item_container} onPress={onPressItem}>
        <View style={styles.voucher_code}>
          <Text style={styles.voucher_text}>{code}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.desc_container}>
          <Text style={styles.desc_text}>{msg}</Text>
          <Text style={styles.time_text}>{duration}</Text>
        </View>
        <ImageBackground
          style={styles.apply_container}
          source={icApply}
          resizeMode="stretch"
        >
          <Text style={cash ? styles.amount_text : styles.percent_text}>{amount}</Text>
          <Text style={styles.apply_text}>ÁP DỤNG</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item_container: {
    backgroundColor: 'white',
    borderRadius: 4,
    // overflow: 'hidden',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  voucher_code: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
  },
  voucher_text: {
    ...Layout.font.bold,
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor,
  },
  separator: {
    width: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.itemTextColor,
  },
  desc_container: {
    width: Layout.window.width - 200,
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  desc_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor,
  },
  time_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: '#969696',
  },
  apply_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  percent_text: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: 'white',
    marginLeft: 5,
    width: 70,
    textAlign: 'center',
  },
  amount_text: {
    ...Layout.font.bold,
    fontSize: Layout.smallFontSize,
    color: 'white',
    marginLeft: 5,
    width: 70,
    textAlign: 'center',
  },
  apply_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: 'white',
  }
});

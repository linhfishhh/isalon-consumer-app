import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import styles from './styles';
import Img from '../../components/Img';
import Space from '../../components/Space';
import VoucherScreen from '../VoucherScreen';
import Separator from '../../components/Separator';
import icRight from '../../../assets/images/shop/ic_right_arrow_accessory.png';
import { formatCurrency } from '../../utils';

export default class DiscountCode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      voucherCode: undefined
    };
  }

  setChooserRef = (ref) => {
    if (ref) {
      this.voucherRef = ref.getWrappedInstance();
    }
  }

  openVoucherScreen = () => {
    this.voucherRef.show();
  };

  onSelectVoucher = (voucher) => {
    const cash = _.get(voucher, 'giftPackage.cash');
    const percent = _.get(voucher, 'giftPackage.percent');
    let msg = 'Giảm';
    if (cash) {
      msg += ` ${formatCurrency(cash)}`;
    } else if (percent) {
      msg += ` ${percent}%`;
    }
    this.setState({
      voucherCode: msg
    });
    const { didSelectVoucher } = this.props;
    if (didSelectVoucher) {
      didSelectVoucher(voucher);
    }
  };

  render() {
    const { voucherCode } = this.state;
    return (
      <TouchableOpacity
        style={styles.discount_code_container}
        onPress={this.openVoucherScreen}
      >
        <View style={styles.discount_code}>
          <Text style={internalStyles.title}>Mã giảm giá</Text>
          {voucherCode ? (
            <View style={internalStyles.value_container}>
              <Text style={internalStyles.value}>{voucherCode}</Text>
            </View>
          ) : null}
          <Space />
          <Img style={internalStyles.right_arrow} source={icRight} />
        </View>
        <Separator />
        <VoucherScreen
          ref={this.setChooserRef}
          title="Mã giảm giá"
          didSelectVoucher={this.onSelectVoucher}
        />
      </TouchableOpacity>
    );
  }
}

const internalStyles = StyleSheet.create({
  title: {
    ...Layout.font.medium,
    fontSize: Layout.sectionFontSize,
    color: Colors.sectionTextColor,
    marginLeft: 25,
  },
  value_container: {
    height: 30,
    marginLeft: 25,
    borderColor: Colors.newPriceTextColor,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...Layout.font.medium,
    color: Colors.newPriceTextColor,
    marginLeft: 10,
    marginRight: 10
  },
  right_arrow: {
    marginRight: 25,
    width: 8,
    height: 14,
  },
});

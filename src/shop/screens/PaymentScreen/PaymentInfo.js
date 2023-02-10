import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Layout, Colors } from '../../constants';
import Separator from '../../components/Separator';
import VoucherScreen from '../VoucherScreen';
import {
  formatCurrency
} from '../../utils';
import { FixedSpace } from '../../components/Space';

class PaymentInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const { voucher } = this.props;
    this.state = {
      voucher: _.get(voucher, 'code', ''),
    };
  }

  setChooserRef = (ref) => {
    if (ref) {
      this.voucherRef = ref.getWrappedInstance();
    }
  }

  openVoucherScreen = () => {
    this.voucherRef.show();
  }

  onGiftcodeChange = (text) => {
    this.setState({
      voucher: text
    });
    const { onGiftcodeChanged } = this.props;
    if (onGiftcodeChanged) {
      onGiftcodeChanged(text);
    }
  }

  didSelectVoucher = (voucher) => {
    this.setState({
      voucher: voucher.code
    });
  }

  onApplyVoucher = () => {
    const { onApplyGiftCode } = this.props;
    const { voucher } = this.state;
    onApplyGiftCode(voucher);
  };

  onDidChangeGiftCode = () => {
    const { voucher } = this.state;
    const { orderInfo } = this.props;
    if (_.isEmpty(voucher) && orderInfo.discount > 0) {
      this.onApplyVoucher();
    }
  }


  render() {
    const { orderInfo } = this.props;
    const { voucher } = this.state;
    const disabledApply = _.isEmpty(voucher);
    const discount = _.get(orderInfo, 'discount');

    return (
      <View
        style={internalStyles.container}
        behavior="padding"
        enabled
      >
        <View style={internalStyles.row}>
          <Text style={internalStyles.title_text}>Tạm tính</Text>
          <Text style={internalStyles.amount_text}>{formatCurrency(_.get(orderInfo, 'subTotal'))}</Text>
        </View>
        <View style={internalStyles.row}>
          <Text style={internalStyles.title_text}>Phí giao hàng</Text>
          <Text style={internalStyles.amount_text}>{formatCurrency(_.get(orderInfo, 'shippingFee'))}</Text>
        </View>
        <View style={internalStyles.row}>
          <TextInput
            style={internalStyles.text_input}
            placeholder="Nhập mã giảm giá"
            multiline={false}
            value={voucher}
            onChangeText={this.onGiftcodeChange}
            onBlur={this.onDidChangeGiftCode}
          />
          <TouchableOpacity style={internalStyles.button} onPress={this.openVoucherScreen}>
            <Text style={internalStyles.button_title}>Tìm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disabledApply}
            style={[internalStyles.button, disabledApply && internalStyles.buttonDisabled]}
            onPress={this.onApplyVoucher}
          >
            <Text style={internalStyles.button_title}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
        {discount > 0 && (
        <View style={internalStyles.row}>
          <Text style={internalStyles.title_text}>Giảm giá</Text>
          <Text style={internalStyles.amount_text}>{formatCurrency(discount)}</Text>
        </View>
        )}
        <Separator height={1} />
        <FixedSpace size={5} />
        <View style={internalStyles.row}>
          <Text style={internalStyles.title_text}>Tổng cộng</Text>
          <View style={internalStyles.total_amount_container}>
            <Text style={internalStyles.amount_text}>{formatCurrency(_.get(orderInfo, 'total'))}</Text>
            <Text style={internalStyles.vat_info}>Đã bao gồm VAT</Text>
          </View>
        </View>
        <VoucherScreen
          ref={this.setChooserRef}
          title="Mã giảm giá"
          didSelectVoucher={this.didSelectVoucher}
        />
      </View>
    );
  }
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title_text: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
  },
  amount_text: {
    ...Layout.font.bold,
    color: Colors.tintColor,
  },
  text_input: {
    flex: 1,
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    height: 40,
    backgroundColor: '#e6e6e6',
    borderRadius: 3,
    paddingLeft: 8,
    // textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disableColor,
  },
  button: {
    height: 40,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    borderRadius: 3,
  },
  button_title: {
    ...Layout.font.bold,
    color: 'white',
  },
  total_amount_container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  vat_info: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
  }
});

export default connect(
  (state) => ({
    orderInfo: state.shopOrder.orderInfo,
  }),
  {}
)(PaymentInfo);

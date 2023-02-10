import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import Separator from '../../components/Separator';
import { Colors, CommonStyles, ErrorTypes } from '../../constants';
import ShipLocation from './ShipLocation';
import ShipMethod from './ShipMethod';
import ProductInfo from './ProductInfo';
import PaymentInfo from './PaymentInfo';
import PaymentMethod from './PaymentMethod';
import GradientButton from '../../components/Button/GradientButton';
import WAAlert from '../../../components/WAAlert';
import {
  prepay as prepayAction,
  payOrder as payOrderAction,
  updateErrors as updateErrorsAction,
} from '../../redux/order/actions';

import NavigationBar from '../../components/NavigationBar';

function PaymentScreen(props) {
  const {
    navigation,
    selectedAddress,
    fetching,
    errors,
    prepay,
    payOrder,
    updateErrors,
  } = props;

  // const cartItem = {
  //   product: product,
  //   productVariant: selectedProductVariant,
  //   quantity: 1,
  // }
  const cartItems = navigation.getParam('cartItems');
  const buyNow = navigation.getParam('buyNow') || false;
  const backScreen = navigation.getParam('backScreen');
  const voucher = navigation.getParam('voucher');

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const [billingInfo, setBillingInfo] = React.useState({
    shippingType: 'STANDARD',
    paymentType: 'CASH',
  });

  React.useEffect(() => {
    const giftCode = _.get(voucher, 'code');
    if (giftCode) {
      const bill = _.merge(billingInfo, { giftCode });
      setBillingInfo(bill);
    }
  }, []);

  React.useEffect(() => {
    if (!_.isEmpty(selectedAddress)) {
      const bill = _.merge(billingInfo, { addressId: selectedAddress.addressId });
      setBillingInfo(bill);
    } else {
      _.unset(billingInfo, 'addressId');
      setBillingInfo(billingInfo);
    }
    if (buyNow === true) {
      const items = [];
      cartItems.forEach((element) => {
        const obj = {
          productId: _.get(element, 'product.productId'),
          quantity: _.get(element, 'quantity'),
        };
        if (element.productVariant) {
          obj.productVariantId = _.get(element, 'productVariant.productVariantId');
        }
        items.push(obj);
      });
      _.unset(billingInfo, 'items');
      setBillingInfo(_.merge(billingInfo, { items }));
    } else {
      const cartItemIds = [];
      cartItems.forEach((element) => {
        if (element.cartItemId) {
          cartItemIds.push(element.cartItemId);
        }
      });
      _.unset(billingInfo, 'cartItemIds');
      setBillingInfo(_.merge(billingInfo, { cartItemIds }));
    }
    calculateBillingInfo();
  }, [selectedAddress]);

  // const onVATInfoChanged = React.useCallback((info) => {
  //   const bill = _.merge(billingInfo, info);
  //   setBillingInfo(bill);
  // }, []);

  const onApplyGiftCode = (giftCode) => {
    const bill = _.merge(billingInfo, { giftCode });
    if (_.isEmpty(giftCode)) {
      _.unset(bill, 'giftCode');
    }
    setBillingInfo(bill);
    calculateBillingInfo();
  };

  const onGiftcodeChanged = (giftCode) => {
    const bill = _.merge(billingInfo, { giftCode });
    if (_.isEmpty(giftCode)) {
      _.unset(bill, 'giftCode');
    }
    setBillingInfo(bill);
  };

  const validateOrder = () => {
    if (_.isEmpty(selectedAddress)) {
      return false;
    }
    return true;
  };

  const calculateBillingInfo = () => {
    prepay(billingInfo);
  };

  const onConfirmPayment = () => {
    if (validateOrder()) {
      payOrder(billingInfo, () => {
        navigation.push('ConfirmPaymentScreen', { backScreen });
      });
    } else {
      updateErrors([{
        type: ErrorTypes.internal,
        message: 'Vui lòng nhập địa chỉ nhận hàng!'
      }]);
    }
  };

  const clearErrors = React.useCallback(() => {
    updateErrors(undefined);
  }, []);

  const errs = _.filter(errors, (el) => el.type !== ErrorTypes.missingAddress);
  const hasError = !_.isEmpty(errs);
  const msg = hasError ? _.get(_.head(errs), 'message') : null;

  return (
    <MainContainer
      hasNavigationBackground={false}
      style={CommonStyles.main_container_white}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <Spinner
        visible={fetching}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.tintColor} size={10} count={3} />}
      />
      <NavigationBar
        title="Thanh toán"
        onClose={onBack}
      />
      <ScrollView style={styles.content}>
        <View>
          <ShipLocation navigation={navigation} />
          <Separator />
          <ShipMethod />
          <Separator />
          <ProductInfo cartItems={cartItems} navigation={navigation} />
          <Separator />
          <PaymentInfo
            onApplyGiftCode={onApplyGiftCode}
            onGiftcodeChanged={onGiftcodeChanged}
            voucher={voucher}
          />
          {/* <Separator /> */}
          {/* <RequestVat onChange={onVATInfoChanged}/> */}
          <PaymentMethod />
        </View>
      </ScrollView>
      <Separator height={0.5} />
      <View style={styles.purchase_group}>
        <GradientButton
          style={styles.ok_button}
          title="THANH TOÁN"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#f05a28', '#d91c5c']}
          titleStyle={styles.button_title}
          onPress={onConfirmPayment}
        />
      </View>
      <WAAlert
        show={hasError}
        title="iSalon"
        question={msg}
        titleFirst
        yes={clearErrors}
        no={false}
        yesTitle="Đóng"
      />
    </MainContainer>
  );
}

export default connect(
  (state) => ({
    fetching: state.shopOrder.fetching,
    selectedAddress: state.shopAddress.selectedShippingAddress,
    errors: state.shopOrder.errors,
  }),
  {
    prepay: prepayAction,
    payOrder: payOrderAction,
    updateErrors: updateErrorsAction,
  }
)(PaymentScreen);

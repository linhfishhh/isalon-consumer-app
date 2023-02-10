import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import Separator from '../../components/Separator';
import { Colors, CommonStyles } from '../../constants';
import ShipLocation from './ShipLocation';
import ShipMethod from './ShipMethod';
import PaymentMethod from './PaymentMethod';
import ProductInfo from './ProductInfo';
import PaymentInfo from './PaymentInfo';
import { GradientButton, VectorIconButton } from '../../components/Button';
import OrderCode from './OrderCode';

import { getCartQuantity as getCartQuantityAction } from '../../redux/cart/actions';


function ConfirmPaymentScreen(props) {
  const {
    navigation,
    fetching,
    orderInfo,
    getCartQuantity
  } = props;

  const backScreen = navigation.getParam('backScreen');

  const onBack = () => {
    if (backScreen) {
      navigation.dispatch({
        routeName: backScreen,
        type: 'GoToRoute',
      });
    } else {
      navigation.popToTop();
    }
  };

  React.useEffect(() => {
    getCartQuantity();
    const handleBackKeyPress = () => {
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackKeyPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  const onContinue = () => {
    navigation.popToTop();
  };

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
      <View style={styles.header} zIndex={1000}>
        <VectorIconButton name="close" color="#231f20" size={20} onPress={onBack} style={styles.back_button} />
        <View style={styles.header_text_container}>
          <Text style={styles.title} numberOfLines={1}>Đặt hàng thành công</Text>
          <Text style={styles.subtitle}>iSalon cảm ơn bạn đã đặt hàng</Text>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <OrderCode orderInfo={orderInfo} />
        <Separator />
        <ShipLocation orderInfo={orderInfo} />
        <Separator />
        <ShipMethod orderInfo={orderInfo} />
        <Separator />
        <PaymentMethod />
        <Separator />
        <ProductInfo cartItems={orderInfo.items} />
        <Separator />
        <PaymentInfo orderInfo={orderInfo} />
        <View style={styles.share_group}>
          <GradientButton
            style={styles.continue_button}
            title="TIẾP TỤC MUA SẮM"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#f05a28', '#d91c5c']}
            titleStyle={styles.button_title}
            onPress={onContinue}
          />
        </View>
      </ScrollView>
    </MainContainer>
  );
}

export default connect(
  (state) => ({
    fetching: state.shopOrder.fetching,
    orderInfo: state.shopOrder.orderInfo,
  }),
  {
    getCartQuantity: getCartQuantityAction
  }
)(ConfirmPaymentScreen);

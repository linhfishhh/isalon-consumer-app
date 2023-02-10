import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';

import GlobalStyles from '../../../styles/GlobalStyles';
import Colors from '../../../styles/Colors';
import Layout from '../../constants/Layout';
import PageContainer from '../../../components/PageContainer';

import {
  getOrderHistory as getOrderHistoryAction,
  cancelOrders as cancelOrdersAction
} from '../../redux/orderHistory/actions';
import { updateTabIndex as updateTabIndexAction } from '../../../redux/home/actions';

import OrderList from './OrderList';
import OrderCancel from './OrderCancel';

const tabList = [
  {
    key: 'all',
    title: 'Tất cả'
  },
  {
    key: 'pending',
    title: 'Chờ vận chuyển',
    orderStatus: 'WAIT_FOR_SHIPPING'
  },
  {
    key: 'paid',
    title: 'Đã thanh toán',
    orderStatus: 'PAY_SUCCESS'

  },
  {
    key: 'cancel',
    title: 'Huỷ',
    orderStatus: 'CANCELLED'
  }
];

function OrderHistoryScreen(props) {
  const {
    navigation,
    getOrderHistory,
    orderHistory,
    updateTabIndex,
    cancelOrders
  } = props;

  const [dataTabList, setDataTabList] = useState({ index: 0, routes: tabList });
  const [orderId, setOrderId] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [progress, setProgress] = useState(false);

  const renderTabBar = (tabProps) => (
    <TabBar
      jumpTo={tabProps.jumpTo}
      layout={tabProps.layout}
      navigationState={tabProps.navigationState}
      position={tabProps.position}
      style={Styles.tabbar}
      tabStyle={Styles.tab}
      labelStyle={Styles.tabLabel}
      indicatorStyle={Styles.indicator}
      scrollEnabled
    />
  );

  const openCancelOrderScreen = (order) => {
    setShowDialog(true);
    setOrderId(order.orderId);
  };

  const closeDialogAction = () => {
    setShowDialog(false);
  };

  const agreeDialogAction = (reason) => {
    closeDialogAction();
    setProgress(true);
    const dataKey = dataTabList.routes[dataTabList.index].key;
    cancelOrders({ orderId, note: reason }, dataKey, () => {
      setProgress(false);
    });
  };


  const renderScene = ({ route }) => (
    <OrderList
      dataKey={route.key}
      orderStatus={route.orderStatus}
      data={orderHistory[route.key]}
      getOrderHistory={getOrderHistory}
      navigation={navigation}
      updateTabIndex={updateTabIndex}
      onCancel={openCancelOrderScreen}
    />
  );

  const onChangeTab = (index) => {
    setDataTabList({ ...dataTabList, index });
  };

  return (
    <>
      <Spinner
        visible={progress}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.PRIMARY} size={10} count={3} />}
      />
      <PageContainer
        darkTheme
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={navigation}
        backgroundColor={Colors.LIGHT}
        navigationClose={false}
        navigationButtonStyle={Styles.closeButton}
        headerContainerStyle={Styles.header}
        headerTitleStyle={Styles.headerTitle}
        headerTitle="Lịch sử mua hàng"
        layoutPadding={20}
        keyboardAvoid={false}
      >

        <TabView
          navigationState={dataTabList}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={onChangeTab}
          useNativeDriver
          lazy
        />
        <OrderCancel
          open={showDialog}
          title="Lý do huỷ đơn đặt hàng"
          onAgree={agreeDialogAction}
          onClose={closeDialogAction}
        />
      </PageContainer>
    </>
  );
}

export default connect(
  (state) => ({
    orderHistory: state.shopOrderHistory
  }),
  {
    getOrderHistory: getOrderHistoryAction,
    updateTabIndex: updateTabIndexAction,
    cancelOrders: cancelOrdersAction
  }
)(OrderHistoryScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.LIGHT,
    paddingLeft: 0,
    paddingRight: 0
  },
  closeButton: {
    color: Colors.LIGHT,
    fontFamily: Layout.font.medium.fontFamily
  },
  header: {
    backgroundColor: Colors.PRIMARY
  },
  headerTitle: {
    fontFamily: Layout.font.bold.fontFamily,
    color: Colors.LIGHT
  },

  tabbar: {
    backgroundColor: Colors.PRIMARY,
    height: 50
  },
  tab: {
    width: 'auto',
    marginHorizontal: 10
  },
  tabLabel: {
    fontFamily: Layout.font.medium.fontFamily,
    fontSize: Layout.fontSize,
    textTransform: 'capitalize'
  },
  indicator: {
    borderRadius: 25,
    height: 50,
    borderWidth: 10,
    ...Platform.select({
      ios: {
        borderColor: Colors.PRIMARY
      },
      android: {
        borderColor: 'transparent',
      },
    }),
    backgroundColor: '#F6921E'
  }
});

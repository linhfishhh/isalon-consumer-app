import React from 'react';
import { createNavigationContainer, createStackNavigator } from 'react-navigation';

import ShopHomeScreen from './screens/ShopHomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProductScreen from './screens/ProductScreen';
import AddReviewScreen from './screens/AddReviewScreen';
import ProductFAQ from './screens/ProductFAQ';
import MyCartScreen from './screens/MyCartScreen';
import ProductComboScreen from './screens/ProductComboScreen';
import ProductEvaluation from './screens/ProductEvaluation';
import PickAddressScreen from './screens/PickAddressScreen';
import HtmlViewScreen from './screens/HtmlViewScreen';
import WebScreen from './screens/WebScreen';
import PaymentScreen from './screens/PaymentScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import AddressListScreen from './screens/AddressListScreen';
import ConfirmPaymentScreen from './screens/ConfirmPaymentScreen';
import SearchResultScreen from './screens/SearchResultScreen';

const shopStackNavigator = createStackNavigator({
  ShopHome: ShopHomeScreen,
  SearchScreen,
  ProductScreen,
  AddReviewScreen,
  ProductFAQ,
  MyCartScreen,
  ProductComboScreen,
  ProductEvaluation,
  PickAddressScreen,
  HtmlViewScreen,
  WebScreen,
  PaymentScreen,
  AddAddressScreen,
  AddressListScreen,
  ConfirmPaymentScreen,
  SearchResultScreen,
},
{
  mode: 'modal',
  headerMode: 'none',
});

const defaultGetStateForAction = shopStackNavigator.router.getStateForAction;
shopStackNavigator.router.getStateForAction = (action, state) => {
  if (state && action.type === 'GoToRoute') {
    const index = state.routes.findIndex((item) => item.routeName === action.routeName);
    const routes = state.routes.slice(0, index + 1);
    return {
      ...state,
      routes,
      index
    };
  }
  return defaultGetStateForAction(action, state);
};

const ShopContainer = createNavigationContainer(shopStackNavigator);

export default class Shop extends React.PureComponent {
  render() {
    return (
      <ShopContainer />
    );
  }
}

import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import { createStackNavigator } from 'react-navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import thunk from 'redux-thunk';
import { GoogleSignin } from 'react-native-google-signin';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AccessScreen from './src/screens/AccessScreen';
import LoginMethodsScreen from './src/screens/LoginMethodsScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import ResetPassScreen from './src/screens/ResetPassScreen';
import ResetPassVerifyScreen from './src/screens/ResetPassVerifyScreen';
import NewPassScreen from './src/screens/NewPassScreen';
import VerifyPhoneScreen from './src/screens/VerifyPhoneScreen';
import NewUserInfoStepOneScreen from './src/screens/NewUserInfoStepOneScreen';
import NewUserInfoStepTwoScreen from './src/screens/NewUserInfoStepTwoScreen';
import AgreementScreen from './src/screens/AgreementScreen';
import MemberAccountFAQScreen from './src/screens/MemberAccountFAQScreen';
import MemberAccountFAQDetailScreen from './src/screens/MemberAccountFAQDetailScreen';
import MemberAccountSettingScreen from './src/screens/MemberAccountSettingScreen';
import MemberProfileScreen from './src/screens/MemberProfileScreen';
import MemberTestScreen from './src/screens/MemberTestScreen';
import MemberAccountNotificationScreen from './src/screens/MemberAccountNotificationScreen';
import MemberAccountHistoryScreen from './src/screens/MemberAccountHistoryScreen';
import MemberOrderDetailScreen from './src/screens/MemberOrderDetailScreen';
import HomeSalonScreen from './src/screens/HomeSalonScreen';
import HomeServiceScreen from './src/screens/HomeServiceScreen';
import HomeResultScreen from './src/screens/HomeResultScreen';
import HomeSalonGalleries from './src/screens/HomeSalonGalleries';
import HomeSearchDetailScreen from './src/screens/HomeSearchDetailScreen';
import HomeWriteReviewScreen from './src/screens/HomeWriteReviewScreen';
import HomeCartStepOneScreen from './src/screens/HomeCartStepOneScreen';
import HomeCartStepTwoScreen from './src/screens/HomeCartStepTwoScreen';
import HomeCartStepThreeScreen from './src/screens/HomeCartStepThreeScreen';
import AccountCheckingScreen from './src/screens/AccountCheckingScreen';
import accountReducer from './src/redux/account/reducer';
import locationReducer from './src/redux/location/reducer';
import homeReducer from './src/redux/home/reducer';
import searchReducer from './src/redux/search/reducer';
import reviewReducer from './src/redux/reviews/reducer';
import likeReducer from './src/redux/likes/reducer';
import mapReducer from './src/redux/map/reducer';
import serviceReducer from './src/redux/services/reducer';
import cartReducer from './src/redux/cart/reducer';
import filterReducer from './src/redux/filter/reducer';
import bookingReducer from './src/redux/booking/reducer';
import historyReducer from './src/redux/history/reducer';
import favReducer from './src/redux/fav/reducer';
import notifyReducer from './src/redux/notify/reducer';
import bannerReducer from './src/redux/banner/reducer';
import recentSearchReducer from './src/redux/recent/reducer';
import flastDealsReducer from './src/redux/flast_deal/reducer';

import newSearchReducer from './src/redux/new_search/reducer';
import newSearchCacheReducer from './src/redux/new_search_cache/reducer';
import newSearchTabLatest from './src/redux/search_tab_latest/reducer';
import newSearchTabMostBooking from './src/redux/search_tab_most_booking/reducer';
import newSearchTabNearMe from './src/redux/search_tab_near_me/reducer';
import SearchHint from './src/redux/search_hint/reducer';
import newSearchCustomSalon from './src/redux/search_custom_salon/reducer';

// new home screen
import newHomeSearchTabLatest from './src/redux/home_search_tab_latest/reducer';
import newHomeSearchTabNearMe from './src/redux/home_search_tab_near_me/reducer';

import HomeResultFilterScreen from './src/screens/HomeResultFilterScreen';
import HomeResultPlaceFilterScreen from './src/screens/HomeResultPlaceFilterScreen';
import HomeCartPayScreen from './src/screens/HomeCartPayScreen';
import MemberAccountVerifyPhoneScreen from './src/screens/MemberAccountVerifyPhoneScreen';
import SelectServiceToReview from './src/screens/SelectServiceToReview';
import SalonReviewScreen from './src/screens/SalonReviewScreen';
import MemberAccountChangePasswordScreen from './src/screens/MemberAccountChangePasswordScreen';
import MemberAccountDefaultScreen from './src/screens/MemberAccountDefaultScreen';
import MemberAccountTOSScreen from './src/screens/MemberAccountTOSScreen';
import AccountSocialLoginScreen from './src/screens/AccountSocialLoginScreen';
import NewAccountSocialScreen from './src/screens/NewAccountSocialScreen';
import NewAccountSocialVerifyScreen from './src/screens/NewAccountSocialVerifyScreen';
import NavigationService from './src/NavigationService';
import MemberChangeTimeScreen from './src/screens/MemberChangeTimeScreen';
import MemberSectionNewScreen from './src/screens/MemberSectionNewScreen';
import ChangeSearchTypeScreen from './src/screens/ChangeSearchTypeScreen';
import ChangeSearchFilterScreen from './src/screens/ChangeSearchFilterScreen';
import ChangeSearchMapJumpScreen from './src/screens/ChangeSearchMapJumpScreen';
import LoginNewScreen from './src/screens/v2/LoginNewScreen';
import LoginPhoneConfirmNewScreen from './src/screens/v2/LoginPhoneConfirmNewScreen';
import AskNotiPermissionScreen from './src/screens/v2/AskNotiPermissionScreen';
import BuyStpOneScreen from './src/screens/v2/BuyStpOneScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import MemberSalonSearchScreen from './src/screens/MemberSalonSearchScreen';
import SalonSearchResultScreen from './src/screens/SalonSearchResultScreen';

// shop screens
import ShopHomeScreen from './src/shop/screens/ShopHomeScreen';
import SearchScreen from './src/shop/screens/SearchScreen';
import ProductScreen from './src/shop/screens/ProductScreen';
import AddReviewScreen from './src/shop/screens/AddReviewScreen';
import ProductFAQ from './src/shop/screens/ProductFAQ';
import MyCartScreen from './src/shop/screens/MyCartScreen';
import ProductComboScreen from './src/shop/screens/ProductComboScreen';
import ProductEvaluation from './src/shop/screens/ProductEvaluation';
import PickAddressScreen from './src/shop/screens/PickAddressScreen';
import HtmlViewScreen from './src/shop/screens/HtmlViewScreen';
import WebScreen from './src/shop/screens/WebScreen';
import PaymentScreen from './src/shop/screens/PaymentScreen';
import AddAddressScreen from './src/shop/screens/AddAddressScreen';
import AddressListScreen from './src/shop/screens/AddressListScreen';
import ConfirmPaymentScreen from './src/shop/screens/ConfirmPaymentScreen';
import SearchResultScreen from './src/shop/screens/SearchResultScreen';

// import Shop from './src/shop';

import OrderHistoryScreen from './src/shop/screens/OrderHistoryScreen';

import shopHomeReducer from './src/shop/redux/home/reducer';
import shopProductReducer from './src/shop/redux/product/reducer';
import shopAddressReducer from './src/shop/redux/address/reducer';
import shopCartReducer from './src/shop/redux/cart/reducer';
import shopOrderReducer from './src/shop/redux/order/reducer';
import shopOrderHistoryReducer from './src/shop/redux/orderHistory/reducer';
import shopSearchReducer from './src/shop/redux/search/reducer';
import reviewsProductReducer from './src/shop/redux/reviewsProduct/reducer';
import faqProductReducer from './src/shop/redux/FAQProduct/reducer';

const reducers = combineReducers({
  account: accountReducer,
  location: locationReducer,
  home: homeReducer,
  search: searchReducer,

  new_search: newSearchReducer,
  new_search_cache: newSearchCacheReducer,
  new_search_tab_latest: newSearchTabLatest,
  new_search_tab_most_booking: newSearchTabMostBooking,
  new_search_tab_near_me: newSearchTabNearMe,
  new_search_custom_salon: newSearchCustomSalon,
  search_hint: SearchHint,

  new_home_search_tab_latest: newHomeSearchTabLatest,
  new_home_search_tab_near_me: newHomeSearchTabNearMe,

  reviews: reviewReducer,
  likes: likeReducer,
  map: mapReducer,
  service: serviceReducer,
  cart: cartReducer,
  filter: filterReducer,
  recentSearch: recentSearchReducer,
  booking: bookingReducer,
  history: historyReducer,
  fav: favReducer,
  notify: notifyReducer,
  banner: bannerReducer,
  flastDeals: flastDealsReducer,

  shopHome: shopHomeReducer,
  shopProduct: shopProductReducer,
  shopAddress: shopAddressReducer,
  shopCart: shopCartReducer,
  shopOrder: shopOrderReducer,
  shopOrderHistory: shopOrderHistoryReducer,
  shopSearch: shopSearchReducer,
  shopReviews: reviewsProductReducer,
  shopFAQ: faqProductReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

type Props = {};

class App extends Component<Props> {
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '933846432550-9a29lnr1d7os27a35dgdksd0iol5gglt.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true,
      // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceConsentPrompt: true,
      // [Android] if you want to show the authorization prompt at each login
      accountName: '' // [Android] specifies an account name on the device that should be used
    });
  }

  componentWillUnmount() {
    // navigator.geolocation.clearWatch(this.watchId);
  }


  render() {
    return (
      <Provider store={store}>
        <RootStack
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}

const RootStack = createStackNavigator(
  {
    // v1 old
    welcome: {
      screen: WelcomeScreen
    },
    access: {
      screen: AccessScreen
    },
    login_methods: {
      screen: LoginMethodsScreen
    },
    login: {
      screen: LoginScreen
    },

    register: {
      screen: RegisterScreen
    },
    reset_pass: {
      screen: ResetPassScreen
    },
    reset_pass_verify: {
      screen: ResetPassVerifyScreen
    },
    new_pass: {
      screen: NewPassScreen
    },
    verify_phone: {
      screen: VerifyPhoneScreen
    },
    edit_profile_verify_phone: {
      screen: MemberAccountVerifyPhoneScreen
    },

    new_user_step_one: {
      screen: NewUserInfoStepOneScreen
    },
    new_user_step_two: {
      screen: NewUserInfoStepTwoScreen
    },
    agreement: AgreementScreen,
    // home: MemberSectionScreen,
    home: MemberSectionNewScreen,
    home_account_faq: MemberAccountFAQScreen,
    home_account_faq_detail: MemberAccountFAQDetailScreen,
    home_account_setting: MemberAccountSettingScreen,
    home_account_profile: MemberProfileScreen,
    home_account_tos: MemberAccountTOSScreen,
    home_account_notification: MemberAccountNotificationScreen,
    home_account_history: MemberAccountHistoryScreen,
    home_account_history_order: OrderHistoryScreen,
    home_account_favorite: FavoriteScreen,
    home_account_change_pass: MemberAccountChangePasswordScreen,
    home_account_default: MemberAccountDefaultScreen,
    home_order_detail: MemberOrderDetailScreen,
    home_salon: HomeSalonScreen,
    home_salon_galleries: HomeSalonGalleries,
    home_result: HomeResultScreen,
    home_result_filter: HomeResultFilterScreen,
    home_result_place_filter: HomeResultPlaceFilterScreen,
    home_service: HomeServiceScreen,
    home_test: MemberTestScreen,
    home_search_detail: HomeSearchDetailScreen,
    home_write_review: HomeWriteReviewScreen,
    home_cart_one: HomeCartStepOneScreen,
    home_cart_two: HomeCartStepTwoScreen,
    home_cart_pay: HomeCartPayScreen,
    home_cart_three: HomeCartStepThreeScreen,
    change_service_time: MemberChangeTimeScreen,
    social_checking: AccountSocialLoginScreen,
    social_phone: NewAccountSocialScreen,
    social_phone_verify: NewAccountSocialVerifyScreen,
    select_service_review: SelectServiceToReview,
    salon_reviews: SalonReviewScreen,
    accountChecking: AccountCheckingScreen,

    change_search_type: ChangeSearchTypeScreen,
    change_search_filter: ChangeSearchFilterScreen,
    map_location_picker: ChangeSearchMapJumpScreen,

    member_salon_search: MemberSalonSearchScreen,
    salon_search_result: SalonSearchResultScreen,

    // v2
    new_login: {
      screen: LoginNewScreen
    },
    new_login_phone_confirm: {
      screen: LoginPhoneConfirmNewScreen
    },
    ask_noti_permission: {
      screen: AskNotiPermissionScreen
    },
    buy_stp1: {
      screen: BuyStpOneScreen
    },
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
    navigationOptions: {
      header: null
    },
    // old login system
    initialRouteName: 'accountChecking'

    // new login system
    // initialRouteName: 'new_login',
    // transitionConfig: () => fromLeft(),
  }
);

const defaultGetStateForAction = RootStack.router.getStateForAction;
RootStack.router.getStateForAction = (action, state) => {
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

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
codePush.sync({
  // eslint-disable-next-line no-undef
  updateDialog: __DEV__ || false,
  installMode: codePush.InstallMode.IMMEDIATE
});
export default codePush(codePushOptions)(App);

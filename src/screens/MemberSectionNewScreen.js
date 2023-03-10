import React, { Component } from 'react';
import {
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { getInset } from 'react-native-safe-area-view';
import { SceneMap, TabView } from 'react-native-tab-view';
import MemberHomeScreen from './MemberHomeScreen';
import MemberSearchScreen from './MemberSearchScreen';
import Colors from '../styles/Colors';
import ImageSources from '../styles/ImageSources';
import MemberHistoryScreen from './MemberHistoryScreen';
import MemberAccountScreen from './MemberAccountScreen';
import LoginScreen from './LoginScreen';
import GlobalStyles from '../styles/GlobalStyles';
import { connect } from 'react-redux';
import {
  updateTabIndex,
  updateActive as updateHomeActive
} from '../redux/home/actions';
import { updateInfo as updateMapInfo } from '../redux/map/actions';
import { getSalonNearBy } from '../redux/search/actions';
import { loadWaitingHistory } from '../redux/history/actions';
// import { loadFavData } from "../redux/fav/actions";
import OneSignal from 'react-native-onesignal';
import Utils from '../configs';
import { updateInfo as updateAccountInfo } from '../redux/account/actions';
import { updateDeviceUserIDTag } from '../oneSignal';
import { readNotify, updateCount } from '../redux/notify/actions';
import NavigationService from '../NavigationService';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import MemberNewSearchScreen from './MemberNewSearchScreen';
import { DotIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OpenAppSettings from 'react-native-app-settings';
import { getUserLocation } from '../redux/new_search/actions';
import ShopHomeScreen from '../shop/screens/ShopHomeScreen';

const bottomMargin = getInset('bottom', false);

class MemberSectionNewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: props.account.tabIndex || 0,
      routes: this._getDefs(),
      initLocation: false,
      locationError: false,
      appState: AppState.currentState,
      appStateWaitToCheck: false
    };
  }

  _countNotify = () => {
    return this.props.notify.count;
  };

  _getDefs = () => [
    {
      key: 'search',
      title: '?????t l???ch',
      icon: ImageSources.SVG_ICON_SEARCH,
      icon_active: ImageSources.SVG_ICON_SEARCH_ACTIVE,
      screen: MemberNewSearchScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: 'home',
      title: '??u ????i',
      icon: ImageSources.SVG_ICON_HOME,
      icon_active: ImageSources.SVG_ICON_HOME_ACTIVE,
      screen: MemberHomeScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: 'shop',
      title: 'iShop',
      icon: ImageSources.SVG_ICON_SHOP,
      icon_active: ImageSources.SVG_ICON_SHOP_ACTIVE,
      screen: ShopHomeScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: 'history',
      title: 'L???ch s???',
      icon: ImageSources.SVG_ICON_HISTORY,
      icon_active: ImageSources.SVG_ICON_HISTORY_ACTIVE,
      screen: MemberHistoryScreen,
      navigation: this.props.navigation,
      action: this.props.loadWaitingHistory
    },
    {
      key: 'account',
      title: 'T??i kho???n',
      icon: ImageSources.SVG_ICON_ACCOUNT,
      icon_active: ImageSources.SVG_ICON_ACCOUNT_ACTIVE,
      screen: MemberAccountScreen,
      navigation: this.props.navigation,
      number: this._countNotify,
      action: () => {}
    }
  ];

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = props => {
    return (
      <View style={Styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          let number = route.number ? route.number() : 0;
          if (!route.icon) {
            return null;
          }
          const active = i === this.state.index;
          return (
            <TouchableOpacity
              key={i}
              style={Styles.tabItem}
              onPress={() =>
                this.setState({ index: i }, () => {
                  route.action();
                  this.props.updateTabIndex(i);
                })
              }
            >
              {active ? route.icon_active : route.icon}
              <Text style={[Styles.tabTitle, (active ? Styles.tabTitleActive : Styles.tabTitleInactive)]}>{route.title}</Text>
              {number ? (
                <View style={Styles.tabNumberWrapper}>
                  <Text style={Styles.tabNumber}>
                    {number > 99 ? 99 + '+' : number}
                  </Text>
                </View>
              ) : (
                undefined
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap(
    this._getDefs().reduce((obj, item) => {
      obj[item.key] = item.screen;
      return obj;
    }, {})
  );

  onReceived = notification => {
    this.props.updateCount();
  };

  ensureNotRoute = routeNot => {
    let route = NavigationService.getCurrentRoute();
    if (route) {
      if (route.routeName === routeNot) {
        let navigator = NavigationService.navigator();
        let back = NavigationActions.back();
        navigator.dispatch(back);
      }
    }
  };

  onOpened = ({ action, notification }) => {
    let data = notification.payload.additionalData;
    let scope = data.scope;
    if (scope !== 'customer') {
      return;
    }
    let route = data.route ? data.route : null;
    let navigator = NavigationService.navigator();
    if (route) {
      let routeName = route[0];
      let params = route[1];
      this.ensureNotRoute(routeName);
      try {
        if (data.notification_id) {
          this.props.readNotify(data.notification_id);
        }
        if (routeName === 'home') {
          this.setState(
            {
              index: params.tabIndex
            },
            () => {
              this.props.updateTabIndex(params.tabIndex);
            }
          );
        }
        setTimeout(() => {
          let navigate = NavigationActions.navigate({
            routeName: routeName,
            params: params
          });
          navigator.dispatch(navigate);
        }, 100);
      } catch (e) {}
    } else {
      this.ensureNotRoute('home_account_notification');
      this.props.navigation.navigate('home_account_notification');
    }
  };

  onIds = async ({ pushToken, userId }) => {
    this.props.updateAccountInfo({
      device_id: userId
    });
    await updateDeviceUserIDTag({
      user_id: this.props.account.user_id ? this.props.account.user_id : 0
    });
  };

  initOneSignal = async () => {
    try {
      OneSignal.init(Utils.oneSignalAppID);
      OneSignal.inFocusDisplaying(2);
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('ids', this.onIds);
      OneSignal.configure();
      OneSignal.setSubscription(true);
    } catch (e) {
    }
  };

  notifySetup = async () => {
    await this.initOneSignal();
  };

  _handleAppStateChange = nextAppState => {
    if (!this.state.appStateWaitToCheck) {
      return;
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.setState(
        {
          appStateWaitToCheck: false
        },
        async () => {
          await this._init();
        }
      );
    }
    this.setState({ appState: nextAppState });
  };

  _initDone = () => {
    this.setState(
      {
        initLocation: true
      },
      () => {
        let index =
          this.props.account.tabIndex === null ||
          this.props.account.tabIndex === undefined
            ? 0
            : this.props.account.tabIndex;
        this.setState(
          {
            index: index,
            locationError: false
          },
          () => {
            // if (this.state.index === 2) {
            //   this.props.loadFavData();
            // } else
            if (this.state.index === 3) {
              this.props.loadWaitingHistory();
            }
            this.props.updateCount();
            this.notifySetup();
            this.props.updateTabIndex(index);
          }
        );
      }
    );
  };

  _init = async () => {
    let error = await this.props.getUserLocation();
    if (error && error !== 1) {
      this.setState({ appStateWaitToCheck: true });
    }
    if (
      this.props.search.user_location.lat === 0 ||
      this.props.search.user_location.lng === 0
    ) {
      this.setState({ locationError: error });
      if (Platform.OS === 'android') {
        // await this.props.getUserLocation();
        //alert("Kh??ng th??? l???y ???????c v??? tr?? hi???n t???i t??? thi???t b??? n??y...")
        Alert.alert(
          'KH??NG T??M TH???Y ?????A ??I???M!',
          'Vui l??ng b???t c??c d???ch v??? ?????nh v???. T???t nh???t l?? ch???n n?? ??? ????? ch??nh x??c cao.',
          [
            {
              text: 'CHO PH??P',
              onPress: () => {
                this.setState(
                  {
                    appStateWaitToCheck: true,
                    locationError: false
                  },
                  async () => {
                    await OpenAppSettings.open();
                  }
                );
              }
            },
            {
              text: 'T??? CH???I',
              onPress: () => {
                this.setState(
                  {
                    appStateWaitToCheck: false,
                    locationError: true
                  },
                  async () => {
                    this._initDone();
                  }
                );
              }
            }
          ],
          { cancelable: false }
        );
        return;
      } else {
        //alert("Kh??ng th??? l???y ???????c v??? tr?? hi???n t???i t??? thi???t b??? n??y...")
        Alert.alert(
          'KH??NG T??M TH???Y ?????A ??I???M!',
          'Ch??ng t??i c?? th??? truy c???p th??ng tin ?????a ??i???m c???a b???n v?? g???i th??ng b??o ???????c kh??ng? Sau ???? b???n c?? th??? b???t ?????u ?????t d???ch v???.',
          [
            {
              text: 'CHO PH??P',
              onPress: () => {
                this.setState(
                  {
                    appStateWaitToCheck: true,
                    locationError: false
                  },
                  async () => {
                    await Linking.openURL('app-settings:');
                  }
                );
              }
            },
            {
              text: 'T??? CH???I',
              onPress: () => {
                this.setState(
                  {
                    appStateWaitToCheck: false,
                    locationError: true
                  },
                  async () => {
                    this._initDone();
                  }
                );
              }
            }
          ],
          { cancelable: false }
        );
        return;
      }
    }
    this._initDone();
  };

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    await this._init();
  }

  render() {
    if (this.state.locationError) {
      return (
        <View style={[Styles.page, Styles.pageNoUserLocation]}>
          <Icon style={Styles.noUserLocationIcon} name={'location-off'} />
          <Text style={Styles.noUserLocationText}>
            ???ng d???ng t???m th???i kh??ng th??? x??c ?????nh ???????c v??? tr?? c???a b???n.{'\n'}
            {this.state.locationError === 1
              ? 'Vui l??ng cho ph??p ???ng cho ???ng d???ng s??? d???ng t??nh n??ng ?????nh v???.'
              : 'Vui l??ng ki???m tra ch???c n??ng ?????nh v??? c???a thi???t b??? c???a b???n...'}
          </Text>
          {this.state.locationError === 1 ? (
            <TouchableOpacity
              onPress={() => {
                this.setState(
                  {
                    appStateWaitToCheck: true,
                    locationError: false
                  },
                  async () => {
                    if (Platform.OS === 'android') {
                      // await this.props.getUserLocation();
                      await OpenAppSettings.open();
                    } else {
                      Linking.openURL('app-settings:');
                    }
                  }
                );
              }}
              style={Styles.noUserLocationLinkButton}
            >
              <Text style={Styles.noUserLocationLink}>Ki???m tra ngay</Text>
            </TouchableOpacity>
          ) : (
            undefined
          )}
          <TouchableOpacity
            onPress={this._initDone}
            style={[
              Styles.noUserLocationLinkButton,
              { backgroundColor: Colors.SILVER }
            ]}
          >
            <Text style={[Styles.noUserLocationLink]}>
              B??? qua t??nh n??ng n??y
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.state.initLocation ? (
      <View style={{ flex: 1 }}>
        <StatusBar
          //backgroundColor="red"
          barStyle={
            this.props.home.tabIndex === 0 ? 'light-content' : 'dark-content'
          }
          backgroundColor={Colors.TRANSPARENT}
          hidden={false}
          translucent={true}
        />
        <NavigationEvents
        //onWillBlur={()=>{this.props.updateHomeActive(false)}}
        //onDidFocus={()=>{this.props.updateHomeActive(true)}}
        />
        <TabView
          animationEnabled={false}
          swipeEnabled={false}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          tabBarPosition={'bottom'}
          useNativeDriver
        />
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <DotIndicator size={10} count={3} color={Colors.PRIMARY} />
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      account: state.account,
      home: state.home,
      history: state.history,
      notify: state.notify,
      search: state.new_search
    };
  },
  {
    // loadFavData,
    loadWaitingHistory,
    updateTabIndex,
    updateMapInfo,
    getSalonNearBy,
    updateAccountInfo,
    updateCount,
    updateHomeActive,
    readNotify,
    getUserLocation
  }
)(MemberSectionNewScreen);

const Styles = StyleSheet.create({
  pageNoUserLocation: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    flex: 1
  },
  noUserLocationIcon: {
    fontSize: 40,
    color: Colors.SILVER,
    marginBottom: 15
  },
  noUserLocationText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.SILVER_DARK,
    textAlign: 'center',
    marginBottom: 15,
    width: 250
  },
  noUserLocationLinkButton: {
    backgroundColor: Colors.PRIMARY,
    height: 40,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 3,
    marginBottom: 10
  },
  noUserLocationLink: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16
  },
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.LIGHT,
    paddingBottom: bottomMargin,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  tabTitleActive: {
    color: Colors.PRIMARY,
  },
  tabTitleInactive: {
    color: Colors.DARK,
  },
  tabNumberWrapper: {
    position: 'absolute',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    right: 10,
    top: 5
  },
  tabNumber: {
    width: 24,
    height: 24,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 24,
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME
  },
  tabIcon: {}
});

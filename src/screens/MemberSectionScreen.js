import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import MemberHomeScreen from './MemberHomeScreen';
import MemberSearchScreen from './MemberSearchScreen';
import Colors from '../styles/Colors';
import ImageSources from '../styles/ImageSources';
import MemberFAVScreen from './MemberFAVScreen';
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
import { loadFavData } from '../redux/fav/actions';
import OneSignal from 'react-native-onesignal';
import Utils from '../configs';
import { updateInfo as updateAccountInfo } from '../redux/account/actions';
import { updateDeviceUserIDTag } from '../oneSignal';
import { readNotify, updateCount } from '../redux/notify/actions';
import NavigationService from '../NavigationService';
import { NavigationActions, NavigationEvents } from 'react-navigation';

class MemberSectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: this._getDefs()
    };
  }

  _countNotify = () => {
    return this.props.notify.count;
  };

  _getDefs = () => [
    {
      key: 'search',
      title: 'Search',
      icon: ImageSources.SVG_ICON_SEARCH,
      icon_active: ImageSources.SVG_ICON_SEARCH_ACTIVE,
      screen: MemberSearchScreen,
      //screen: MemberHomeScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: 'home',
      icon: ImageSources.SVG_ICON_HOME,
      icon_active: ImageSources.SVG_ICON_HOME_ACTIVE,
      screen: MemberHomeScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: 'fav',
      icon: ImageSources.SVG_ICON_FAV,
      icon_active: ImageSources.SVG_ICON_FAV_ACTIVE,
      screen: MemberFAVScreen,
      navigation: this.props.navigation,
      action: this.props.loadFavData
    },
    {
      key: 'history',
      icon: ImageSources.SVG_ICON_HISTORY,
      icon_active: ImageSources.SVG_ICON_HISTORY_ACTIVE,
      screen: MemberHistoryScreen,
      navigation: this.props.navigation,
      action: this.props.loadWaitingHistory
    },
    {
      key: 'account',
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
      let params = route[1] ? route[1] : undefined;
      this.ensureNotRoute(routeName);
      try {
        if (data.notification_id) {
          this.props.readNotify(data.notification_id);
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

  componentDidMount() {
    let index =
      this.props.account.tabIndex === null ||
      this.props.account.tabIndex === undefined
        ? 0
        : this.props.account.tabIndex;
    this.setState(
      {
        index: index
      },
      () => {
        if (this.state.index === 2) {
          this.props.loadFavData();
        } else if (this.state.index === 3) {
          this.props.loadWaitingHistory();
        }
      }
    );
    this.props.updateCount();
    this.notifySetup();
    this.props.updateTabIndex(index);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillBlur={() => {
            this.props.updateHomeActive(false);
          }}
          onDidFocus={() => {
            this.props.updateHomeActive(true);
          }}
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
    );
  }
}
export default connect(
  state => {
    return {
      account: state.account,
      home: state.home,
      history: state.history,
      notify: state.notify
    };
  },
  {
    loadFavData,
    loadWaitingHistory,
    updateTabIndex,
    updateMapInfo,
    getSalonNearBy,
    updateAccountInfo,
    updateCount,
    updateHomeActive,
    readNotify
  }
)(MemberSectionScreen);

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.DARK
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    position: 'relative'
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

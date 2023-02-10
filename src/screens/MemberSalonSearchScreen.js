import React, { Component, PureComponent } from "react";
import {
  Alert,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  Keyboard
} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import { connect } from "react-redux";
import Utils from "../configs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DotIndicator, PulseIndicator } from "react-native-indicators";
import Svg, { Circle, G, Polygon } from "react-native-svg";
import numeral from "numeral";
import WAStars from "../components/WAStars";
import WALightBox from "../components/WALightBox";
import BallIndicator from "react-native-indicators/src/components/ball-indicator";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SceneMap, TabView } from "react-native-tab-view";
import ImageSources from "../styles/ImageSources";
import SearchTabList from "./SearchTabList";
import SearchTabNearMeScreen from "./SearchTabNearMeScreen";
import SearchTabLatestScreen from "./SearchTabLatestScreen";
import SearchTabMostBookingScreen from "./SearchTabMostBookingScreen";
import {
  getResultSearchTabLatest,
  updateSearchTabLatestState
} from "../redux/search_tab_latest/actions";
import {
  getResultSearchTabMostBooking,
  updateSearchTabMostBookingState
} from "../redux/search_tab_most_booking/actions";
import {
  updateSearchTabNearMeState,
  getResultSearchTabNearMe
} from "../redux/search_tab_near_me/actions";

import { updateSearchState } from "../redux/new_search/actions";
import WASearchHint from "../components/SearchHint";
import { fetchHints } from "../redux/search_hint/actions";
import { NavigationEvents } from "react-navigation";
import { updateDeviceUserIDTag } from "../oneSignal";

type Props = {};

const search_types = Utils.getSearchType();

const defaultFilters = Utils.getDefaultFilters();

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;

class MemberSalonSearchScreen extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const categories = props.navigation.getParam("categories");
    this.state = {
      index: 0,
      routes: this._getDefs(),
      cats: categories || [],
      loading: true,
      autoFocus: false
    };
  }

  _getDefs = () => [
    {
      key: "latest",
      title: "Mới nhất",
      screen: SearchTabLatestScreen,
      //screen: MemberHomeScreen,
      navigation: this.props.navigation,
      action: () => {}
    },
    {
      key: "near_me",
      title: "Gần tôi",
      screen: SearchTabNearMeScreen,
      navigation: this.props.navigation,
      //screen: MemberHomeScreen,
      action: () => {}
    },
    {
      key: "most_booking",
      title: "Đặt nhiều",
      screen: SearchTabMostBookingScreen,
      navigation: this.props.navigation,
      //screen: MemberHomeScreen,
      action: () => {}
    }
  ];

  _handleIndexChange = index => this.setState({ index });

  _countFilters = () => {
    let rs = 0;
    if (this.props.search.filters.local) {
      if (this.props.search.filters.local.id > 0) {
        rs++;
      }
    }
    if (this.props.search.filters.sale_off) {
      rs++;
    }
    if (this.props.search.filters.rating > 0) {
      rs++;
    }
    if (
      this.props.search.filters.price_from !== defaultFilters.price_from ||
      this.props.search.filters.price_to !== defaultFilters.price_to
    ) {
      rs++;
    }
    return rs;
  };

  _renderTabBar = props => {
    return (
      <View style={Styles.tabBar}>
        <View style={Styles.tabItems}>
          {props.navigationState.routes.map((route, i) => {
            const active = i === this.state.index;
            return (
              <TouchableOpacity
                key={i}
                style={[Styles.tabItem, active && Styles.tabItemActive]}
                onPress={() =>
                  this.setState({ index: i }, () => {
                    //route.action();
                    this._feedTabResults();
                  })
                }
              >
                <Text
                  style={[
                    Styles.tabItemText,
                    active && Styles.tabItemTextActive
                  ]}
                >
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
          onPress={() => {
            this.props.navigation.navigate("change_search_filter", {
              apply: this._applyToSearch
            });
          }}
          style={Styles.Filters}
        >
          <Icon name={"tune"} />
          <Text style={Styles.FiltersText}>Bộ lọc</Text>
          <View style={Styles.FiltersCount}>
            <Text style={Styles.FiltersCountText}>{this._countFilters()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderScene = SceneMap(
    this._getDefs().reduce((obj, item) => {
      obj[item.key] = item.screen;
      return obj;
    }, {})
  );

  _applyToSearch = () => {
    this.props.updateSearchTabLatestState({
      loaded: false
    });
    this.props.updateSearchTabMostBookingState({
      loaded: false
    });
    this.props.updateSearchTabNearMeState({
      loaded: false
    });
    this._feedTabResults();
  };

  _feedTabResults = () => {
    switch (this.state.index) {
      case 0:
        this.props.getResultSearchTabLatest();
        break;
      case 1:
        //this.props.getResultSearchTabNearMe();
        if (this.props.near_me_tab.init) {
          this.props.getResultSearchTabNearMe();
        } else {
          this.props.updateSearchTabNearMeState({
            init: true
          });
        }
        break;
      case 2:
        this.props.getResultSearchTabMostBooking();
        break;
    }
  };

  initComponent = () => {
    this._applyToSearch();
  };

  componentDidMount() {
    const selectedCategory = this.props.navigation.getParam("selectedCategory");
    this.props.updateSearchState({
      filters: {
        ...this.props.search.filters,
        cat: [selectedCategory]
      }
    });
    this.initComponent();
  }

  _applyCatFilter = cat_id => {
    let active = this.props.search.filters.cat.indexOf(cat_id) > -1;
    let cats = [];
    if (!active) {
      cats = [cat_id];
    }
    this.props.updateSearchState({
      filters: {
        ...this.props.search.filters,
        cat: cats
      }
    });
    this._applyToSearch();
  };

  componentWillMount() {
    this.timer = null;
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={Styles.page}>
        <NavigationEvents onDidFocus={this._autoFocusSearchInput} />
        <StatusBar barStyle={"light-content"} />
        <View style={Styles.pageInner}>
          <View style={Styles.topBox}>
            <TouchableOpacity onPress={this.goBack} hitSlop={backButtonHitslop}>
              <Icon name="arrow-back" color={Colors.LIGHT} size={24}/>
            </TouchableOpacity>
          </View>
          <View style={Styles.catBar}>
            <ScrollView
              style={Styles.catBarSV}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {this.state.cats.map((cat, index) => {
                let active = this.props.search.filters.cat.indexOf(cat.id) > -1;
                return (
                  <TouchableOpacity
                    hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
                    onPress={() => {
                      this._applyCatFilter(cat.id);
                    }}
                    style={Styles.cat}
                    key={index}
                  >
                    {active ? (
                      <View style={Styles.catIcon}>
                        <Icon style={Styles.catIconText} name={"check"} />
                      </View>
                    ) : (
                      undefined
                    )}
                    <Image
                      source={{ uri: cat.cover }}
                      style={Styles.catImage}
                    />
                    <Text
                      style={[Styles.catName, active && Styles.catNameActive]}
                    >
                      {cat.name.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <TabView
            animationEnabled={false}
            swipeEnabled={false}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
            tabBarPosition={"top"}
            useNativeDriver
          />
        </View>
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      search: state.new_search,
      near_me_tab: state.new_search_tab_near_me,
      home: state.home
    };
  },
  {
    updateSearchState,

    updateSearchTabLatestState,
    getResultSearchTabLatest,

    updateSearchTabMostBookingState,
    getResultSearchTabMostBooking,

    updateSearchTabNearMeState,
    getResultSearchTabNearMe,
    fetchHints
  }
)(MemberSalonSearchScreen);

const backButtonHitslop = {top: 10, left: 10, bottom: 10, right: 10};

const Styles = StyleSheet.create({
  page: {
    paddingTop: getStatusBarHeight(),
    backgroundColor: Colors.DARK,
    flex: 1
  },
  pageInner: {
    backgroundColor: Colors.LIGHT,
    flex: 1
  },
  topBox: {
    backgroundColor: Colors.PRIMARY,
    height: 44,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.LIGHT,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 5
  },
  searchInput: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 40,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    flex: 1,
    color: Colors.SILVER_DARK
  },
  searchInputIcon: {
    color: Colors.SILVER_LIGHT,
    fontSize: 24
  },
  searchType: {
    paddingRight: 5,
    paddingLeft: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  searchTypeText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_LINK,
    textAlign: "center"
  },
  searchLocation: {
    fontSize: 12,
    color: Colors.SILVER_DARK
  },
  catBar: {
    //height: 50,
    //padding: 10
    paddingLeft: 10,
    paddingRight: 10
  },
  cat: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    //width: 50,
    flexDirection: "row",
    //borderColor: Colors.SILVER_LIGHT,
    //borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10
  },
  catImage: {
    height: 36,
    width: 36,
    marginRight: 5,
    borderRadius: 12,
    overflow: "hidden"
  },
  catName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK,
    textAlign: "center"
  },

  catIcon: {
    position: "absolute",
    left: 26,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.DARK,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7
  },

  catNameActive: {
    color: Colors.PRIMARY
  },
  catIconText: {
    fontSize: 8,
    color: Colors.LIGHT
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.SILVER_LIGHT,
    alignItems: "center"
  },
  tabItems: {
    flexDirection: "row",
    flex: 1
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.TRANSPARENT
  },
  tabItemActive: {
    borderBottomColor: Colors.PRIMARY
  },
  tabItemText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK
  },
  tabItemTextActive: {
    color: Colors.PRIMARY
  },

  Filters: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  FiltersText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK
  },
  FiltersCount: {
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 2
  },
  FiltersCountText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 10,
    color: Colors.LIGHT
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingScreenIcon: {
    height: 60
  },
  loadingScreenText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: Colors.TEXT_DARK
  }
});

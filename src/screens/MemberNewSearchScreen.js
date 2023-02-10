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
  RefreshControl,
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
  updateSearchTabLatestState,
  updateSalonNewLike
} from "../redux/home_search_tab_latest/actions";
import {
  getResultSearchTabMostBooking,
  updateSearchTabMostBookingState
} from "../redux/search_tab_most_booking/actions";
import {
  updateSearchTabNearMeState as updateHomeSearchTabNearMeState,
  getResultSearchTabNearMe,
  updateSalonNearMeLike
} from "../redux/home_search_tab_near_me/actions";
import {
  getResultSearchCustomSalon,
  updateSearchCustomSalonState,
  updateTopSalonNam,
  likeSalon
} from "../redux/search_custom_salon/actions";
import { updateSearchTabNearMeState } from "../redux/search_tab_near_me/actions";
import { updateSearchState } from "../redux/new_search/actions";
import { getBannerGird, getBanners } from "../redux/banner/actions";
import { getFlastDeals, updateInfo } from "../redux/flast_deal/actions";
import WASearchHint from "../components/SearchHint";
import { fetchHints } from "../redux/search_hint/actions";
import { getRecentSearch, addRecentSearch } from "../redux/recent/actions";
import { NavigationEvents } from "react-navigation";
import { updateDeviceUserIDTag } from "../oneSignal";
import MemberHomeScreen from "./MemberHomeScreen";
import WAAdvertisingBanner from "../components/WAAdvertisingBanner";
import WAFlashDeal from "../components/WAFlashDeal";
import WARecentSearches from "../components/WARecentSearches";
import WANewSalon from "../components/WANewSalon";
import WANearMe from "../components/WANearMe";
import WAAlert from "../components/WAAlert";
import WACustomSalon from "../components/WACustomSalon";

type Props = {};
const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();
const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;

class MemberNewSearchScreen extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      loading: true,
      user_local: null,
      init: false,
      initText: "Đang thiếp lập tìm kiếm...",
      keyword: "",
      showSearchHint: false,
      keyboardHeight: 0,
      autoFocus: false,
      showViewSeach: true,
      loginAlert: false
    };
  }

  requireLogin = () => {
    this.setState({
      loginAlert: true
    });
  };

  _autoFocusSearchInput = () => {
    if (this.state.autoFocus) {
      this.setState(
        {
          autoFocus: false
        },
        () => {
          if (this.keywordInput) {
            this.keywordInput.focus();
          }
        }
      );
    }
  };

  _applyToSearch = () => {
    this.props.updateSearchTabLatestState({
      loaded: false
    });
    this.props.updateSearchTabMostBookingState({
      loaded: false
    });
    this.props.updateHomeSearchTabNearMeState({
      loaded: false
    });
    this._getSalonNew();
    this._getSalonNearme();
  };

  _loadCategories = () => {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          loading: true
        },
        async () => {
          try {
            let rq = await Utils.getAxios().post("search/configs");
                const config = {
              searchRadiusList: rq.data.settings.search_radius_list,
              marker_color_1_active: rq.data.settings.marker_color_1_active,
              marker_color_2_active: rq.data.settings.marker_color_2_active,
              marker_color_1_normal: rq.data.settings.marker_color_1_normal,
              marker_color_2_normal: rq.data.settings.marker_color_2_normal
            }
            this.props.updateHomeSearchTabNearMeState(config);
            this.props.updateSearchTabNearMeState(config);
            this.setState(
              {
                loading: false,
                cats: rq.data.cats
              },
              resolve
            );
          } catch (e) {
            this.setState(
              {
                loading: false
              },
              resolve
            );
          }
        }
      );
    });
  };

  feedCity = () => {
    return new Promise(async (resolve, reject) => {
      if (
        this.props.search.user_location.lat === 0 &&
        this.props.search.user_location.lng === 0
      ) {
        return resolve();
      } else {
        try {
          this.setState({
            initText: "Đang xác định vị trí của bạn..."
          });
          let rs = await Utils.getAxios().get(
            "https://maps.googleapis.com/maps/api/geocode/json?" +
              "key=" +
              Utils.googleMapApiKey +
              "&language=vi" +
              "&latlng=" +
              this.props.search.user_location.lat +
              "," +
              this.props.search.user_location.lng
          );
          if (rs.data.status) {
            if (rs.data.status === "OK") {
              let results = rs.data.results;
              let target = null;
              let index;
              for (index in results) {
                let item = results[index];
                if (item.types) {
                  if (item.types.indexOf("administrative_area_level_1") > -1) {
                    target = results[index].formatted_address
                      .toLowerCase()
                      .replace(", việt nam", "");
                    break;
                  }
                }
              }
              this.setState({
                user_local: target
              });
            }
          }
          return resolve();
        } catch (e) {
          return resolve();
        }
      }
    });
  };

  getLV1 = () => {
    return new Promise(async (resolve, reject) => {
      if (!this.state.user_local) {
        return resolve();
      } else {
        try {
          let rs = await Utils.getAxios().post("search/location-find", {
            find: this.state.user_local
          });
          if (rs.data.id) {
            try {
              await updateDeviceUserIDTag({
                location: rs.data.id
              });
            } catch (e) {}
            this.props.updateSearchState({
              search_location: rs.data,
              user_location: {
                ...this.props.search.user_location,
                id: rs.data.id,
                name: rs.data.name
              }
            });
          } else {
            this.props.updateSearchState({
              search_location: {
                id: 0,
                name: "Toàn quốc",
                lat: 0,
                lng: 0
              },
              user_location: {
                ...this.props.search.user_location,
                id: 0,
                name: "Toàn quốc"
              }
            });
          }
          return resolve();
        } catch (e) {
          return resolve();
        }
      }
    });
  };

  _getSearchRadiusValue = () => {
    var SearchRadiusList = this.props.near_me_tab.searchRadiusList;
    if (SearchRadiusList !== null && SearchRadiusList.length > 0) {
      SearchRadiusList = SearchRadiusList[SearchRadiusList.length - 1];
    } else {
      SearchRadiusList = 4000;
    }
    return SearchRadiusList;
  };

  initComponent = () => {
    this.setState(
      {
        init: true
      },
      async () => {
        await this.feedCity();
        await this.getLV1();
        await this._loadCategories();
        await this._getBanner();
        await this._getSalonNew();
        await this._getSalonNearme();
        await this._getResultSearchCustomSalon();
        await this._getFlastDeals();
        await this._getRecentSearch();
        await this._getBannerGird();
      }
    );
  };

  updateLikeSalon = () => {
    this.setState({
      init: false
    });
  };

  async componentDidMount() {
    if (this.state.init === false && this.props.home.tabIndex === 0) {
      await this.initComponent();
    }
  }

  async componentDidUpdate() {
    if (this.state.init === false && this.props.home.tabIndex === 0) {
      await this.initComponent();
    }
  }

  deg2rad = angle => {
    return (angle / 180.0) * Math.PI; // (angle / 180) * Math.PI;
  };

  rad2deg = angle => {
    return (angle / Math.PI) * 180.0; // angle / Math.PI * 180
  };

  getRegion = (lat, lng) => {
    let radiusInRad =
      ((this._getSearchRadiusValue() + this._getSearchRadiusValue() / 20) *
        2.0) /
      1000.0 /
      6378.1;
    let longitudeDelta = this.rad2deg(
      radiusInRad / Math.cos(this.deg2rad(lat))
    );
    let latitudeDelta = 1.0 * this.rad2deg(radiusInRad);
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta
    };
  };

  _applyCatFilter = cat_id => {
    this.props.route.navigation.push("member_salon_search", {
      categories: this.state.cats,
      selectedCategory: cat_id
    });
  };

  _updateKeyword = () => {
    clearTimeout(this.timer);
    this.props.updateSearchState({
      keyword: this.state.keyword
    });
    this.timer = setTimeout(() => {
      this.props.fetchHints(
        this.state.keyword,
        this.props.search.search_location.id
      );
    }, WAIT_INTERVAL);
  };

  _rememberKeyword = () => {
    this.setState({
      showSearchHint: true
    });
  };

  _checkRememberKeywordAndApply = () => {
    this.setState({
      showSearchHint: false
    });
  };

  _submitSearch = () => {
      this.props.updateSearchState({
        keyword: ""
      });
      this.setState(
        {
          showSearchHint: false,
          keyword: ""
        }
      );
      this.props.route.navigation.push('salon_search_result', {keyword: this.state.keyword});
  };

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height - 60
    });
  };

  _keyboardDidHide = e => {
    if (this.keywordInput) {
      this.keywordInput.blur();
    }
  }

  _onSearchHintCatApply = cat_id => {
    this.props.updateSearchState({
      keyword: ""
    });
    this.setState(
      {
        showSearchHint: false,
        keyword: ""
      },
      () => {
        if (this.keywordInput) {
          this.keywordInput.blur();
        }
        this._applyCatFilter(cat_id);
      }
    );
  };

  componentWillMount() {
    this.timer = null;
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _onInputKeyword = keyword => {
    this.setState({ keyword }, this._updateKeyword);
  };

  _onSearchHintNavigation = () => {
    this.setState({
      autoFocus: true
    });
  };

  _getBanner = () => {
    this.props.getBanners();
  };

  _getBannerGird = () => {
    this.props.getBannerGird();
  };

  _getRecentSearch = () => {
    this.props.getRecentSearch();
  };

  _addRecentSearch = id => {
    this.props.addRecentSearch(id);
  };

  _getFlastDeals = () => {
    this.props.getFlastDeals();
  };

  _getSalonNearme = () => {
    this.props.updateHomeSearchTabNearMeState({
      currentLocation: this.getRegion(
        this.props.search.user_location.lat,
        this.props.search.user_location.lng
      )
    });
    this.props.getResultSearchTabNearMe();
  };

  _getResultSearchCustomSalon = () => {
    this.props.getResultSearchCustomSalon();
  };

  _getSalonNew = () => {
    this.props.getResultSearchTabLatest();
  };

  _loadMore = () => {
    this.props.getResultSearchTabLatest({}, false);
  };

  _onRefresh = () => {
    this.setState({ refreshing: false }, () => {
      this.updateLikeSalon();
    });
  };

  render() {
    return this.state.loading ? (
      //1===1?
      <View style={Styles.loadingScreen}>
        <StatusBar barStyle={"dark-content"} />
        <View style={Styles.loadingScreenIcon}>
          <PulseIndicator color={Colors.PRIMARY} />
        </View>
        <Text style={Styles.loadingScreenText}>{this.state.initText}</Text>
      </View>
    ) : (
      <View style={Styles.page}>
        <NavigationEvents onDidFocus={this._autoFocusSearchInput} />
        <StatusBar barStyle={"light-content"} />
        <View style={Styles.pageInner}>
          <WAAlert
            title={"Đăng nhập"}
            question={"Vui lòng đăng nhập để sử dụng chức năng này"}
            titleFirst={true}
            show={this.state.loginAlert}
            yesTitle={"Đăng nhập"}
            noTitle={"Lần sau"}
            yes={() => {
              this.setState({ loginAlert: false }, () => {
                this.props.route.navigation.navigate("accountChecking", {
                  hasBack: true
                });
              });
            }}
            no={() => {
              this.setState({ loginAlert: false });
            }}
          />
          <View style={Styles.topBox}>
            <View style={Styles.searchInputWrapper}>
              <Image
                style={Styles.searchInputIcon}
                source={require("../assets/images/icon_search.png")}
              />
              {this.state.showViewSeach ? (
                <TouchableOpacity
                  onPress={() => {
                    this._submitSearch();
                  }}
                  style={Styles.search_box}
                >
                  <Text style={Styles.titleSearch}>
                    Tìm kiếm theo salon/dịch vụ
                  </Text>
                  <Text style={Styles.titleAllServices}>
                    {this.props.search.search_type.title} • {this.props.search.search_location.name}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  onChangeText={this._onInputKeyword}
                  value={this.state.keyword}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  returnKeyType={"search"}
                  placeholder={this.props.search.search_type.placeholder}
                  style={Styles.searchInput}
                  onBlur={this._checkRememberKeywordAndApply}
                  onFocus={this._rememberKeyword}
                  ref={ref => (this.keywordInput = ref)}
                  onSubmitEditing={this._submitSearch}
                  blurOnSubmit={true}
                  autoFocus={true}
                />
              )}
            </View>
          </View>
          <WASearchHint
            keyboardHeight={this.state.keyboardHeight}
            show={this.state.showSearchHint}
            ref={ref => (this.searchHint = ref)}
            navigation={this.props.route.navigation}
            onNavigation={this._onSearchHintNavigation}
            onApplyCatFilter={this._onSearchHintCatApply}
          />
          {/* Content in ScrollView */}
          <View style={Styles.content}>
            <ScrollView
              horizontal={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
            >
              {/* Component Slide Quảng cáo */}
              <WAAdvertisingBanner
                value={1}
                navigation={this.props.route.navigation}
                listBanners={this.props.banner.listBanners}
              />

              {/* Danh mục dịch vụ */}
              <View style={Styles.catBar}>
                <View style={Styles.rowDanhMuc}>
                  <Text style={Styles.titleCatory}>Danh mục dịch vụ</Text>
                  {/* <View style={{ flexDirection: 'row' }}>
                      <Text style={Styles.titleAll} >Xem tất cả</Text>
                      <Image style={Styles.seeAllIcon} source={require('../assets/images/icon_see_all.png')} />
                    </View> */}
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.cats.map((cat, index) => {
                    let active =
                      this.props.search.filters.cat.indexOf(cat.id) > -1;
                    return (
                      <TouchableOpacity
                        hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
                        onPress={() => {
                          this._onSearchHintCatApply(cat.id);
                        }}
                        style={Styles.cat}
                        key={index}
                      >
                        {/* {
                              active ?
                                <View style={Styles.catIcon}>
                                  <Icon style={Styles.catIconText} name={'check'} />
                                </View>
                                : undefined
                            } */}
                        <Image
                          source={{ uri: cat.cover }}
                          style={Styles.catImage}
                        />
                        <Text style={Styles.catName} numberOfLines={1}>
                          {cat.name}
                        </Text>
                        {/* .toUpperCase() */}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Component Header */}
              <View
                style={{
                  height: 5,
                  backgroundColor: "#E5E5E5",
                  marginBottom: 10
                }}
              ></View>

              {/* Component Flast Deal */}
              <WAFlashDeal
                updateTimeOut={value => {
                  this.props.updateInfo({
                    timeout: value
                  });
                }}
                dataDefaultState={this.props.flastDeals}
                dataDeals={
                  this.props.flastDeals.data
                    ? this.props.flastDeals.data
                    : undefined
                }
                navigation={this.props.route.navigation}
              />

              {/* Component tim kiem gan day */}
              <WARecentSearches
                listRecent={
                  this.props.recentSearch.catsRecent === undefined ||
                  this.props.recentSearch.catsRecent.length == 0
                    ? undefined
                    : this.props.recentSearch.catsRecent
                }
                navigation={this.props.route.navigation}
              />

              {/* Component Salon gần tôi*/}
              <WANearMe
                title={"Salon gần tôi"}
                navigation={this.props.route.navigation}
                params={this.props.near_me_tab.params}
                data={this.props.near_me_tab}
                requestApi={id => {
                  if (!this.props.account.token) {
                    this.requireLogin();
                    return false;
                  }
                  this.props.likeSalon(id, liked => {
                    this.props.updateSalonNearMeLike(id, liked);
                  });
                }}
              />

              {/* Component Salon mới*/}
              <WANewSalon
                title={"Salon mới"}
                onLoadMore={this._loadMore}
                params={this.props.new_search_tab_latest.params}
                mutiple_page={true}
                navigation={this.props.route.navigation}
                data={this.props.new_search_tab_latest}
                requestApi={id => {
                  if (!this.props.account.token) {
                    this.requireLogin();
                    return false;
                  }
                  this.props.likeSalon(id, liked => {
                    this.props.updateSalonNewLike(id, liked);
                  });
                }}
              />

              {/* Component Slide Quảng cáo */}
              <WAAdvertisingBanner
                value={1}
                navigation={this.props.route.navigation}
                listBanners={this.props.banner.listBannersGird}
              />

              {/* Component Header */}
              <View
                style={{
                  height: 5,
                  backgroundColor: "#FFFF",
                  marginBottom: 10
                }}
              ></View>

              {/* Component Salon Custom Deal độc quyền và top salon nam*/}
              <WACustomSalon
                navigation={this.props.route.navigation}
                data={this.props.salon_custom}
                requestApi={id => {
                  if (!this.props.account.token) {
                    this.requireLogin();
                    return false;
                  }
                  this.props.likeSalon(id, liked => {
                    this.props.updateTopSalonNam(id, liked);
                  });
                }}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      search: state.new_search,
      near_me_tab: state.new_home_search_tab_near_me,
      new_search_tab_latest: state.new_home_search_tab_latest,
      home: state.home,
      banner: state.banner,
      recentSearch: state.recentSearch,
      flastDeals: state.flastDeals,
      account: state.account,
      salon_custom: state.new_search_custom_salon
    };
  },
  {
    updateSearchState,

    updateSearchTabLatestState,
    getResultSearchTabLatest,
    updateSalonNewLike,

    updateSearchTabMostBookingState,
    getResultSearchTabMostBooking,

    updateHomeSearchTabNearMeState,
    getResultSearchTabNearMe,
    updateSalonNearMeLike,

    getResultSearchCustomSalon,
    updateSearchCustomSalonState,

    updateSearchTabNearMeState,

    fetchHints,
    getBanners,
    getBannerGird,
    getRecentSearch,
    addRecentSearch,
    getFlastDeals,
    updateInfo,
    likeSalon,
    updateTopSalonNam
  }
)(MemberNewSearchScreen);

const Styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.LIGHT,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 70
  },
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
    // backgroundColor: Colors.PRIMARY,
    backgroundColor: "#FFFFFF",
    padding: 10
  },
  searchInputWrapper: {
    // justifyContent: 'center',
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 2,
    height: 50,
    // paddingLeft: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  searchInput: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 40,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    flex: 1,
    // color: Colors.SILVER_DARK
    color: Colors.TEXT_DARK
  },
  searchInputIcon: {
    height: 20,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: null,
    width: 20
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
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    paddingTop: 10
  },
  rowDanhMuc: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cat: {
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1
    // backgroundColor: Colors.LIGHT,
    //borderColor: Colors.SILVER_LIGHT,
    // borderWidth: 1,
    // borderRadius: 2,
    // paddingTop: 10,
    // paddingBottom: 10
  },
  catImage: {
    marginTop: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover"
    // marginRight: 10
  },
  catName: {
    // fontFamily: GlobalStyles.FONT_NAME,
    flex: 1,
    fontSize: 11,
    marginTop: 5,
    color: Colors.TEXT_DARK,
    textAlign: "center"
  },

  catIcon: {
    position: "absolute",
    left: 40,
    top: 10,
    zIndex: 1,
    // backgroundColor: Colors.DARK,
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
  },
  titleCatory: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 0,
    paddingTop: 5
  },
  titleAll: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    textAlign: "right",
    fontSize: 13
  },
  search_box: {
    flex: 1,
  },
  titleSearch: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: "black",
    marginLeft: 7,
  },
  titleAllServices: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    marginLeft: 7
  },
  seeAllIcon: {
    height: 10,
    width: 5,
    marginLeft: 5,
    justifyContent: "flex-end",
    marginTop: 5
  }
});

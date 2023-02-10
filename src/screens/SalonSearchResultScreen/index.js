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
import PageContainer from "../../components/PageContainer";
import GlobalStyles from "../../styles/GlobalStyles";
import Colors from "../../styles/Colors";
import WAButton from "../../components/WAButton";
import WALoading from "../../components/WALoading";
import NewUserFormStyles from "../../styles/NewUserFormStyles";
import { connect } from "react-redux";
import Utils from "../../configs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DotIndicator, PulseIndicator } from "react-native-indicators";
import Svg, { Circle, G, Polygon } from "react-native-svg";
import numeral from "numeral";
import WAStars from "../../components/WAStars";
import WALightBox from "../../components/WALightBox";
import BallIndicator from "react-native-indicators/src/components/ball-indicator";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SceneMap, TabView } from "react-native-tab-view";
import ImageSources from "../../styles/ImageSources";
import SearchTabList from "../SearchTabList";
import SearchTabNearMeScreen from "../SearchTabNearMeScreen";
import SearchTabLatestScreen from "../SearchTabLatestScreen";
import SearchTabMostBookingScreen from "../SearchTabMostBookingScreen";
import {
  getResultSearchTabLatest,
  updateSearchTabLatestState
} from "../../redux/search_tab_latest/actions";
import {
  getResultSearchTabMostBooking,
  updateSearchTabMostBookingState
} from "../../redux/search_tab_most_booking/actions";
import {
  updateSearchTabNearMeState,
  getResultSearchTabNearMe
} from "../../redux/search_tab_near_me/actions";

import { updateSearchState } from "../../redux/new_search/actions";
import WASearchHint from "../../components/SearchHint";
import { fetchHints } from "../../redux/search_hint/actions";
import { NavigationEvents } from "react-navigation";
import { updateDeviceUserIDTag } from "../../oneSignal";
import SearchHintResult from "./SearchHintResult";

type Props = {};

const search_types = Utils.getSearchType();

const defaultFilters = Utils.getDefaultFilters();

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;

class SalonSearchResultScreen extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      keyword: props.navigation.getParam('keyword') || '',
      autoFocus: false
    };
  }

  _autoFocusSearchInput = () => {
    if (this.state.autoFocus) {
      this.setState(
        {
          autoFocus: false
        },
        () => {
          this.keywordInput.focus();
        }
      );
    }
  };

  _applyToSearch = () => {

  };

  componentDidMount() {
    this._updateKeyword();
  }

  _applyCatFilter = cat_id => {
    this.props.navigation.push("member_salon_search", {
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

  _checkRememberKeywordAndApply = () => {
    this.setState({
      showSearchHint: false
    });
  };

  _submitSearch = () => {
    this._applyToSearch();
  };

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
        this.keywordInput.blur();
        this._applyCatFilter(cat_id);
      }
    );
  };

  componentWillMount() {
    this.timer = null;
  }

  _onInputKeyword = keyword => {
    this.setState({ keyword }, this._updateKeyword);
  };

  _onSearchHintNavigation = () => {
    this.setState({
      autoFocus: true
    });
  };

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
            <TouchableOpacity onPress={this.goBack} hitSlop={backButtonHitslop} style={Styles.backButton}>
              <Icon name="arrow-back" color={Colors.LIGHT} size={24}/>
            </TouchableOpacity>
            <View style={Styles.searchInputWrapper}>
              <Icon name={"search"} style={Styles.searchInputIcon} />
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
                ref={ref => (this.keywordInput = ref)}
                onSubmitEditing={this._submitSearch}
                blurOnSubmit={true}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("change_search_type", {
                    apply: this._applyToSearch
                  });
                }}
                hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
                style={Styles.searchType}
              >
                <Text style={Styles.searchTypeText}>
                  {this.props.search.search_type.title}
                  <Text style={Styles.searchLocation}>
                    {this.state.index !== 1 ? (
                      <Text>
                        {"\n"}
                        {this.props.search.search_location.name}
                      </Text>
                    ) : (
                      <Text>
                        {"\n"}
                        Gần tôi
                      </Text>
                    )}
                  </Text>
                </Text>
                <Icon name={"arrow-drop-down"} />
              </TouchableOpacity>
            </View>
          </View>
          <SearchHintResult
            keyboardHeight={0}
            show
            ref={ref => (this.searchHint = ref)}
            navigation={this.props.navigation}
            onNavigation={this._onSearchHintNavigation}
            onApplyCatFilter={this._onSearchHintCatApply}
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
)(SalonSearchResultScreen);

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
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 30, height: 30,
    marginRight: 5,
  },
  searchInputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.LIGHT,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 5,
    flex: 1,
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

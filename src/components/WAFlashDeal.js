import React, { PureComponent } from "react";

import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableOpacity
} from "react-native";

import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import GlobalStyles from "../styles/GlobalStyles";
import CardView from "react-native-cardview";
import WAStarsCustom from "./WAStarsCustom";
import WAProgressBar from "./progressbar/WAProgressBar";
import WACountDown from "./countdown/WACountDown";

export default class WAFlashDeal extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.setState({});
  };

  render() {
    if (this.props.dataDeals && this.props.dataDeals.items.length > 0) {
      return this.props.dataDefaultState.timeout === false ? (
        <View style={Styles.content}>
          <View style={Styles.header}>
            <Image
              style={Styles.flastIcon}
              source={require("../assets/images/icon_flast_deal.png")}
            />
            <Text style={Styles.textFlastDeal}>FLash Deal</Text>
            <WACountDown
              updateTimeOut={this.props.updateTimeOut}
              expirydate={this.props.dataDeals.end_date}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("home_result", {
                  query: {"key" : "FlashDeal"}
                });
             }}>
             <Text style={Styles.textSeeAll}>Xem tất cả</Text>
            </TouchableOpacity>
            <Image
              style={Styles.seeAllIcon}
              source={require("../assets/images/icon_see_all.png")}
            />
          </View>

          <View style={Styles.list}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={Styles.container}
              data={this.props.dataDeals.items}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        </View>
      ) : (
        <View></View>
      );
    } else {
      return <View></View>;
    }
  }

  _keyExtractor = (item, index) => {
    return item.id + "index" + index;
  };

  _goToSalon = salonId => {
    this.props.navigation.navigate("home_salon", { id: salonId });
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._goToSalon(item.id);
        }}
      >
        <View
          style={Styles.itemCard}
          //   cardElevation={7}
          //   cardMaxElevation={7}
          //   cornerRadius={5}
        >
          <View style={Styles.itemImageAndPrice}>
            <Text style={Styles.price}>{item.price / 1000 + " đ"}</Text>
            <Image style={Styles.image} source={{ uri: item.image }} />
          </View>
          <View style={Styles.itemContent}>
            <Text style={Styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={Styles.itemAddressText} numberOfLines={1}>
              {item.address}
            </Text>
            <View style={Styles.star}>
              <Text style={Styles.valuesStar}>{item.rating}</Text>
              <WAStarsCustom
                style={Styles.salonRatingInfo}
                starInfo={""}
                rating={item.rating}
                set={"2"}
              />
              <Text style={Styles.itemDescription}>({item.rating_count})</Text>
            </View>
            <Text style={Styles.dealRest} numberOfLines={1}>
              Deal còn lại {this.props.dataDeals.limit - item.deal_done}/
              {this.props.dataDeals.limit}
            </Text>
            <WAProgressBar
              progress={
                item.deal_done *
                (this.props.dataDeals.limit > 0
                  ? 100 / this.props.dataDeals.limit
                  : 1)
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const Styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 10
  },
  optionIcon: {
    marginRight: 10,
    fontSize: 25,
    color: Colors.PRIMARY
  },
  header: {
    flexDirection: "row",
    alignItems: "center"
    // borderTopColor: Colors.GRAY_LIGHT,
    // borderTopWidth: 5,
  },
  textFlastDeal: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 5,
    marginLeft: 7,
    paddingRight: 5
  },
  textSeeAll: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    textAlign: "right",
    fontSize: 13
  },
  list: {},
  itemCard: {
    flexDirection: "column",
    alignItems: "center",
    width: 165,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    marginRight: 15,
    borderRadius: 7,
    paddingBottom: 10
  },
  image: {
    width: 165,
    height: 95,
    resizeMode: "cover",
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7
  },
  optionText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.TEXT_DARK,
    flex: 1
  },
  container: {
    marginTop: 10,
    flex: 1
  },
  itemImageAndPrice: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  price: {
    position: "absolute",
    zIndex: 1,
    padding: 4,
    backgroundColor: Colors.PRIMARY,
    color: Colors.LIGHT
  },
  title: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.DARK,
    flex: 1,
    fontWeight: "bold"
  },
  itemAddressText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.SILVER_DARK,
    flex: 1
  },
  dealRest: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: "#868686",
    marginBottom: 3,
    flex: 1
  },
  itemContent: {
    flexDirection: "column",
    width: 155,
    paddingLeft: 3,
    alignItems: "flex-start"
  },
  star: {
    flexDirection: "row",
    width: 155,
    marginTop: 1
  },
  valuesStar: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    paddingRight: 2,
    color: Colors.DARK,
    marginTop: 6
  },
  salonRatingInfo: {
    flexDirection: undefined,
    alignItems: "flex-start",
    marginTop: 5
  },
  itemDescription: {
    fontSize: 11,
    color: Colors.SILVER_DARK,
    marginTop: 7
  },
  flastIcon: {
    height: 30,
    width: 15
  },
  seeAllIcon: {
    height: 10,
    width: 5,
    marginLeft: 5,
    justifyContent: "flex-end",
    marginTop: 4
  }
});

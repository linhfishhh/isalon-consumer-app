import React, { PureComponent } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import CardView from "react-native-cardview";
import numeral from "numeral";
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import WAStarsCustom from "./WAStarsCustom";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class WANearMe extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // data : data
    };
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={Styles.promo}
        onPress={() => {
          this._goToSalon(item.id);
        }}
      >
        <View
          style={Styles.itemCard}
          //   cardElevation={7}
          //   cardMaxElevation={7}
          //   cornerRadius={7}
        >
          <View style={Styles.itemImageAndPrice}>
            <TouchableOpacity
              onPress={() => {
                this.props.requestApi(item.id);
              }}
              style={Styles.showcaseLike}
            >
              <Icon
                style={[Styles.showcaseLikeIcon, item.liked && Styles.iconLike]}
                name={item.liked ? "favorite" : "favorite-border"}
              />
            </TouchableOpacity>

            {item.sale_off_up_to !== 0 ? (
              <Text style={Styles.promotion}>-{item.sale_off_up_to}%</Text>
            ) : (
              undefined
            )}
            <Image style={Styles.image} source={{ uri: item.cover }} />
          </View>
          <View style={Styles.itemContent}>
            <Text style={Styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={Styles.itemAddressText} numberOfLines={1}>
                {item.address}
              </Text>
              <Icon style={Styles.itemAddressIcon} name={"place"} />
              <Text style={Styles.itemKmText}>
                {numeral(item.distance / 1000.0).format("0.0")}Km
              </Text>
            </View>
            <View style={Styles.star}>
              <Text style={Styles.valuesStar}>{item.rating}</Text>
              <WAStarsCustom
                style={Styles.salonRatingInfo}
                starInfo={""}
                rating={item.rating}
                set={"2"}
              />
              <Text style={Styles.itemDescription}>({item.rating_count})</Text>
              <Text style={Styles.itemTextPrice}>
                từ {item.price_from / 1000}k
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = (item, index) => {
    return item.id + "index" + index;
  };

  _goToSalon = salonId => {
    this.props.navigation.navigate("home_salon", { id: salonId });
  };

  _loadMore = () => {
    if (!this.props.mutiple_page) {
      return;
    }
    if (this.props.data.loading || this.props.data.loading_more) {
      return;
    }
    if (this.props.onLoadMore) {
      this.props.onLoadMore();
    }
  };

  render() {
    return this.props.data.loading ? (
      <DotIndicator count={3} size={5} color={Colors.PRIMARY} />
    ) : this.props.data.result.items.length > 0 ? (
      <View style={Styles.content}>
        <View style={Styles.rowDanhMuc}>
          <Text style={Styles.titleCatory} numberOfLines={1}>{this.props.title}</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("home_result", {
                query: this.props.params
              });
            }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={Styles.titleAll}>Xem tất cả</Text>
              <Image
                style={Styles.seeAllIcon}
                source={require("../assets/images/icon_see_all.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          // onEndReached={this._loadMore}
          onEndReachedThreshold={0.5}
          style={Styles.container}
          data={this.props.data.result.items}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    ) : (
      <View></View>
    );
  }
}
const Styles = StyleSheet.create({
  loadingZone: {
    paddingTop: 90,
    paddingLeft: 5,
    paddingRight: 5
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 5,
    // marginTop : 5,
    paddingRight: 10
  },
  rowDanhMuc: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleCatory: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    textAlign: "left",
    flex : 1,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    paddingRight: 5
  },
  titleAll: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    textAlign: "right",
    fontSize: 13
  },
  seeAllIcon: {
    height: 10,
    width: 5,
    marginLeft: 5,
    justifyContent: "flex-end",
    marginTop: 5
  },
  container: {
    marginTop: 10,
    flex: 1
  },
  itemCard: {
    flexDirection: "column",
    alignItems: "center",
    width: 260,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    marginRight: 15,
    borderRadius: 7,
    paddingBottom: 10,
    marginBottom: 10
  },
  image: {
    width: 260,
    height: 150,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    resizeMode: "cover"
  },
  itemContent: {
    flexDirection: "column",
    width: 260,
    paddingLeft: 3,
    alignItems: "flex-start",
    paddingLeft: 15
  },
  star: {
    flexDirection: "row",
    width: 260,
    marginTop: 5
  },
  valuesStar: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    paddingRight: 2,
    color: Colors.DARK,
    marginTop: 6
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
    marginBottom: 10
  },
  price: {
    position: "absolute",
    zIndex: 1,
    padding: 7,
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
    flex: 1,
    color: Colors.SILVER_DARK,
    marginTop: 5
  },
  itemDescription: {
    fontSize: 11,
    color: Colors.SILVER_DARK,
    marginTop: 6,
    flex: 0.5
  },
  showcaseLike: {
    fontSize: 30,
    color: Colors.LIGHT,
    position: "absolute",
    zIndex: 1,
    padding: 10
  },
  showcaseLikeIcon: {
    fontSize: 30,
    color: Colors.LIGHT
  },
  iconLike: {
    // position: 'absolute',
    // zIndex: 1,
    // padding: 10,
    color: Colors.PRIMARY
  },
  itemAddressIcon: {
    color: Colors.SILVER_DARK,
    marginLeft: 3,
    marginTop: 7
  },
  itemKmText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.SILVER_DARK,
    marginTop: 5,
    marginRight: 10
  },
  itemTextPrice: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.ORANGE,
    marginTop: 4,
    flex: 0.5,
    fontWeight: "bold"
  },
  salonRatingInfo: {
    flexDirection: undefined,
    alignItems: "flex-start",
    marginTop: 5
  },
  promotion: {
    position: "absolute",
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    marginTop: 10,
    backgroundColor: Colors.PRIMARY,
    color: Colors.LIGHT,
    borderRadius: 15,
    marginLeft: 200
  }
});

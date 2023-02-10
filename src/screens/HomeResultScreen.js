import React, {Component, PureComponent} from "react";
import {
    FlatList,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Image
} from "react-native";
import {DotIndicator} from "react-native-indicators";
import Icon from "react-native-vector-icons/MaterialIcons";

import PageContainer from "../components/PageContainer";
import WAStars from "../components/WAStars";
import Colors from "../styles/Colors";
import GlobalStyles from "../styles/GlobalStyles";
import ImageSources from "../styles/ImageSources";
import {connect} from 'react-redux';
import {doFullSearch, resetFullSearch, updateFullSearchResultLikes,updateInfo} from "../redux/search/actions";
import {NavigationEvents} from "react-navigation";
import {likeSalon} from "../redux/likes/actions";
import Svg, {Line, Path} from "react-native-svg";
import WASearchFilter from "../components/WASearchFilter";
import numeral from 'numeral';
import WAAlert from "../components/WAAlert";

type Props = {};

class HomeResultScreen extends PureComponent<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            items: [],
            query: {},
            loginAlert: false
        };
    }

    _loadItems = () => {
        if (this.props.search.fetching) {
          return;
        }
        if (this.state.query.key === "FlashDeal") {
            return;
        } else if (this.state.query.key === "CustomSalon") {
            return;
        } else {
          this.props.doFullSearch(this.state.query);
        }
      };
    
      componentDidMount() {
        this.setState(
          {
            query: this.props.navigation.getParam("query")
          },
          async () =>{
            if (this.state.query.key === "FlashDeal") {
              var value = this.props.flastDeals.data.items;
              value = value.map((items) => {
                return(
                    {
                        ...salon,
                        distance : numeral(salon.distance / 1000.0).format("0.0"),
                        image: {
                            uri: items.image
                        }
                    }
                )
            })
              this.props.updateInfo({
                fullSearchResult: {
                  result: value
                }
              });
            } else if (this.state.query.key === "CustomSalon") {
                var value = [];
                this.props.salon_custom.items.map((item) => {
                    if(item.id == this.state.query.id)
                    value = item.salons;
                    return;
                })
                value = value.map((salon) => {
                    return(
                        {
                            ...salon,
                            distance : numeral(salon.distance / 1000.0).format("0.0"),
                            image: {
                                uri: salon.cover
                            }
                        }
                    )
                })
                this.props.updateInfo({
                    fullSearchResult: {
                      result: value,
                    }
                  });
            } else {
              this._loadItems();
            }
          }
        );
      }

    _applyFilter = (query) => {

        this.props.navigation.navigate('home_result');
        this.props.resetFullSearch();
        if (this.props.search.fetching) {
            return;
        }
        this.setState(
            {
                query: query
            },
            () => {
                this.props.doFullSearch(this.state.query);
                this._loadItems();
            }
        );
    };

    componentWillUnmount() {
        this.props.resetFullSearch();
    }

    requireLogin = () => {
        this.setState({
            loginAlert: true
        });
    };

    _renderItem = ({item, index}) => {
        return <Item requireLogin={this.requireLogin} 
        last={item.id ? item.id===this.props.search.fullSearchResult.result[this.props.search.fullSearchResult.result.length-1].id : {}}
         navigation={this.props.navigation} data={item} key={index}/>;
    };
    _renderHeader = () => {
        return (
            <Text style={Styles.pageHeaderTitle}>
                Hãy chọn cho mình {"\n"}những dịch vụ tốt nhất
            </Text>
        );
    };
    _renderFooter = () => {
        return <Loading/>;
    };
    _keyExtractor = (item, index) => {
        return "" + index;
    };

    _loadingIcon = () => {
        return this.props.search.fetching ? (
            <DotIndicator size={5} color={Colors.PRIMARY} count={3}/>
        ) : (
            undefined
        );
    };

    _renderEmpty = () => {
        return (
            <View style={Styles.empty}>
                <Icon style={Styles.emptyIcon} name={'sentiment-very-dissatisfied'} />
                <Text style={Styles.emptyText}>Không có salon nào tương ứng</Text>
            </View>
        );
    };

    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                rightComponent={this._loadingIcon()}
            >
                <WAAlert
                    title={'Đăng nhập'}
                    question={'Vui lòng đăng nhập để sử dụng chức năng này'}
                    titleFirst={true}
                    show={this.state.loginAlert} yesTitle={'Đăng nhập'} noTitle={'Lần sau'} yes={()=>{
                    this.setState({loginAlert: false}, ()=>{
                        this.props.navigation.navigate('new_login', {hasBack: true});
                    });

                }} no={()=>{
                    this.setState({loginAlert: false});
                }}/>
                <NavigationEvents
                    onWillFocus={payload => {

                    }}
                />
                <FlatList
                    style={Styles.container}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    data={this.props.search.fullSearchResult.result}
                    ListFooterComponent={
                        this.props.search.fetching ? this._renderFooter : this.props.search.fullSearchResult.result.length>0?<View style={Styles.blankBottom}/>: undefined
                    }
                    keyExtractor={this._keyExtractor}
                    onEndReached={this._loadItems}
                    //onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        !this.props.search.fetching ? this._renderEmpty : undefined
                    }
                />
                <WASearchFilter
                    addressText={
                        this.state.query && this.state.query.address_text?
                            this.state.query.address_text:
                            'Địa điểm'
                    }
                    query={this.state.query?this.state.query:{}} onApply={this._applyFilter} styleRight={false} navigation={this.props.navigation} />
            </PageContainer>
        );
    }
}

export default connect(
    state => {
        return {
            search: state.search,
            flastDeals: state.flastDeals,
            salon_custom: state.new_search_custom_salon,
        }
    },
    {
        updateInfo,
        doFullSearch,
        resetFullSearch,
    }
)(HomeResultScreen)

const touchSize = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
};

class IItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            liked: false
        };
    }

    _goToSalon = () => {
        this.props.navigation.navigate("home_salon", {
            id: this.props.data.id
        });
    };
    _like = () => {
        if(!this.props.account.token){
            this.props.requireLogin();
            return false;
        }
        this.props.likeSalon(this.props.data.id, (liked) => {
            this.props.updateFullSearchResultLikes(this.props.data.id, liked);
        })
    };
    _loadCats = () => {
        if(this.props.data.services !== undefined && this.props.data.services.length > 0) {
        return this.props.data.services.map((item, index) => {
            return (
                <TouchableOpacity
                    hitSlop={touchSize}
                    onPress={() => {
                        this._goToService(item.id)
                    }}
                    key={index}
                    style={[Styles.itemCat, {backgroundColor: item.color.trim()}]}
                >
                    <Text style={[Styles.itemCatText, {color: item.text_color.trim()}]}>
                        {item.name} .{item.price}
                    </Text>
                </TouchableOpacity>
            );
        });
        }else{
            return (<View></View>);
        }
    };
    _goToService = (id) => {
        this.props.navigation.navigate("home_service", {
            id: id
        });
    };

    render() {
        let item = this.props.data;
        return (
            <View style={[Styles.item]}>
                {
                    item.sale_up_to_percent?
                        <View style={Styles.saleUpTo}>
                            <Text style={Styles.saleUpToText}>
                                GIẢM ĐẾN {item.sale_up_to_percent}%
                            </Text>
                        </View>
                        :undefined
                }
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this._goToSalon}
                    style={Styles.itemCover}
                >     
                   <ImageBackground style={Styles.itemCoverImage} source={item.image}>
                        <TouchableOpacity
                            hitSlop={touchSize}
                            onPress={this._like}
                            style={Styles.likeSalon}
                        >
                            <Icon
                                style={[
                                    Styles.likeSalonIcon,
                                    item.liked && Styles.likeSalonIconLiked
                                ]}
                                name={item.liked ? "favorite" : "favorite-border"}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    
                </TouchableOpacity>
                <View style={Styles.itemBody}>
                    <View style={Styles.itemTitle}>
                        <TouchableOpacity onPress={this._goToSalon}>
                            <Text style={Styles.itemTitleText}>{item.name} {item.verified?<Icon style={Styles.salonVerified} name={'check-circle'}/>:undefined}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.itemAddress}>
                        <View style={Styles.itemAddressTextWrapper}>
                            <Text numberOfLines={1} style={Styles.itemAddressText}>
                                {item.address_cache}
                            </Text>
                        </View>
                        {
                            item.distance ? 
                            <View style={Styles.itemAddressDistance}>
                            <Icon
                                style={Styles.itemAddressDistanceIcon}
                                name={"location-on"}
                            />
                           <Text style={Styles.itemAddressDistanceText}>
                            {item.distance}Km
                            </Text>
                            </View>
                            : undefined
                        }
                       
                    </View>
                    <View style={Styles.itemRatingPrice}>
                        <Text style={Styles.itemRatingNumber}>{item.rating}</Text>
                        <View style={Styles.itemRating}>
                            <WAStars
                                set={"2"}
                                rating={item.rating}
                                starInfo={"( " + item.rating_count + " )"}
                            />
                        </View>
                        {item.price ? 
                            <Text style={Styles.itemPrice}>Từ {item.price}</Text>
                        : undefined}
                    </View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={Styles.itemCats}
                    >
                        {this._loadCats()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const Item = connect(
    state => {
        return {
            likes: state.likes,
            account: state.account
        }
    },
    {
        likeSalon,
        updateFullSearchResultLikes
    }
)(IItem);

class Loading extends PureComponent {
    render() {
        let item = [];
        for (let i = 1; i <= 2; i++) {
            item.push(
                <View key={"placeholder=" + i} style={Styles.item}>
                    <View style={Styles.itemCover}>
                        <View style={Styles.itemCoverPlaceholder}/>
                    </View>
                    <View style={Styles.itemBody}>
                        <View style={Styles.itemTitle}>
                            <View style={Styles.itemTitleTextPlaceholder}/>
                        </View>
                        <View style={Styles.itemAddress}>
                            <View style={Styles.itemAddressTextWrapper}>
                                <View style={Styles.itemAddressTextPlaceholder}/>
                            </View>
                            <View style={Styles.itemAddressDistancePlaceholder}/>
                        </View>
                        <View style={Styles.itemRatingPrice}>
                            <View style={Styles.itemRating}>
                                <View style={Styles.itemRatingPlaceholder}/>
                            </View>
                            <View style={Styles.PricePlaceholder}/>
                        </View>
                        <View style={Styles.itemCats}>
                            <View style={Styles.itemCatPlaceholder}>
                                <View style={Styles.itemCatPlaceholderItem}/>
                                <View style={Styles.itemCatPlaceholderItem}/>
                                <View style={Styles.itemCatPlaceholderItem}/>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        return item;
    }
}

const Styles = StyleSheet.create({
    empty: {
        margin: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    emptyIcon: {
      fontSize: 50,
        marginRight: 20
    },
    emptyText: {
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
        color:  Colors.TEXT_DARK,
        flex: 1
    },
    pageWrapper: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
    },
    container: {
        flex: 1,
    },
    pageHeaderTitle: {
        color: Colors.TEXT_DARK,
        fontSize: 25,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: "bold",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    blankBottom: {
        height: 80,
        backgroundColor: Colors.SILVER_LIGHT
    },
    item: {
        borderBottomWidth: 10,
        borderBottomColor: Colors.SILVER_LIGHT
    },
    itemCover: {
        height: Dimensions.get('window').width*3.0/4.0,
    },
    saleUpToText: {
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 30,
        paddingLeft: 20,
        paddingRight: 20,
        color: Colors.LIGHT,
    },
    saleUpTo: {
        position: 'absolute',
        backgroundColor: Colors.PRIMARY,
        right: 15,
        top: 250 - 14,
        zIndex: 99,
        borderRadius: 15,
        elevation: 2,
        shadowOpacity: 0.75,
        shadowRadius: 3,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { height: 0, width: 0 },
    },
    itemCoverPlaceholder: {
        flex: 1,
        backgroundColor: Colors.SILVER_LIGHT
    },
    itemBody: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    itemTitle: {
        marginBottom: 10
    },
    itemTitleTextPlaceholder: {
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "50%"
    },
    itemAddress: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    itemAddressTextWrapper: {
        flex: 1
    },
    itemAddressTextPlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "70%"
    },
    itemAddressDistancePlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "10%"
    },
    itemRatingPrice: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    itemRating: {
        flex: 1
    },
    itemRatingPlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "55%"
    },
    PricePlaceholder: {
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "15%"
    },
    itemCats: {},
    itemCatPlaceholder: {
        flexDirection: "row"
    },
    itemCatPlaceholderItem: {
        flex: 1,
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        marginRight: 5
    },
    itemCoverImage: {
        flex : 1,
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
    itemTitleText: {
        color: Colors.TEXT_DARK,
        fontSize: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: "bold",
    },
    likeSalon: {
        position: "absolute",
        right: 15,
        top: 15
    },
    likeSalonIcon: {
        fontSize: 30,
        color: Colors.LIGHT
    },
    likeSalonIconLiked: {
        color: Colors.PRIMARY
    },
    itemAddressText: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemAddressDistance: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemAddressDistanceIcon: {
        color: Colors.SILVER_DARK,
        fontSize: 15,
        marginRight: 2
    },
    itemAddressDistanceText: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemRatingNumber: {
        fontSize: 15,
        marginRight: 5,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: "bold",
        color: Colors.TEXT_DARK
    },
    itemPrice: {
        color: Colors.PRIMARY,
        fontSize: 17,
        fontWeight: "bold",
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemCat: {
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
    },
    itemCatText: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 30
    },

    salonVerified:{
        fontSize: 16,
        color: 'green',
    }
});

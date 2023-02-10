import React, {Component} from 'react';
import {Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground} from 'react-native';
import HomeSectionPageContainer from "../components/HomeSectionPageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import ImageEx from 'react-native-scalable-image';
import Shimmer from 'react-native-shimmer-placeholder'
import {connect} from 'react-redux';
import WAAvatar from "../components/WAAvatar";
import Utils from '../configs';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WAStars from '../components/WAStars';
import numeral from 'numeral';


class MemberHomeScreen extends Component{
    static defaultProps = {
        accountName: 'Minh Trang',
        avatar: ImageSources.IMG_AVATAR
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            items: [],
            avatarLoadError: false,
            promo_salons: {
                items: []
            }
        }
    };
    _renderPlaceholders = () => {
        return [1, 2].map((item, index) => {
            return (
                <View key={index} style={[Styles.item, Styles.placeholder]}>
                    <Shimmer style={Styles.placeholderBlock1} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                    <Shimmer style={Styles.placeholderBlock2} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                    <Shimmer style={Styles.placeholderBlock2} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                    <Shimmer style={Styles.placeholderBlock3} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                    <Shimmer style={Styles.placeholderBlock4} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                </View>
            );
        });
    };
    _renderItems = () => {
        return this.state.items.map((item, index)=>{
            return (
                <TouchableOpacity
                    key={index}
                    onPress={()=>{
                        if(!item.query){
                            return;
                        }
                        this.props.route.navigation.navigate('home_result', {
                            query: item.query
                        });
                    }}
                    activeOpacity={0.8} style={[Styles.item, Styles.itemP]}>
                    <ImageEx width={Dimensions.get('window').width - 30} style={Styles.itemImage} source={item.image}/>
                </TouchableOpacity>)
        });
    };
    _loadData = () => {
        this.setState({
            loading: true,
        }, async() => {
            let items = [];
            let promo_salons = {
                items: []
            };
            try{
                let rq = await Utils.getAxios().post('home/index', {v2: true});
                items = rq.data.banners.map((item) => {
                    return {
                        image: {uri: item.image},
                        query: item.query
                    }
                });
                if(promo_salons){
                    promo_salons = rq.data.promo_salons;
                }
            }
            catch (e) {
            }
            finally {
                this.setState({
                    loading: false,
                    refreshing: false,
                    items: items,
                    promo_salons: promo_salons
                });
            }
        });
    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this._loadData();
    };

    componentDidMount() {
        this._loadData();
    }
    _goToAccount = () => {
        this.props.jumpTo('account')
    };

    _goToSalon = (salonId) => {
        this.props.route.navigation.navigate('home_salon', {id: salonId})
    };

    _renderPromoSalons = (item) => {
        return (
          <View style={Styles.promoWrapper}>
            <TouchableOpacity style={Styles.promo}
                onPress={()=>{this._goToSalon(item.item.id);}}
            >
                <ImageBackground style={Styles.promoImage} source={{uri: item.item.image}}/>
                <View style={Styles.promoInfo}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={Styles.promoSalonName}>{item.item.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={Styles.promoCatName}>
                        {this.state.promo_salons.cat.name}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={Styles.promoAddress}>
                        <Icon name={'place'} style={Styles.promoAddressIcon} />
                        <Text>{item.item.address}</Text>
                    </Text>
                    <View style={Styles.promoRating}>
                        <Text style={Styles.promoRatingNum}>{numeral(item.item.rating).format('0.0')}</Text>
                        <WAStars
                          rating={item.item.rating}
                        />
                        <Text style={Styles.promoRatingCount}>{' ( '+item.item.rating_count+' )'}</Text>
                    </View>
                    <Text style={Styles.promoPercent}>Giảm {this.state.promo_salons.percent}%</Text>
                </View>
                <View style={Styles.promoPercentFull}>
                    <View style={[Styles.promoPercentCurrent, {width: (100 - item.item.deal_done_percent)+'%'}]}/>
                    <Text style={Styles.promoStats}>Deal còn lại {this.state.promo_salons.limit - item.item.deal_done} / {this.state.promo_salons.limit}</Text>
                </View>
            </TouchableOpacity>
          </View>
        );
    };

    render() {
        return (
            <HomeSectionPageContainer style={Styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    <View style={Styles.accountInfo}>
                        {
                            this.props.account.token?
                                <Text style={Styles.accountInfoName}>Xin chào, {this.props.account.name}</Text>
                                :<Text style={Styles.accountInfoName}>Xin chào bạn!</Text>
                        }
                        <TouchableOpacity
                            onPress={this._goToAccount}
                            style={Styles.accountInfoAvatar}>
                            {
                                this.props.account.token?
                                    <WAAvatar
                                        style={Styles.accountInfoAvatarImage}
                                    />
                                    :undefined
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={Styles.introText}>
                        Chúng tôi gửi tới bạn những dịch vụ hot
                        nhất ngày hôm nay!
                    </Text>
                    {
                        this.state.promo_salons.items && this.state.promo_salons.items.length > 0?
                          <View style={Styles.dealBlock}>
                              <View style={Styles.dealBlockTitle}>
                                  <Text style={Styles.dealBlockTitleText}>FLASH DEAL</Text>
                              </View>
                              <View style={Styles.dealBlockTitleLine}/>
                              <View style={Styles.dealItems}>
                                  <Carousel
                                    ref={(c) => {
                                        this._carousel = c;
                                    }}
                                    data={this.state.promo_salons.items}
                                    renderItem={this._renderPromoSalons}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width*60/100}
                                    inactiveSlideScale={1}
                                    inactiveSlideOpacity={1}
                                    enableMomentum={true}
                                    activeSlideAlignment={'start'}
                                    activeAnimationType={'spring'}
                                  />
                              </View>
                          </View>
                          :undefined
                    }
                    <View style={Styles.items}>
                        {this.state.loading?this._renderPlaceholders():this._renderItems()}
                    </View>
                </ScrollView>
            </HomeSectionPageContainer>
        );
    }
}

export default connect(
    state=>{
        return {
            account: state.account
        }
    }
)(MemberHomeScreen);

const Styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    dealBlock: {
      marginTop: 15,
        marginBottom: 15
    },
    dealBlockTitle: {
      flexDirection: 'row',
        marginBottom: 10
    },
    dealBlockTitleText: {
      fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 20,
        fontWeight: '500',
        backgroundColor: 'white',
        paddingRight: 10
    },
    dealBlockTitleLine: {
      height: 1,
      backgroundColor: 'black',
        position: 'absolute',
        top: 12,
        left: 0,
        right: 40,
        zIndex: -1
    },
    promoWrapper: {
        marginRight: 20,
    },
    promo: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        borderRadius: 5,
        backgroundColor: Colors.LIGHT,
    },
    promoImage: {
        height: Dimensions.get('window').width*34/100,
        resizeMode: 'cover'
    },
    promoInfo: {
      padding: 5
    },
    promoSalonName: {
      fontFamily: GlobalStyles.FONT_NAME,
      fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'black'
    },
    promoCatName: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
        color: 'black'
    },
    promoAddress: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        marginBottom: 5,
        color: Colors.SILVER_DARK
    },
    promoRating: {
      flexDirection: 'row',
        marginBottom: 5
    },
    promoRatingNum: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.SILVER_DARK,
        marginRight: 10
    },
    promoRatingCount: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.SILVER_DARK,
        marginLeft: 2
    },
    promoPercent: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5
    },
    promoStats: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        height: 30,
        lineHeight: 30
    },
    promoPercentFull: {
        backgroundColor: Colors.SILVER,
    },
    promoPercentCurrent: {
        height: 30,
        backgroundColor: Colors.PRIMARY
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    promoAddressIcon: {
      fontSize: 10,
        marginRight: 2
    },
    accountInfoName: {
        flex: 1,
        fontSize: 22,
        fontWeight: "500",
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    accountInfoAvatar: {

    },
    accountInfoAvatarImage: {
        width: 44,
        height: 44,
        resizeMode: 'cover',
        borderRadius: 22
    },
    introText: {
        color: Colors.SILVER,
        fontSize: 15,
        marginRight: 60,
        fontFamily: GlobalStyles.FONT_NAME
    },
    items: {

    },
    item:{
        marginTop: 15,
        marginBottom: 15,
    },
    itemP: {
        minHeight: 0,
        backgroundColor: Colors.SILVER_LIGHT
    },
    itemImage: {
        //resizeMode: 'contain'

    },
    placeholder: {
        width: '100%',
        borderColor: '#e3d2e2',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10
    },
    placeholderBlock1: {
        marginBottom: 30,
        width: '20%'
    },
    placeholderBlock2: {
        marginBottom: 5,
        height: 30,
        width: '80%'
    },
    placeholderBlock3: {
        marginBottom: 15,
        marginTop: 15
    },
    placeholderBlock4: {
        width: '40%',
        height: 40,
    }
});

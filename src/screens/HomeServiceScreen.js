import React, {Component} from 'react';
import {Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconFA from 'react-native-vector-icons/FontAwesome';
import WAStars from "../components/WAStars";
import WAMapBlock from "../components/WAMapBlock";
import WAReviews from "../components/WAReviews";
import {connect} from 'react-redux';
import {getServiceDetail, updateInfo as UpdateServiceInfo} from "../redux/services/actions";
import {DotIndicator} from 'react-native-indicators'
import AutoHeightWebView from "react-native-webview-autoheight";
import {loadServiceReviews} from "../redux/reviews/actions";
import {addRemoveCartItem, updateInfo as updateCartInfo} from "../redux/cart/actions";
import WAAlert from "../components/WAAlert";
import WAServiceOptions from "../components/WAServiceOptions";


class HomeServiceScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            alert: false,
            alertTitle: '',
            alertMessage: '',
            loginAlert: false,
        };
    }
    componentDidMount(){
        this.props.getServiceDetail(this.props.navigation.getParam('id'))
    }

    requireLogin = () => {
        this.setState({
            loginAlert: true
        });
    };

    addCartItem = (option) => {
        this.props.addRemoveCartItem(
            this.props.service.currentService.salon.id,
            this.props.service.currentService,
            option
        );
        this.props.updateCartInfo({
            screenBeforeCart: 'home_service'
        });
        this.props.navigation.navigate('home_cart_one')
    }

    render() {
        return (
            this.props.service.fetching || this.props.service.currentService === undefined?
                <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                    <StatusBar
                        translucent={true}
                        backgroundColor={'transparent'}
                        barStyle={'dark-content'}
                    />
                    <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                </View>
                :
                <PageContainer
                    darkTheme={true}
                    contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                    navigation={this.props.navigation}
                    backgroundColor={Colors.LIGHT}
                    navigationClose={true}
                    layoutPadding={20}
                    headerTitle={this.props.service.currentService?this.props.service.currentService.salon.name:''}
                    rightComponent={
                        <View style={Styles.headerButtons}>

                            {/*<TouchableOpacity style={Styles.headerButton}>*/}
                                {/*<Icon style={Styles.headerButtonIcon} name={'favorite-border'} />*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    }
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
                    <WAAlert
                        onBack={()=>{this.setState({
                            alert: false
                        })}} show={this.state.alert} title={this.state.alertTitle} question={this.state.alertMessage} titleFirst={true}
                        yes={()=>{
                            this.setState({
                                alert: false
                            })
                        }} no={false} yesTitle={'Đã hiểu'}
                    />
                    <ScrollView>
                        <ImageBackground
                            style={Styles.serviceCover}
                            source={{uri: this.props.service.currentService.cover}}
                        />
                        <View style={Styles.serviceHead}>
                            <Text style={Styles.serviceName}>
                                {this.props.service.currentService.name}
                            </Text>
                            <WAStars starListStyle={Styles.serviceRatingStars} style={Styles.serviceRating} rating={this.props.service.currentService.rating} set={'2'}
                                     starInfo={this.props.service.currentService.ratingCount+' Nhận xét & đánh giá'} />
                            <Text style={Styles.serviceTime}>{this.props.service.currentService.time}</Text>
                            {
                                this.props.service.currentService.logos.length>0?
                                    <ScrollView
                                        horizontal={true}
                                        style={Styles.serviceLogos}>
                                        {
                                            this.props.service.currentService.logos.map((logo, index)=>{
                                                return (
                                                    <Image style={Styles.serviceLogo} key={'logo-'+index} source={{uri: logo}}/>
                                                );
                                            })
                                        }
                                    </ScrollView>
                                    :undefined
                            }
                        </View>
                        <View style={Styles.serviceDescHeadBlock}>
                            <View style={Styles.serviceDescHeadIconWrapper}>
                                <Icon style={Styles.serviceDescHeadIcon} name={'info'} />
                            </View>
                            <Text style={Styles.serviceDescHeadTitle}>Chi tiết dịch vụ</Text>
                        </View>
                        <View style={Styles.serviceDescWrapper}>
                            <AutoHeightWebView
                                style={Styles.serviceDesc}
                                defaultHeight={50}
                                originWhitelist={['*']}
                                startInLoadingState={true}
                                source={
                                    {
                                        baseUrl: '',
                                        html: this.props.service.currentService.info
                                    }
                                }
                            />
                        </View>
                        <View>
                            <View style={Styles.mapInfo}>
                                <View style={Styles.mapSalon}>
                                    <Text style={Styles.mapSalonName}>{this.props.service.currentService.salon.name}</Text>
                                    <Text style={Styles.mapSalonAddress}>{this.props.service.currentService.salon.address}</Text>
                                </View>
                                <View style={Styles.mapDistance}>
                                    <IconFA style={Styles.mapDistanceIcon} name={'map-marker'}/>
                                    <Text style={Styles.mapDistanceText}>{this.props.service.currentService.salon.distance}Km</Text>
                                </View>
                            </View>
                            {/*<WAMapBlock location={{*/}
                                {/*lat: this.props.service.currentService.salon.location.lat,*/}
                                {/*lng: this.props.service.currentService.salon.location.lng*/}
                            {/*}}/>*/}
                        </View>
                        <WAReviews navigation={this.props.navigation}  type={'service'} salon={this.props.service.currentService.salon.id} service={this.props.service.currentService.id} onLoadMore={()=>{this.props.loadServiceReviews(this.props.navigation.getParam('id'))}} />
                    </ScrollView>
                    <View style={Styles.servicePriceBlock}>
                        <View style={Styles.servicePrices}>
                            <Text style={Styles.servicePrice}>
                                {this.props.service.currentService.price}
                            </Text>
                            {
                                this.props.service.currentService.price !== this.props.service.currentService.oldPrice?
                                    <Text style={Styles.servicePriceOld}>
                                        {this.props.service.currentService.oldPrice}
                                    </Text>
                                    :undefined
                            }
                        </View>
                        <View style={Styles.cartButtonWrapper}>
                            <TouchableOpacity
                                onPress={()=>{
                                    if(!this.props.service.currentService.salon.open){
                                        this.setState({
                                            alert: true,
                                            alertTitle: 'Salon ngoại tuyến',
                                            alertMessage: this.props.service.currentService.salon.name+" tạm thời ngoại tuyến không tiếp nhận đơn đặt chỗ mới, nếu bạn muốn đặt chỗ xin vui lòng quay lại sau nhé!"
                                        });
                                        return;
                                    }
                                    if(!this.props.account.token){
                                        this.requireLogin();
                                        return false;
                                    }
                                    if(
                                      !this.props.cart.inCart(this.props.service.currentService.id)
                                    ){
                                        if(this.props.service.currentService.options.length > 0){
                                            this.options.show(this.props.service.currentService, (option)=>{
                                                this.addCartItem(option);
                                            })
                                        }
                                        else{
                                            this.addCartItem(null);
                                        }
                                    }
                                    else{
                                        this.props.updateCartInfo({
                                            screenBeforeCart: 'home_service'
                                        });
                                        this.props.navigation.navigate('home_cart_one')
                                    }
                                }}
                                style={Styles.cartButton} activeOpacity={0.8}>
                                <Text style={Styles.cartButtonText}>{
                                    !this.props.cart.inCart(this.props.service.currentService.id)?
                                        'Đặt chỗ'
                                        :'Đặt chỗ ngay'
                                }</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <WAServiceOptions ref={ref=>this.options=ref}/>
                </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            service: state.service,
            cart: state.cart,
        }
    },
    {
        //UpdateServiceInfo,
        getServiceDetail,
        loadServiceReviews,
        addRemoveCartItem,
        updateCartInfo
    }
)(HomeServiceScreen);

const Styles = StyleSheet.create({
    serviceLogos:{
        flexDirection: 'row',
        marginTop: 15
    },
    serviceLogo:{
        width: 50,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10
    },
    pageWrapper: {
        paddingRight: 0,
        paddingLeft: 0
    },
    serviceCover: {
        height: 250
    },
    headerButtons: {
        flexDirection: 'row'
    },
    headerButtonIcon: {
        fontSize: 25,
        color: Colors.SILVER_DARK
    },
    headerButton: {
        marginLeft: 15
    },
    serviceHead: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    serviceName: {
        fontSize: 25,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
    },
    serviceRating: {
        marginTop: 10
    },
    serviceRatingStars: {
        marginRight: 15
    },
    serviceTime: {
        marginTop: 10,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    serviceDescHeadIconWrapper: {
        width: 30
    },
    serviceDescHeadIcon: {
        fontSize: 25
    },
    serviceDescHeadBlock: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        marginBottom: 15,
        alignItems: 'center'
    },
    serviceDescHeadTitle: {
        fontSize: 21,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
    },
    serviceDescWrapper: {
        marginLeft: 15,
        marginRight: 15
    },
    serviceDesc: {
        marginBottom: 30,
        width: '100%',
    },
    mapInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.LIGHT,
        paddingTop: 25,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT
    },
    mapDistanceText: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    mapDistance: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mapDistanceIcon: {
        fontSize: 20,
        marginRight: 5,
        color: Colors.SILVER_DARK,
    },
    mapSalonName: {
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold'
    },

    mapSalon: {
        flex: 1
    },
    mapSalonAddress: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    servicePriceBlock: {
        backgroundColor: Colors.PRIMARY,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    servicePrices: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    servicePrice: {
        color: Colors.LIGHT,
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginRight: 10
    },
    servicePriceOld: {
        color: Colors.SILVER_LIGHT,
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        textDecorationLine: 'line-through'
    },
    cartButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cartButton: {
        backgroundColor: Colors.LIGHT,
        height: 40,
        justifyContent: 'center',
        borderRadius: 5,
        width: 150,
    },
    cartButtonText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
    },

});

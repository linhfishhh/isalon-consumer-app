import React, {Component} from "react";
import {StyleSheet, View, WebView, Text, Platform} from "react-native";
import Colors from "../styles/Colors";
import {connect} from 'react-redux';
import {createBooking, updateInfo as updateCartInfo} from "../redux/cart/actions";
import {DotIndicator} from 'react-native-indicators';
import GlobalStyles from "../styles/GlobalStyles";
import Icon from  'react-native-vector-icons/MaterialIcons';
import WAButton from "../components/WAButton";
import {cancelBooking, getBookingPaymentLink} from "../redux/booking/actions";
import Utils from '../configs';

class HomeCartPayScreen extends Component {
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            bookingCreated: false,
            bookingID: undefined,
            paymentLink: undefined,
            paymentError: false,
            paymentErrorMessage: '',
            bookingData: undefined,
            webLoading: true,
        };
    }

    componentDidMount(){
        let time =  this.props.navigation.getParam('time');
        let date = this.props.navigation.getParam('date');
        let paymentMethod = this.props.navigation.getParam('paymentMethod');
        let addressInfo = this.props.navigation.getParam('addressInfo');
        this.props.createBooking({
            service_time: date.format('YYYY-MM-DD')+' '+time + ':00',
            payment_method: paymentMethod.id,
            address_id : addressInfo.id
        },(data)=>{
            if(data.payment_method === 'salon'){
                this.props.navigation.replace('home_cart_three', {
                    data: data,
                    time: time,
                    date: date
                });
            }
            else{
                this.setState({
                    bookingCreated: true,
                    paymentLink: data.payment_link,
                    bookingID: data.id,
                    bookingData: data
                });
            }
        });
    }

    _checkStatus = async() => {
            try {
                let rs = await Utils.getAxios(this.props.account.token).post(
                    'booking/check-status',
                    {
                        id: this.state.bookingID
                    }
                );
                let status = rs.data;
                if(status < 0){
                    this.props.updateCartInfo({
                        items: [],
                        salonID: undefined,
                        salonInfo: {}
                    });
                    this.props.navigation.navigate(this.props.cart.screenBeforeCart);
                }
                else if(status === 1){
                    let time =  this.props.navigation.getParam('time');
                    let date = this.props.navigation.getParam('date');
                    this.props.navigation.replace('home_cart_three', {
                        data: this.state.bookingData,
                        time: time,
                        date: date
                    });
                }
            }
            catch (e) {
            }
    };

    _handleNavigationChange = () => {
        let a= new Date().getTime();
        const script = 'window.postMessage("waiting")';
        this.WebView &&    this.WebView.injectJavaScript(script);
    };

    render() {
        return (
            this.state.bookingCreated?
                !this.state.paymentError?
                    <View style={{flex: 1}}>
                        <WebView
                            source={{uri: this.state.paymentLink}}
                            style={{flex: 1}}
                            onLoadStart={()=>{this.setState({webLoading: true})}}
                            scalesPageToFit={false}
                            startInLoadingState={true}
                            onLoadEnd={()=>{
                                this.setState({webLoading: false}, this._checkStatus)
                            }
                            }
                        />
                        {
                            this.state.webLoading?
                                <View style={Styles.webLoading}>
                                    <Text
                                        style={Styles.webLoadingText}
                                    >Đang chờ cổng thanh toán xử lý...</Text></View>
                                :undefined
                        }
                    </View>
                    :
                    <View style={Styles.paymentErrorScreen}>
                        <Icon style={Styles.paymentErrorIcon} name={'sentiment-very-dissatisfied'} />
                        <Text style={Styles.paymentErrorTitle}>LỖI THANH TOÁN</Text>
                        <Text style={Styles.paymentErrorDesc}>
                            "{this.state.paymentErrorMessage}"
                        </Text>
                        <WAButton onPress={()=>{
                            this.props.getBookingPaymentLink(this.state.bookingID, (link)=>{
                                this.setState({
                                    paymentError: false,
                                    paymentErrorMessage: '',
                                    paymentLink: link
                                })
                            });
                        }} style={Styles.button} text={'Thử thanh toán lại'} />
                        <WAButton
                            onPress={()=>{
                                this.props.cancelBooking(this.state.bookingID, ()=> {
                                    this.props.updateCartInfo({
                                        items: [],
                                        salonID: undefined,
                                        salonInfo: {}
                                    });
                                    this.props.navigation.navigate(this.props.cart.screenBeforeCart);
                                });
                            }}
                            style={[Styles.button, Styles.buttonAlt]} text={'Huỷ đơn đặt hàng'} />
                    </View>
                :<View style={{flex: 1, backgroundColor: 'white'}}>
                    <DotIndicator count={3} color={Colors.PRIMARY} size={10}/>
                </View>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            cart: state.cart,
            booking: state.booking
        }
    },
    {
        createBooking,
        getBookingPaymentLink,
        cancelBooking,
        updateCartInfo
    }
)(HomeCartPayScreen);


const Styles = StyleSheet.create({
    paymentErrorScreen: {
        flex: 1,
        backgroundColor: Colors.LIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    paymentErrorTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 25,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        marginBottom: 10
    },
    paymentErrorDesc: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.SILVER_DARK,
        marginBottom: 30
    },
    paymentErrorIcon: {
        fontSize: 60,
        marginBottom: 5,
        color: Colors.PRIMARY,
    },
    button: {
        width: 250,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    buttonAlt: {
        backgroundColor: Colors.DARK
    },
    notes: {
        backgroundColor: Colors.PRIMARY,
        padding: 10
    },
    notesText:{
        color: Colors.LIGHT
    },
    webLoading: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.ERROR
    },
    webLoadingText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.LIGHT,
    }
});

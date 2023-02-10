import React, { Component, PureComponent } from "react";
import {
    View,
    Text,
    ImageBackground,
    FlatList,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    TouchableOpacity, TextInput, Image, Platform
} from "react-native";
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import WALightBox from "../components/WALightBox";
import { Svg, Path } from 'react-native-svg';
import ImageSources from "../styles/ImageSources";
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarStrip from 'react-native-calendar-strip';
import { connect } from 'react-redux';
import { updateBooking, getCartSaloninfo, updateInfo as updateCartInfo } from "../redux/cart/actions";
import { DotIndicator } from 'react-native-indicators'
import NewUserFormStyles from "../styles/NewUserFormStyles";
import WALocation from "../components/WALocation";
import { loadLv1 as loadLocationLv1 } from "../redux/location/actions";
import WAButton from "../components/WAButton";
import { createNewAddressInfo } from "../redux/booking/actions";
import { updateInfo as updateLocationInfo } from '../redux/location/actions';
import WAAlert from "../components/WAAlert";
import { StackActions } from 'react-navigation';
import Utils from '../configs';

class HomeCartStepTwoScreen extends Component {
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            selectedMethod: undefined,
            selectedAddressID: undefined,
            editing: false,
            editName: '',
            editPhone: '',
            editEmail: '',
            editAddress: '',
            editLv1: undefined,
            editLv2: undefined,
            editLv3: undefined,
            showError: false,
            hit: false,
            items: [],
            total: 0,
        };
    }

    _navigateToDetail = (orderId) => {
        this.props.updateCartInfo({
            items: [],
            salonID: undefined,
            salonInfo: {},
            included_items: {
                service_id: 4,
                id: 4, // included option ID
                quantity: 3
            }
        });
        const popAction = StackActions.pop({
            n: 2,
        });
        this.props.navigation.dispatch(popAction);
        this.props.navigation.navigate('home_order_detail', {
            id: orderId,
            title: 'Cám ơn bạn đã đặt chỗ, xin vui lòng chờ salon duyệt yêu cầu của bạn nhé!',
            backgroundColor: '#5567B0'
        });
    }

    _formatDateTimeToISO = (dt) => {
        if (Platform.OS === 'ios') {
            return dt.format('YYYY-MM-DDTHH:mm:ss.sss') + dt.format('Z');
        } else {
            const subtractedDate = moment(dt).subtract(dt.utcOffset(), 'minutes'); // workaround for bug in RNCalendarEvents
            return subtractedDate.format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
        }
    }

    _makeCalendarDateTime = (date, time) => {
        // date is moment object
        // time is string with format HH:mm
        const tmp = date.startOf('day');
        const startDateTime = this._formatDateTimeToISO(tmp.add(moment.duration(time)));
        const endDateTime = this._formatDateTimeToISO(tmp.add(moment.duration(30, 'minutes')));
        return {
            startDate: startDateTime,
            endDate: endDateTime,
        }
    }

    _booking = (data) => {
        let time = this.props.navigation.getParam('time');
        let date = this.props.navigation.getParam('date');
        let bookingId = this.props.navigation.getParam('bookingId');
        let paymentMethod = this.state.selectedMethod;
        let items = this.props.cart.items.map((item) => {
            return {
                id: item.id,
                qty: item.qty
            }
        });
        this.props.updateBooking({
            booking_id: bookingId,
            service_time: date.format('YYYY-MM-DD') + ' ' + time + ':00',
            payment_method: paymentMethod.id,
        }, (data) => {
            RNCalendarEvents.authorizationStatus().then(status => {
                if (status == 'authorized') {
                    const services = this.state.items.reduce((s, item) => {
                        return s + (s.length > 0 ? ', ' : '') + item.name;
                    }, '');
                    const calendarDt = this._makeCalendarDateTime(date, time);
                    RNCalendarEvents.saveEvent(services, {
                        startDate: calendarDt['startDate'],
                        endDate: calendarDt['endDate'],
                        alarms: [{ date: -30 }],
                        location: this.props.cart.salonInfo.address,
                        notes: this.props.cart.salonInfo.name + ', ' + this.props.cart.salonInfo.address
                    }).then((eventId) => {
                    }).catch((e) => {
                    }).finally(() => {});
                }
            })
            .catch((e) => {})
            .finally(() => {
                this._navigateToDetail(data.id);
            });
        });
    };

    componentDidUpdate() {
        if (this.state.selectedMethod === undefined) {
            if (this.props.cart.salonInfo.paymentMethods) {
                this.setState(
                    {
                        selectedMethod: this.props.cart.salonInfo.paymentMethods[0]
                    }
                );
            }
        }
        if (this.state.selectedAddressID === undefined) {
            if (this.props.cart.salonInfo.addresses) {
                if (this.props.cart.salonInfo.addresses.length > 0) {
                    this.setState(
                        {
                            selectedAddressID: this.props.cart.salonInfo.addresses[0].id
                        }
                    );
                }
            }
        }
    }

    componentDidMount() {
        if (!this.props.cart.salonID) {
            return;
        }
        // this.props.updateLocationInfo({
        //     lv1: [],
        //     lv1Title: undefined,
        //     lv1Value: undefined,
        //     lv2: [],
        //     lv2Title: undefined,
        //     lv2Value: undefined,
        //     lv3: [],
        //     lv3Title: undefined,
        //     lv3Value: undefined,
        // });
        // this.props.loadLocationLv1();
        this.props.getCartSaloninfo(this.props.cart.salonID);

        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    let rz = await Utils.getAxios(this.props.account.token).post(
                        'booking/' + this.props.cart.salonID + '/cart-items',
                        {
                            items: this.props.cart.items
                        }
                    );
                    let items = rz.data.items;
                    let total = rz.data.total;
                    this.setState({
                        items: items,
                        loading: false,
                        total: total
                    });
                }
                catch (e) {
                    this.setState({
                        loading: false
                    });
                }
            }
        );

        RNCalendarEvents.authorizeEventStore().then(status => {
        });
    };

    render() {
        let time = this.props.navigation.getParam('time');
        let date = this.props.navigation.getParam('date');
        return (
            this.props.cart.fetching || !this.props.cart.salonInfo.name || this.state.loading ?
                <View style={{ flex: 1, backgroundColor: Colors.LIGHT }}>
                    <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                </View>
                :
                <PageContainer
                    navigation={this.props.navigation} layoutPadding={20}
                    headerContainerStyle={Styles.headerContainerStyle}
                    contentWrapperStyle={Styles.contentWrapperStyle}
                >
                    <ScrollView style={{ flex: 1 }}>
                        <View style={Styles.header}>
                            <View style={Styles.headerContent}>
                                <Text style={Styles.headerStep}>
                                    2/3 bước
                                </Text>
                                <Text style={Styles.headerTitle}>
                                    Đặt chỗ
                                </Text>
                                <Text style={Styles.subHeaderTitle}>Phương thức thanh toán</Text>
                            </View>
                            <TouchableOpacity>
                                <Image
                                    style={Styles.avatar}
                                    source={{ uri: this.props.account.avatar }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.pageContent}>
                            <View style={Styles.orderItems}>
                                <View style={[Styles.orderItem]}>
                                    <View style={Styles.orderItemIcon}>
                                        {ImageSources.SVG_ORDER_DATE}
                                    </View>
                                    <View style={Styles.orderItemInfo}>
                                        <Text style={Styles.orderItemInfoText}>
                                            Ngày {date.format('DD/MM/YYYY')}
                                        </Text>
                                    </View>
                                </View>
                                <View style={Styles.orderItem}>
                                    <View style={Styles.orderItemIcon}>
                                        {ImageSources.SVG_ORDER_TIME}
                                    </View>
                                    <View style={Styles.orderItemInfo}>
                                        <Text style={Styles.orderItemInfoText}>
                                            {time}
                                        </Text>
                                    </View>
                                </View>
                                <View style={Styles.orderItem}>
                                    <View style={Styles.orderItemIcon}>
                                        {ImageSources.SVG_ORDER_ADRESS}
                                    </View>
                                    <View style={Styles.orderItemInfo}>
                                        <Text style={Styles.orderItemInfoText}>
                                            {this.props.cart.salonInfo.name}
                                        </Text>
                                        <Text style={Styles.orderItemInfoDesc}>
                                            {this.props.cart.salonInfo.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={Styles.payment}>
                                {
                                    this.props.cart.salonInfo.paymentMethods.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        selectedMethod: item
                                                    })
                                                }}
                                                key={index} style={[Styles.method, index === 0 && Styles.methodFirst]}>
                                                <View style={Styles.methodChk}>
                                                    <View style={[Styles.methodChkInner, ((this.state.selectedMethod && this.state.selectedMethod.id === item.id) || (!this.state.selectedMethod && index === 0)) && Styles.methodChkInnerChecked]} />
                                                </View>
                                                <View style={Styles.methodInfo}>
                                                    <Text style={Styles.methodName}>{item.title}</Text>
                                                    <Text style={Styles.methodDesc}>
                                                        {item.desc}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <View style={Styles.orderDetails}>
                                <View style={Styles.orderColHeaderRow}>
                                    <View style={Styles.orderColHeaderLeft}>
                                        <Text style={Styles.orderColHeaderText}>Dịch vụ</Text>
                                    </View>
                                    <View style={Styles.orderColHeaderRight}>
                                        <Text style={Styles.orderColHeaderText}>Thành tiền</Text>
                                    </View>
                                </View>
                                {
                                    this.state.items.map((item, index) => {
                                        return (
                                            <View key={index} style={[Styles.orderDetail, index === 0 && Styles.orderDetailFirst]}>
                                                <View style={Styles.orderDetailLeft}>
                                                    <Text style={Styles.orderDetailTitle}>
                                                        {item.name}
                                                        {
                                                            item.option ?
                                                                ' / ' + item.option.name : ''
                                                        }
                                                        {item.promo_text}
                                                    </Text>
                                                    <Text style={Styles.orderDetailSub}>
                                                        Số lượng: {item.qty}
                                                    </Text>
                                                </View>
                                                <View style={Styles.orderDetailRight}>
                                                    <Text style={Styles.orderDetailPrice}>
                                                        {item.price * item.qty}K
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={Styles.orderColHeaderRowBottom}>
                                <View style={Styles.orderColHeaderRow}>
                                    <View style={Styles.orderColHeaderLeft}>
                                        <Text style={Styles.orderColHeaderText}>Tổng tiền</Text>
                                    </View>
                                    <View style={Styles.orderColHeaderRight}>
                                        <Text style={Styles.orderColHeaderTextBold}>{this.state.total}K</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={Styles.submit}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this._booking();
                                        // this.props.navigation.navigate('home_cart_pay', {
                                        //     time: this.props.navigation.getParam('time'),
                                        //     date: this.props.navigation.getParam('date'),
                                        //     paymentMethod: this.state.selectedMethod,
                                        // })
                                        // if(this.state.hit){
                                        //     this.props.updateCartInfo({
                                        //         items: [],
                                        //         salonID: undefined,
                                        //         salonInfo: {}
                                        //     });
                                        //     this.props.navigation.navigate(this.props.cart.screenBeforeCart);
                                        //
                                        // }
                                        // else{
                                        //     this.setState({
                                        //         hit: true
                                        //     }, () => {
                                        //         let addressInfo = undefined;
                                        //         if(this.state.selectedAddressID>0){
                                        //             if(this.props.cart.salonInfo.addresses){
                                        //                 this.props.cart.salonInfo.addresses.every((item) => {
                                        //                     if(item.id === this.state.selectedAddressID){
                                        //                         addressInfo = item;
                                        //                         return false
                                        //                     }
                                        //                     return item;
                                        //                 });
                                        //             }
                                        //         }
                                        //         if(addressInfo === undefined){
                                        //             this.setState({
                                        //                 showError: true
                                        //             });
                                        //             return
                                        //         }
                                        //         this.props.navigation.navigate('home_cart_pay', {
                                        //             time: this.props.navigation.getParam('time'),
                                        //             date: this.props.navigation.getParam('date'),
                                        //             paymentMethod: this.state.selectedMethod,
                                        //             addressInfo: addressInfo
                                        //         })
                                        //     });
                                        // }
                                    }}
                                    style={Styles.submitButton}>
                                    <Text style={Styles.submitButtonText}>Thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <WAAlert no={false} yes={() => { this.setState({ showError: false }) }} show={this.state.showError} question={'Bạn có hoặc chưa chọn thông tin thanh toán nào, vui lòng thêm một thông tin thanh toán'} />
                </PageContainer>
        );
    }

    _createNewAddressInfo = () => {
        this.props.createNewAddressInfo({
            info_name: this.state.editName,
            info_phone: this.state.editPhone,
            info_email: this.state.editEmail,
            info_address: this.state.editAddress,
            info_lv1: this.state.editLv1,
            info_lv2: this.state.editLv2,
            info_lv3: this.state.editLv3
        }, (data) => {
            this.setState({
                selectedAddressID: data.new_address_id
            }, () => {
                this.props.updateCartInfo({
                    salonInfo: {
                        ...this.props.cart.salonInfo,
                        addresses: data.list
                    }
                });
            });

        });
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            cart: state.cart,
            booking: state.booking,
            location: state.location
        }
    },
    {
        getCartSaloninfo,
        updateBooking,
        loadLocationLv1,
        createNewAddressInfo,
        updateCartInfo,
        updateLocationInfo
    }
)(HomeCartStepTwoScreen);

const Styles = StyleSheet.create({
    headerContainerStyle: {},
    contentWrapperStyle: {
        paddingLeft: 0,
        paddingRight: 0
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
    },
    headerContent: {
        flex: 1
    },
    avatar: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 25
    },
    headerStep: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 13
    },
    headerTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10
    },
    subHeaderTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 15,
    },
    pageContent: {
        //paddingLeft: 20,
        //paddingRight: 20,
    },
    orderItems: {
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 4,
        paddingLeft: 20,
        paddingRight: 20,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 7,
        paddingBottom: 7
    },
    orderItemIcon: {
        width: 25,
        marginRight: 15
    },
    orderItemInfoText: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        paddingRight: 30,
        overflow: 'hidden'
    },
    orderItemInfoDesc: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        flex: 1,
        paddingRight: 30,
        overflow: 'hidden'
    },
    orderDetails: {
        marginTop: 5,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 4,
    },
    orderDetail: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 20,
        paddingRight: 20
    },
    orderDetailFirst: {
        borderTopWidth: 0,
    },
    orderDetailLeft: {
        flex: 1
    },
    orderDetailRight: {
        width: 80,
        alignItems: 'flex-end',
    },
    orderDetailTitle: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    orderDetailSub: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    orderDetailPrice: {
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontWeight: 'bold'
    },
    orderColHeaderTextBold: {
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    orderColHeaderRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20
    },
    orderColHeaderLeft: {
        flex: 1
    },
    orderColHeaderRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    orderColHeaderText: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    orderColHeaderRowBottom: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
    },
    payment: {
        paddingLeft: 20
    },
    method: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
    },
    methodInfo: {
        flex: 1
    },
    methodFirst: {
        borderTopWidth: 0,
    },
    methodChk: {
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        height: 24,
        width: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    methodChkInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.TRANSPARENT
    },
    methodChkInnerChecked: {
        backgroundColor: Colors.PRIMARY
    },
    methodName: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginBottom: 10
    },
    methodDesc: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.SILVER_DARK
    },
    submit: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    submitButton: {
        width: '70%',
        backgroundColor: Colors.PRIMARY,
        height: 60,
        justifyContent: 'center',
        borderRadius: 30
    },
    submitButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 19,
        color: Colors.LIGHT,
        textAlign: 'center'
    },
    paymentInfo: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 4,
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15
    },
    paymentInfoText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginBottom: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    paymentInfoItemCheck: {
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        height: 24,
        width: 24,
        borderRadius: 12,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentInfoItemChecked: {
        backgroundColor: '#39B54A',
        borderColor: '#39B54A',
    },
    paymentInfoItemCheckIcon: {
        fontSize: 20,
        color: Colors.LIGHT
    },
    paymentInfoItem: {
        marginTop: 15,
        marginBottom: 15,
        paddingRight: 30
    },
    paymentInfoItemTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
    },
    paymentInfoLine: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.SILVER_DARK,
        marginTop: 2,
        marginBottom: 2
    },
    editInfoLine: {
        marginTop: 10,
        marginBottom: 10
    },
    infoEditInput: {
        height: 45,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 2,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
    },
    locationSelect: {
        borderColor: Colors.SILVER_LIGHT,
        borderRadius: 2,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10
    },
    error: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.ERROR,
        lineHeight: 30
    }
});

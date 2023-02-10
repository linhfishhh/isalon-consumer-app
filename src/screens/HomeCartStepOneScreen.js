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
    TouchableOpacity, TextInput, Image
} from "react-native";
import _ from 'lodash';
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import WALightBox from "../components/WALightBox";
import { Svg, Path } from 'react-native-svg';
import ImageSources from "../styles/ImageSources";
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarStrip from 'react-native-calendar-strip';
import { connect } from 'react-redux';
import { addRemoveCartItem, updateInfo as updateCartInfo } from "../redux/cart/actions";
import moment from 'moment';
import { DotIndicator } from 'react-native-indicators';
import Utils from '../configs';
import WAAlert from "../components/WAAlert";

class HomeCartStepOneScreen extends Component {
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            items: [
            ],
            total: 0,
            times: [

            ],
            selectTime: undefined,
            // selectedDate: moment(new Date()).add(1, 'days'),
            selectedDate: moment(new Date()),
            loading: false,
            alert: false,
            alertMessage: '',
            timeList: {
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: []
            },
        };
    }

    _onDateSelected = (date) => {
        let day = date.day();
        if (day === 0) {
            day = 7;
        }
        let ls = [];
        let ls_ = this.state.timeList[day];
        ls = ls_.filter((item) => {
            let test = date.format('Y/M/D') + ' ' + item;
            test = moment(test, 'Y/M/D HH:mm');
            if (test.diff(moment(), 'minutes') < 60) {
                return false
            }
            return true;
        });
        let has = false;
        ls.every((item) => {
            if (item === this.state.selectTime) {
                has = true;
                return false;
            }
            return item;
        });
        if (ls.length === 0) {
            this.setState(
                {
                    times: ls
                }
            );
        }
        else {
            this.setState(
                {
                    times: ls,
                    selectTime: has ? this.state.selectTime : ls[0]
                }
            );
        }
    };

    _load = () => {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    let rq = await Utils.getAxios(this.props.account.token).post(
                        'salon/' + this.props.cart.salonID + '/open-time-list'
                    );
                    let data = rq.data;
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
                        total: total,
                        timeList: data
                    }, () => {
                        // this._onDateSelected(moment().add(1, 'day'));
                        this._onDateSelected(moment());
                    });
                }
                catch (e) {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    };


    _updateQty = (id, amount) => {
        this.props.updateCartInfo(
            {
                items: this.props.cart.items.map((item) => {
                    if (item.id !== id) {
                        return item;
                    }
                    let newAmount = item.qty + amount;
                    if (newAmount <= 0) {
                        newAmount = 1;
                    }
                    return {
                        ...item,
                        qty: newAmount
                    }
                })
            }
        );
    };


    render() {
        return (
            <PageContainer
                navigation={this.props.navigation} layoutPadding={20}
                headerContainerStyle={Styles.headerContainerStyle}
                contentWrapperStyle={Styles.contentWrapperStyle}
            >
                {
                    this.state.loading ?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        :
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ flex: 1 }}>
                                <View style={Styles.header}>
                                    <View style={Styles.headerContent}>
                                        <Text style={Styles.headerStep}>
                                            1/3 bước
                                        </Text>
                                        <Text style={Styles.headerTitle}>
                                            Đặt chỗ
                                        </Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Image
                                            style={Styles.avatar}
                                            source={{ uri: this.props.account.avatar }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={Styles.pageContent}>
                                    <Text style={Styles.subHeaderTitle}>Thông tin dịch vụ</Text>
                                    <View style={Styles.items}>
                                        {
                                            this.props.cart.items.length > 0 ?
                                                this.props.cart.items.map((item, index) => {
                                                    return (
                                                        <View key={index} style={Styles.item}>
                                                            <View style={Styles.itemInfo}>
                                                                <Text numberOflines={1} style={Styles.itemName}>
                                                                    {item.name} {item.option ? '/' + item.option.name : ''}{item.promo_text}
                                                                </Text>
                                                                <View style={Styles.itemMeta}>
                                                                    <Text style={Styles.itemTime}>{item.time}</Text>
                                                                </View>
                                                                <View style={Styles.itemMeta}>
                                                                    <Text style={Styles.itemQuanity}>Số lượng: {item.qty}</Text>
                                                                    <View style={Styles.itemQtyButtons}>
                                                                        <TouchableOpacity
                                                                            hitSlop={{
                                                                                left: 30,
                                                                                top: 30,
                                                                                right: 0,
                                                                                bottom: 30
                                                                            }}
                                                                            onPress={() => {
                                                                                this._updateQty(item.id, -1);
                                                                            }}
                                                                            style={[Styles.itemQtyButton, Styles.itemQtyButtonSub]}>
                                                                            <Text style={Styles.itemQtyButtonText}>-</Text>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity
                                                                            hitSlop={{
                                                                                left: 0,
                                                                                top: 30,
                                                                                right: 30,
                                                                                bottom: 30
                                                                            }}
                                                                            onPress={() => {
                                                                                this._updateQty(item.id, 1);
                                                                            }}
                                                                            style={[Styles.itemQtyButton, Styles.itemQtyButtonAdd]}>
                                                                            <Text style={Styles.itemQtyButtonText}>+</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <Text style={Styles.itemPrice}>
                                                                {item.price}K</Text>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.props.addRemoveCartItem(this.props.cart.salonID, {
                                                                        id: item.id
                                                                    })
                                                                }}
                                                            >
                                                                <Icon style={Styles.itemIcon} name={'close'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                                : <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 30 }}>
                                                    <Icon name={'shopping-cart'} style={{ fontSize: 50, color: Colors.SILVER_DARK, marginRight: 30 }} />
                                                    <Text style={{ fontFamily: GlobalStyles.FONT_NAME, color: Colors.SILVER_DARK }}>Giỏ hàng rỗng, vui lòng thêm dịch vụ</Text>
                                                </View>
                                        }
                                    </View>
                                    <Text style={Styles.subHeaderTitle}>Thời gian</Text>
                                    <View style={Styles.dates}>
                                        <CalendarStrip
                                            // daySelectionAnimation={{type: 'background', duration: 200, borderWidth: 1, highlightColor: Colors.PRIMARY}}
                                            innerStyle={{
                                                marginBottom: 30,
                                                marginLeft: 15,
                                                marginRight: 15,
                                                marginTop: 15
                                            }}
                                            highlightDateNameStyle={{
                                                color: Colors.PRIMARY
                                            }}
                                            highlightDateNumberStyle={{
                                                color: Colors.PRIMARY,
                                                fontSize: 14,
                                            }}
                                            selectedDate={this.state.selectedDate}
                                            minDate={moment()}
                                            calendarHeaderStyle={{
                                                marginBottom: 10,
                                                fontWeight: 'normal',
                                                color: Colors.TEXT_DARK,
                                                fontSize: 14
                                            }}
                                            weekendDateNameStyle={{
                                                color: Colors.TEXT_DARK,
                                            }}
                                            weekendDateNumberStyle={{
                                                color: Colors.TEXT_DARK
                                            }}
                                            dateNameStyle={{
                                                color: Colors.TEXT_DARK
                                            }}
                                            dateNumberStyle={{
                                                color: Colors.TEXT_DARK,
                                                fontSize: 14,
                                            }}
                                            iconStyle={
                                                {
                                                    resizeMode: 'contain',
                                                    width: 20,
                                                    height: 30,
                                                }
                                            }
                                            shouldAllowFontScaling={false}
                                            onDateSelected={(date) => {
                                                this.setState(
                                                    {
                                                        selectTime: undefined,
                                                        selectedDate: date
                                                    },
                                                    () => {
                                                        this._onDateSelected(date);
                                                    }
                                                );
                                            }}
                                        />
                                    </View>
                                    <View style={Styles.times}>
                                        {
                                            this.state.times.length === 0 ?
                                                <View style={Styles.timeListEmpty}>
                                                    <Icon style={Styles.timeListEmptyIcon} name={'sentiment-very-dissatisfied'} />
                                                    <Text style={Styles.timeListEmptyText}>
                                                        Rất tiếc salon không phục vụ ngày này{'\n'} hoặc đã quá giờ phục vụ!
                                                    </Text>
                                                </View>
                                                :
                                                <ScrollView
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    showsVerticalScrollIndicator={false}
                                                    style={{ flex: 1 }}>
                                                    {
                                                        this.state.times.map((item, index) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            selectTime: item
                                                                        })
                                                                    }}
                                                                    key={index} style={[
                                                                        Styles.time, item === this.state.selectTime && Styles.timeSelected
                                                                    ]}>
                                                                    <Text style={[
                                                                        Styles.timeText,
                                                                        item === this.state.selectTime && Styles.timeTextSeleted
                                                                    ]}>{item}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                            {
                                this.props.cart.items.length > 0 ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this._next();
                                        }}
                                        activeOpacity={0.8}
                                        style={Styles.submitButton}>
                                        <Text style={Styles.submitButtonText}>Tiếp tục</Text>
                                    </TouchableOpacity>
                                    : undefined
                            }
                        </View>
                }
                <WAAlert show={this.state.alert} title={'Đặt chỗ'} question={this.state.alertMessage} titleFirst={true} yes={() => {
                    this.setState({
                        alert: false
                    });
                }} no={false} yesTitle={'Đã hiểu'} />
            </PageContainer>
        );
    }

     componentDidMount() {
        if (!this.props.cart.salonID) {
            return;
        }
        this._load();
    }

    _next = () => {
        if (!this.state.selectTime || !this.state.selectedDate) {
            this.setState({
                alert: true,
                alertMessage: 'Vui lòng chọn ngày giờ thực hiện dịch vụ!'
            });
            return;
        }
        const bookingInfo = this.props.navigation.getParam('bookingInfo');
        this.props.navigation.navigate('home_cart_two', {
            time: this.state.selectTime,
            date: this.state.selectedDate,
            bookingId: _.get(bookingInfo, 'id'),
        })
    }
}

export default connect(
    state => {
        return {
            cart: state.cart,
            account: state.account
        }
    },
    {
        addRemoveCartItem,
        updateCartInfo
    }
)(HomeCartStepOneScreen);


const Styles = StyleSheet.create({
    timeListEmpty: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeListEmptyIcon: {
        fontSize: 30,
        marginRight: 5,
        color: Colors.SILVER
    },
    timeListEmptyText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.SILVER_DARK
    },
    itemQtyButtons: {
        flexDirection: 'row',
        marginLeft: 10
    },
    itemQtyButton: {
        backgroundColor: Colors.SILVER_LIGHT,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemQtyButtonSub: {
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15
    },
    itemQtyButtonAdd: {
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderLeftColor: Colors.SILVER,
        borderLeftWidth: 1
    },
    itemQtyButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 25,
        lineHeight: 30
    },
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
        paddingLeft: 20,
        paddingRight: 20,
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY
    },
    submitButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 60
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRightColor: Colors.SILVER_LIGHT,
        borderRightWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        borderRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: Colors.PRIMARY,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 2
    },
    itemInfo: {
        flex: 1
    },
    itemPrice: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 17,
        fontWeight: 'bold',
        marginRight: 10
    },
    itemIcon: {
        fontSize: 25,
        color: Colors.SILVER,
    },
    itemName: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 15,
        marginBottom: 5
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    itemTime: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 13,
        marginRight: 15
    },
    itemQuanity: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_LINK,
        fontSize: 13,
    },
    items: {
        marginBottom: 15
    },
    times: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 5,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 30,
        height: 70
    },
    time: {
        backgroundColor: Colors.TRANSPARENT,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        borderRadius: 3,
    },
    timeSelected: {
        backgroundColor: Colors.PRIMARY,
    },
    timeText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14,

    },
    timeTextSeleted: {
        color: Colors.LIGHT,
    },
    dates: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 5,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15
    },
    highlightDateNumberStyle: {
        color: Colors.LIGHT,
        backgroundColor: Colors.PRIMARY,
    },
    dateNumberStyle: {
        fontSize: 5,
        paddingRight: 5,
        paddingLeft: 5,
    }
});

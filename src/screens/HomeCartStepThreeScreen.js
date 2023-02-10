import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView, RefreshControl, Modal
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {connect} from 'react-redux';
import {updateInfo as updateCartInfo} from "../redux/cart/actions";

type Props = {};
class HomeCartStepThreeScreen extends Component<Props> {
    constructor(props) {
        super(props);
    }
    componentDidMount(){

    }
    render() {
        let items = this.props.cart.items;
        let time = this.props.navigation.getParam('time');
        let date = this.props.navigation.getParam('date');
        let data = this.props.navigation.getParam('data');
        let paymentMethodTitle = '';
        let paymentMethodID = data.payment_method;
        if(this.props.cart.salonInfo){
            if(this.props.cart.salonInfo.paymentMethods){
                this.props.cart.salonInfo.paymentMethods.every((item) => {
                    if(item.id === paymentMethodID){
                        paymentMethodTitle = item.title;
                    }
                    return item;
                });
            }
        }
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                navigationAction={()=>{
                    this.props.updateCartInfo({
                        items: [],
                        salonID: undefined,
                        salonInfo: {}
                    });
                    this.props.navigation.navigate(this.props.cart.screenBeforeCart);
                }}
                backgroundColor={'#5567B0'}
                navigationClose={true}
                navigationButtonStyle={Styles.closeButton}
                layoutPadding={30}
            >
                <View style={Styles.pageWrapperInner}>
                    <ScrollView
                        style={Styles.content}
                    >
                        <Text style={Styles.step}>3/3 bước</Text>
                        <Text style={Styles.title}>Đặt chỗ</Text>
                        <Text style={Styles.subTitle}>
                            Cảm ơn bạn đã đặt chỗ!
                        </Text>
                        <View style={Styles.order}>
                            <View style={Styles.orderHeader}>
                                <Text style={Styles.orderTitle}>
                                    Đơn đặt chỗ của bạn
                                </Text>
                                <Text style={Styles.orderID}>
                                   #{data.id}
                                </Text>
                            </View>
                            <View style={Styles.orderItems}>
                                <View style={Styles.orderItem}>
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
                                        <View>
                                            <Text style={Styles.orderItemInfoText}>
                                                {this.props.cart.salonInfo.name}
                                            </Text>
                                        </View>
                                        <View style={Styles.orderItemInfoDescWrapper}>
                                            <Text style={Styles.orderItemInfoDesc}>
                                                {this.props.cart.salonInfo.address}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={Styles.orderItem}>
                                    <View style={Styles.orderItemIcon}>
                                        {ImageSources.SVG_ORDER_PAYMENT}
                                    </View>
                                    <View style={Styles.orderItemInfo}>
                                        <Text style={Styles.orderItemInfoText}>
                                            Hình thức thanh toán
                                        </Text>
                                        <View style={Styles.orderItemInfoDescWrapper}>
                                            <Text style={Styles.orderItemInfoDesc}>
                                               {paymentMethodTitle}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
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
                                    items.map((item, index) => {
                                        return (
                                            <View key={index} style={Styles.orderDetail}>
                                                <View style={Styles.orderDetailLeft}>
                                                    <Text style={Styles.orderDetailTitle}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={Styles.orderDetailSub}>
                                                        Số lượng: {item.qty}
                                                    </Text>
                                                </View>
                                                <View style={Styles.orderDetailRight}>
                                                    <Text style={Styles.orderDetailPrice}>
                                                        {item.price}K
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={Styles.orderColHeaderRow}>
                                <View style={Styles.orderColHeaderLeft}>
                                    <Text style={Styles.orderColHeaderText}>Tổng tiền</Text>
                                </View>
                                <View style={Styles.orderColHeaderRight}>
                                    <Text style={Styles.orderColHeaderTextBold}>{this.props.cart.getTotal()}K</Text>
                                </View>
                            </View>
                            <View style={Styles.payBtnWrapper}>
                                <WAButton
                                    onPress={()=>{
                                        this.props.updateCartInfo({
                                            items: [],
                                            salonID: undefined,
                                            salonInfo: {}
                                        });
                                        this.props.navigation.navigate(this.props.cart.screenBeforeCart);
                                    }}
                                    style={Styles.payBtn} text={'HOÀN TẤT'} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            cart: state.cart
        }
    },
    {
        updateCartInfo
    }
)(
    HomeCartStepThreeScreen
);

const Styles = StyleSheet.create({
    payBtnWrapper: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30
    },
    payBtn: {
    },
    pageWrapper:{
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'flex-start',
    },
    pageWrapperInner: {
        flex: 1,
        width: '100%',
        //marginBottom: 30
    },
    closeButton: {
        color: Colors.LIGHT,
    },
    step: {
        color: Colors.LIGHT,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        marginBottom: 5
    },
    title: {
        color: Colors.LIGHT,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME,
        marginBottom: 5
    },
    subTitle: {
        fontSize: 15,
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        marginBottom: 30
    },
    content: {
        flex: 1
    },
    order: {
        backgroundColor: Colors.LIGHT,
        paddingBottom: 50,
        borderRadius: 5
    },
    orderHeader: {
        paddingTop: 30,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 4
    },
    orderTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    orderID: {
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
    },
    orderItems: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 4,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 7,
        paddingBottom: 7,

    },
    orderItemIcon: {
        width: 25,
        marginRight: 15
    },
    orderItemInfoDescWrapper: {
        marginRight: 20
    },
    orderItemInfoText:{
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,

    },
    orderItemInfoDesc: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
    },
    orderColHeaderRow: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 5
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
        color: Colors.SILVER,
    },
    orderDetails: {
        marginTop: 5
    },
    orderDetail: {
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    orderDetailLeft: {
      flex: 1
    },
    orderDetailRight: {
        width: 80,
        alignItems: 'flex-end',
    },
    orderDetailTitle:{
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    orderDetailSub: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
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
    }
});
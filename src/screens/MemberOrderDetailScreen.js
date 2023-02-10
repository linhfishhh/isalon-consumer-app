import React, {Component} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import IconM from 'react-native-vector-icons/MaterialIcons';
import {connect} from "react-redux";
import Utils from '../configs';
import {DotIndicator} from 'react-native-indicators';
import numeral from 'numeral';
import WAAlert from "../components/WAAlert";

type Props = {};
class MemberOrderDetailScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: undefined,
            id: this.props.navigation.getParam('id'),
            title: this.props.navigation.getParam('title'),
            backgroundColor: this.props.navigation.getParam('backgroundColor')?this.props.navigation.getParam('backgroundColor'):Colors.DARK,
            alert: false,
            alertTitle: '',
            alertMessage: '',
            onCancel: this.props.navigation.getParam('onCancel'),
            onChange: this.props.navigation.getParam('onChange'),
        }
    }

    cancel = () => {
        this.setState({
            loading: true,
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'booking/cancel',
                    {
                        id: this.state.id
                    }
                );
                this.setState({
                    loading: false,
                }, () => {
                    this._loadData();
                    if(this.state.onCancel){
                        this.state.onCancel();
                    }
                });
            }
            catch (e) {
            }
        });
    };

    change = () => {

    };

    _loadData = () => {
        this.setState({
            loading: true,
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'booking/detail',
                    {
                        id: this.state.id
                    }
                );
                this.setState({
                    loading: false,
                    data: rq.data,
                    title: rq.data.order_title
                });
            }
            catch (e) {
                if(e.response.status === 404){
                    Alert.alert('iSalon', e.response.data.message);
                }
                this.props.navigation.goBack();
            }
        });
    };

    componentDidMount(){
        this._loadData();
    }

    render() {
        return (
            this.state.loading || this.state.data === undefined ?
                <View style={{flex: 1, backgroundColor: this.state.backgroundColor}}>
                    <StatusBar
                        translucent={true}
                        backgroundColor={'transparent'}
                        barStyle={'light-content'}
                    />
                    <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                </View>
                :
                <PageContainer
                    darkTheme={false}
                    contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                    navigation={this.props.navigation}
                    backgroundColor={this.state.backgroundColor}
                    navigationClose={true}
                    navigationButtonStyle={Styles.closeButton}
                    layoutPadding={30}
                >
                    <View style={Styles.pageWrapperInner}>
                        <ScrollView
                            style={Styles.content}
                        >
                            <Text style={Styles.title}>Chi tiết đặt chỗ</Text>
                            {
                                this.state.title?
                                    <Text style={Styles.subTitle}>
                                        {this.state.title}
                                    </Text>
                                    :undefined
                            }
                            <View style={Styles.order}>
                                <View style={Styles.orderHeader}>
                                    <Text style={Styles.orderTitle}>
                                        Đơn đặt chỗ của bạn
                                    </Text>
                                    <Text style={Styles.orderID}>
                                        #{this.state.data.id}
                                    </Text>
                                </View>
                                <View style={Styles.orderItems}>
                                    <View style={Styles.orderItem}>
                                        <View style={Styles.orderItemIcon}>
                                            {ImageSources.SVG_ORDER_DATE}
                                        </View>
                                        <View style={Styles.orderItemInfo}>
                                            <Text style={Styles.orderItemInfoText}>
                                                Ngày {this.state.data.date}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={Styles.orderItem}>
                                        <View style={Styles.orderItemIcon}>
                                            {ImageSources.SVG_ORDER_TIME}
                                        </View>
                                        <View style={Styles.orderItemInfo}>
                                            <Text style={Styles.orderItemInfoText}>
                                                {this.state.data.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={Styles.orderItem}>
                                        <View style={Styles.orderItemIcon}>
                                            {ImageSources.SVG_ORDER_ADRESS}
                                        </View>
                                        <View style={Styles.orderItemInfo}>
                                            <View style={Styles.orderItemInfoDescWrapper}>
                                                <Text style={Styles.orderItemInfoText}>
                                                    {this.state.data.salon.name}
                                                </Text>
                                            </View>
                                           <View style={Styles.orderItemInfoDescWrapper}>
                                               <Text style={Styles.orderItemInfoDesc}>
                                                   {this.state.data.salon.address}
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
                                                    {this.state.data.payment}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={Styles.orderItem}>
                                        <View style={Styles.orderItemIcon}>
                                            <IconM style={{fontSize: 22, color: Utils.getBookingStatus(this.state.data.status).color}} name={Utils.getBookingStatus(this.state.data.status).name} />
                                        </View>
                                        <View style={Styles.orderItemInfo}>
                                            <Text style={Styles.orderItemInfoText}>
                                                Trạng thái
                                            </Text>
                                            <Text style={Styles.orderItemInfoDesc}>
                                                {Utils.getBookingStatus(this.state.data.status).text}
                                            </Text>
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
                                        this.state.data.services.map((item, index) => {
                                            return (
                                                <View key={index} style={Styles.orderDetail}>
                                                    <View style={Styles.orderDetailLeft}>
                                                        <Text style={Styles.orderDetailTitle}>
                                                            {item.name}
                                                        </Text>
                                                        <Text style={Styles.orderDetailSub}>
                                                            Số lương: {item.qty}
                                                        </Text>
                                                    </View>
                                                    <View style={Styles.orderDetailRight}>
                                                        <Text style={Styles.orderDetailPrice}>
                                                            {numeral(item.sum/1000).format('0,000')}K
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
                                        <Text style={Styles.orderColHeaderTextBold}> {numeral(this.state.data.sum/1000).format('0,000')}K</Text>
                                    </View>
                                </View>
                                <View style={Styles.actions}>
                                    {
                                        this.state.data.can_pay?
                                            <TouchableOpacity

                                                style={Styles.action}>
                                                <Text style={Styles.actionText}>THANH TOÁN</Text>
                                            </TouchableOpacity>
                                            :undefined
                                    }
                                    {
                                        this.state.data.can_change?
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    this.props.navigation.navigate('change_service_time', {
                                                        id: this.state.id,
                                                        onDone: ()=>{
                                                            this._loadData();
                                                        }
                                                    });
                                                }}
                                                style={Styles.action}>
                                                <Text style={Styles.actionText}>ĐỔI GIỜ</Text>
                                            </TouchableOpacity>
                                            :undefined
                                    }
                                    {
                                        this.state.data.can_cancel?
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    this.setState({
                                                        alert: true,
                                                        alertTitle: 'Huỷ đặt chỗ',
                                                        alertMessage: 'Bạn chắc chắn muốn huỷ đơn đặt chỗ này. Lưu ý rằng nếu đơn đặt chỗ đã THANH TOÁN ONLINE rồi bạn sẽ KHÔNG ĐƯỢC HOÀN TIỀN!'
                                                    });
                                                }}
                                                style={Styles.action}>
                                                <Text style={Styles.actionText}>HUỶ ĐẶT CHỖ</Text>
                                            </TouchableOpacity>
                                            :undefined
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <WAAlert show={this.state.alert} title={this.state.alertTitle} question={this.state.alertMessage} titleFirst={true} yes={()=>{
                        this.setState({
                            alert: false
                        }, ()=>{
                            this.cancel();
                        });
                    }} no={()=>{
                        this.setState({
                            alert: false
                        });
                    }}/>
                </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberOrderDetailScreen);

const Styles = StyleSheet.create({
    actions: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 20
    },
    action: {
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 30,
        marginTop: 15
    },
    actionText: {
        fontSize: 15,
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    orderActions: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15,
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
    title: {
        color: Colors.LIGHT,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME,
        marginTop: 15,
        marginBottom: 30
    },
    subTitle: {
        fontSize: 15,
        color: Colors.LIGHT,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME,
        marginBottom: 30,
        marginRight: 30
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
        borderBottomWidth: 4
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
    orderItemInfoText:{
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    orderItemInfoDesc: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,

        marginRight: 20,
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
    },

});
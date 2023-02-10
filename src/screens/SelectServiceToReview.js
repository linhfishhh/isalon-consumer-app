import React, {Component} from 'react';
import {Alert, ScrollView, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {createAccount, updateJoinTOS, updateStartupRoute} from "../redux/account/actions";
import Utils from '../configs';
import {DotIndicator} from 'react-native-indicators';
import WAEmptyPage from "../components/WAEmptyPage";

type Props = {};
class SelectServiceToReview extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            error: false,
            errorMessage: '',
            salonID: this.props.navigation.getParam('salonID'),
            serviceID: this.props.navigation.getParam('serviceID'),
            onSuccess: this.props.navigation.getParam('onSuccess'),
            data: [],
        }
    }

    _serviceToReview = () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'review/services-to-review',
                    {
                        salon_id: this.state.salonID,
                        service_id: this.state.serviceID,
                    }
                );
                this.setState({
                    fetching: false,
                    data: rq.data
                });
            }
            catch (e) {
                this.setState({
                    fetching: false
                });
            }
        });
    };

    componentDidMount(){
        this._serviceToReview();
    }

    _renderItem = ({item}) => {
        return (
            <View style={Styles.item}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('home_write_review', {
                            orderID: item.orderID,
                            serviceID: item.serviceID,
                            onSuccess: this.state.onSuccess
                        });
                    }}
                    style={Styles.itemWrapper}>
                    <Text style={Styles.orderID}>Đơn đặt chỗ #{item.orderID}</Text>
                    <View style={Styles.row}>
                        <Text style={Styles.serviceName}>{item.serviceName}</Text>
                        <Text style={Styles.dateTime}>{item.dateTime}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };


    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper, {paddingLeft: 20, paddingRight: 20}]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerTitle={'Chọn dịch vụ nhận xét'}
            >
                {
                    this.state.fetching?
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                        :
                        <FlatList
                            style={{flex: 1, marginTop: 30}}
                            keyExtractor={(item, index)=>{return ''+index}}
                            data={this.state.data}
                            renderItem={this._renderItem}
                            ListEmptyComponent={
                                <WAEmptyPage
                                    title={'Không có dịch vụ'}
                                    subTitle={'Bạn chưa có đơn đặt chỗ nào hoàn thành có những dịch vụ có thể viết nhận xét đánh giá'}
                                    style={Styles.emptyPage}
                                />
                            }
                        />
                }
            </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
        updateJoinTOS,
        createAccount,
        updateStartupRoute
    }
)(SelectServiceToReview);

const Styles = StyleSheet.create({
    empty: {
        flex: 1,
    },
    orderID: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.PRIMARY,
        marginBottom: 5
    },
    serviceName: {
       flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK
    },
    dateTime: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK
    },
    row: {
        flexDirection: 'row',
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT
    },
});
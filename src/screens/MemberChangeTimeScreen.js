import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WALoading from "../components/WALoading";
import WAAlert from "../components/WAAlert";
import CalendarStrip from "react-native-calendar-strip";
import {DotIndicator} from 'react-native-indicators';
import Utils from '../configs';
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
};

const locale = {
    //name: 'en',
    config: {
        weekdaysShort: 'CN_TH2_TH3_TH4_TH5_TH6_TH7'.split('_'),
        months: 'THÁNG 01_THÁNG 02_THÁNG 03_THÁNG 04_THÁNG 05_THÁNG 06_THÁNG 07_THÁNG 08_THÁNG 09_THÁNG 10_THÁNG 11_THÁNG 12'.split(
            '_'
        ),
    }
};

class MemberChangeTimeScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            times: [
            ],
            selectTime: undefined,
            selectedDate: moment().add(1, 'day'),
            startDate: moment().add(1, 'day'),
            loading: true,
            changeCount: 0,
            changeCountLimit: 0,
            id: this.props.navigation.getParam('id'),
            onDone: this.props.navigation.getParam('onDone'),
            time: '',
            date: '',
            timeList: {
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: []
            },
            alert: false,
            alertMessage: ''
        }
    }

    _load = () => {
        this.setState(
            {
                loading: true
            },
            async() => {
                try {
                    let rq = await Utils.getAxios(this.props.account.token).post(
                        'booking/'+this.state.id+'/change-time/info'
                    );
                    let data = rq.data;
                    this.setState({
                        loading: false,
                        changeCount: data.changeCount,
                        changeCountLimit: data.changeCountLimit,
                        time: data.time,
                        date: data.date,
                        selectedDate: moment(data.date, 'DD/MM/YYYY'),
                        startDate: moment(data.date, 'DD/MM/YYYY'),
                        timeList: data.timeList,
                        selectTime: data.time
                    }, ()=>{
                        this._onDateSelected(moment(data.date, 'DD/MM/YYYY'));
                    });
                }
                catch (e) {
                    if(e.response){
                        if(e.response.status === 400){
                            alert(e.response.data.message);
                        }
                    }
                    this.props.navigation.goBack();
                }
            }
        );
    };

    componentDidMount(){
        this._load();
    }

    _send = () => {
        if(this.state.selectTime === undefined){
            this.setState({
                alert: true,
                alertMessage: 'Bạn chưa chọn ngày giờ cần đổi!'
            });
            return;
        }

        this.setState({
            loading: true
        }, async ()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'booking/'+this.state.id+'/change-time/request',
                    {
                        time: this.state.selectTime,
                        date: this.state.selectedDate.format('YYYY-MM-DD')
                    }
                );
                this.setState({
                    loading: false
                }, () => {
                    this.state.onDone();
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                if(e.response){
                    if(e.response.status === 400){
                        this.setState({
                            loading: false,
                            alert: true,
                            alertMessage: e.response.data.message
                        });
                    }
                }
                else{
                    this.setState({
                        loading: false
                    });
                }
            }
        });
    };

    _onDateSelected = (date) => {
        let day = date.day();
        if(day === 0){
            day = 7;
        }
        let ls = this.state.timeList[day];
        let has = false;
        ls.every((item) => {
            if(item === this.state.selectTime){
                has = true;
                return false;
            }
            return item;
        });
        if(ls.length === 0){
            this.setState(
                {
                    times: ls
                }
            );
        }
        else{
            this.setState(
                {
                    times: ls,
                    selectTime: has?this.state.selectTime:ls[0]
                }
            );
        }
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'ĐỔI GIỜ'}
                headerTitleStyle={{color: Colors.LIGHT}}
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} color={Colors.PRIMARY} size={10} /> :
                        <View style={{flex: 1}}>
                            {
                                    <ScrollView style={{flex: 1}}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                            }}
                                            activeOpacity={1} style={Styles.pageWrapperInner}>
                                            <View style={Styles.OldInfoRow}>
                                                <View style={Styles.OldInfoLeft}>
                                                    <Text style={Styles.label}>Thời gian hiện tại</Text>
                                                    <View style={Styles.OldInfo}>
                                                        <Text style={Styles.OldInfoText}>{this.state.time} {this.state.date}</Text>
                                                    </View>
                                                </View>
                                                <View style={Styles.OldInfoRight}>
                                                    <Text style={Styles.label}>Số lần đổi cho phép</Text>
                                                    <View style={Styles.OldInfo}>
                                                        <Text style={Styles.OldInfoText}>{this.state.changeCount}/{this.state.changeCountLimit}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={Styles.label}>Thời gian cần đổi sang</Text>
                                            <View style={Styles.dates}>
                                                <CalendarStrip
                                                    minDate={this.state.startDate}
                                                    selectedDate={this.state.selectedDate}
                                                    innerStyle={{
                                                        marginBottom: 15
                                                    }}
                                                    highlightDateNameStyle={{
                                                        color: Colors.PRIMARY
                                                    }}
                                                    highlightDateNumberStyle={{
                                                        color: Colors.PRIMARY
                                                    }}
                                                    calendarHeaderStyle={{
                                                        marginBottom: 10,
                                                        fontWeight: 'normal',
                                                        color: Colors.TEXT_DARK,
                                                        fontSize: 15
                                                    }}
                                                    //locale={locale}
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
                                                        color: Colors.TEXT_DARK
                                                    }}
                                                    onDateSelected={(date) => {
                                                        this.setState(
                                                            {
                                                                selectTime: undefined,
                                                                selectedDate: date
                                                            },
                                                            ()=>{
                                                                this._onDateSelected(date);
                                                            }
                                                        );
                                                    }}
                                                />
                                            </View>
                                            <View style={Styles.times}>
                                                {
                                                    this.state.times.length === 0?
                                                        <View style={Styles.timeListEmpty}>
                                                            <Icon style={Styles.timeListEmptyIcon} name={'sentiment-very-dissatisfied'} />
                                                            <Text style={Styles.timeListEmptyText}>
                                                                Rất tiếc salon không phục vụ ngày này!
                                                            </Text>
                                                        </View>
                                                        :
                                                        <ScrollView
                                                            horizontal={true}
                                                            showsHorizontalScrollIndicator={false}
                                                            showsVerticalScrollIndicator={false}
                                                            style={{flex: 1}}>
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
                                        </TouchableOpacity>
                                    </ScrollView>
                            }
                            <TouchableOpacity
                                onPress={this._send}
                                style={Styles.sendRequest}>
                                <Text style={Styles.sendRequestText}>GỬI YÊU CẦU</Text>
                            </TouchableOpacity>
                        </View>
                }
                <WAAlert show={this.state.alert} title={'Lỗi xảy ra'} question={this.state.alertMessage}
                         yes={()=>{
                             this.setState({
                                 alert: false
                             });
                }} no={false} yesTitle={'ĐÃ HIỂU'} titleFirst={true} />
            </PageContainer>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberChangeTimeScreen);

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

    sendRequest: {
        backgroundColor: Colors.PRIMARY,
        width: '100%',
    },
    sendRequestText: {
      color: Colors.LIGHT,
        textAlign: 'center',
        lineHeight: 60,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
    },
    OldInfoRow: {
      flexDirection: 'row',
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 5
    },
    OldInfoLeft: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 20
    },
    OldInfoRight: {
        flex: 1,
        alignItems: 'center',
        borderLeftColor: Colors.SILVER_LIGHT,
        borderLeftWidth: 1,
        paddingBottom: 20
    },
    OldInfo: {
        marginTop: 10,
        marginBottom: 0
    },
    OldInfoText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PRIMARY
    },
    pageWrapper: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: Colors.LIGHT
    },
    pageWrapperInner: {
        flex: 1,
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20
    },
    reason: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginTop: 15
    },
    label: {
        marginTop: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SILVER_DARK
    },
    times: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 15},
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
        shadowOffset: {width: 0, height: 15},
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 5,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
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
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20
    },
    modalButton: {
        borderColor: Colors.SILVER,
        borderWidth: 1,
        borderRadius: 20,
        flex: 1,
        marginRight: 5,
        marginLeft: 5
    },
    modalButtonText: {
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalButtonAgree: {
        backgroundColor: Colors.PRIMARY,
        borderWidth: 0
    },
    modalButtonAgreeText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME
    }
});

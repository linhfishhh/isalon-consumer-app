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
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {connect} from 'react-redux';
import Utils from '../configs';

type Props = {};
class MemberAccountFAQScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [],
        }
    }
    dumpAnswer = 'Số liệu từ Forbes chỉ ra tổng số tiền mà FIFA đã chi ra cho World Cup 2018 lên đến 791' +
        ' triệu USD. Trước khi World Cup 2018 diễn ra, FIFA đã chuyển tổng cộng 391 triệu USD đến 32 đội bóng tham' +
        ' dự ngày hội bóng đá lớn nhất hành tinh trên đất Nga.\n\n' +
        'Số tiền này nhằm đảm bảo kinh phí cho các đội và hỗ trợ chữa trị chấn thương cho các cầu thủ không may gặp' +
        ' phải ở giai đoạn chuẩn bị, và chinh chiến ở World Cup 2018.\n\n' +
        '791 triệu USD là con số cao hơn rất nhiều so với 576 triệu USD mà FIFA từng “mở hầu bao” ở World Cup 2014' +
        ' trên đất Brazil. Dưới đây là đồ họa chi tiết để thấy được qua từng năm, tiền thưởng của các đội tăng đến đâu. Dự kiến, con số sẽ tăng hơn nữa ở World Cup 2022 diễn ra trên đất Qatar.';

    _loadItems = () => {
        this.setState({
            loading: true,
        }, async () => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'faqs'
                );
                this.setState({
                    loading: false,
                    items: rq.data
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
            }

        });
    };
    _onRefresh = () => {
        this.setState({refreshing: true});
        this._loadItems();
    };
    componentDidMount() {
        this._loadItems();
    };
    _renderPlaceholders = () => {
        let items = [1, 2, 3, 4];
        return items.map((item, index) => {
            return (
                <View key={index} style={[Styles.item, index===0?Styles.firstItem:undefined]}>
                    <View style={Styles.itemTextWrapper}>
                        <ShimmerPlaceHolder style={Styles.itemTextPlaceholder} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                        <ShimmerPlaceHolder style={Styles.itemTextPlaceholder} autoRun colorShimmer={Colors.SHIMMER_COLOR}/>
                    </View>
                    <View style={Styles.itemIconWrapper}>
                        <Icon style={Styles.itemIcon} name={'angle-right'} />
                    </View>
                </View>
            );
        });
    };
    _renderItems = () => {
        return this.state.items.map((item, index) => {
            return (
                <View key={index} style={[Styles.item, index===0?Styles.firstItem:undefined]}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate({
                                routeName: 'home_account_faq_detail',
                                params: {
                                    title: item.content,
                                    content: item.answer
                                }
                            })
                        }}
                        style={Styles.itemWrapper}>
                        <View style={Styles.itemTextWrapper}>
                            <Text style={Styles.itemText}>
                                {item.content}
                            </Text>
                        </View>
                        <View style={Styles.itemIconWrapper}>
                            <Icon style={Styles.itemIcon} name={'angle-right'} />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    };
    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationClose={true}
                navigationButtonStyle={Styles.closeButton}
                layoutPadding={30}
            >
                <View style={Styles.pageWrapperInner}>
                    <View style={Styles.title}>
                        <Text style={Styles.titleText}>Trợ giúp</Text>
                    </View>
                    <ScrollView

                        style={Styles.content}
                    >

                        <View style={Styles.items}>
                            {this.state.loading?this._renderPlaceholders():this._renderItems()}
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
            account: state.account
        }
    }
)(MemberAccountFAQScreen);

const Styles = StyleSheet.create({
    pageWrapper:{
        flex: 1,
        paddingLeft: 30,
        paddingRight: 0,
        alignItems: 'flex-start',
    },
    pageWrapperModal: {
        paddingRight: 30,
    },
    pageWrapperInner: {
        flex: 1,
        width: '100%'
    },
    closeButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    title: {
        marginBottom: 50
    },
    titleText: {
        fontSize: 34,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME
    },
    content: {
        flex: 1
    },
    loadingStyle: {
        backgroundColor: Colors.LIGHT
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    firstItem: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1
    },
    itemTextWrapper: {
        flex: 1,
    },
    itemTextPlaceholder: {
        flex: 1,
        height: 10,
        marginBottom: 5,
        marginTop: 5,
        width: '100%'
    },
    itemIconWrapper: {
        paddingLeft: 30,
        paddingRight: 30
    },
    itemIcon: {
        fontSize: 20,
        color: Colors.SILVER,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemText: {
        color: Colors.TEXT_DARK,
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
import React, {PureComponent, Component} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import WAAlert from "../components/WAAlert";
import {connect} from 'react-redux';
import Utils from '../configs';
import WAEmptyPage from "../components/WAEmptyPage";
import {DotIndicator} from 'react-native-indicators';
import {updateCount, updateInfo} from "../redux/notify/actions";
import NavigationService from "../NavigationService";
import { NavigationActions } from 'react-navigation';

type Props = {};
class MemberAccountNotificationScreen extends PureComponent<Props> {
    static defaultProps = {
        perPage: 5,
    };
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            scrollY: 0,
            lastID: 0,
            loading: false,
            currentPage: 0,
            isLast: false,
            items: [
            ],
            selected: [

            ],
            deleteAlert: false,
            processing: false
        }
    }
    _showLoadingItems(){
        let rs = [];
        for(var i = 1; i<=this.props.perPage; i++){
            rs.push(
                <View key={'loading-item-'+i} style={[Styles.item, Styles.loadingItem]}>
                    <View style={Styles.itemCover}>
                        <View style={Styles.itemImagePhd} autoRun={true}/>
                    </View>
                    <View style={Styles.itemInfo}>
                        <View style={Styles.itemTitlePhd} autoRun={true}/>
                        <View style={Styles.itemTitlePhd} autoRun={true}/>
                        <View style={Styles.itemMeta}>
                            <View style={Styles.itemMetaPhd} autoRun={true}/>
                            <View style={Styles.itemMetaPhd} autoRun={true}/>
                            <View style={Styles.itemMetaPhd} autoRun={true}/>
                        </View>
                    </View>
                    <View style={Styles.itemStatus}>
                        <View style={Styles.itemStatusPhd} autoRun={true}/>
                    </View>
                </View>
            );
        }
        return rs;
    };
    componentDidMount() {
        this._loadItems();
    }

    _onSelected = (id, selected) => {
        let items = this.state.selected;
        if(selected){
            items = items.concat(id);
        }
        else{
            items = items.filter((item)=>{
                return item !== id;
            });
        }
        this.setState(
            {
                selected: items
            }
        );
    };

    _renderItem = ({item}) => {
        return (
            <Item
                read={this._read}
                onSelected={this._onSelected} data={item}
                editing={this.state.editing}
                selected={this.state.selected}
            />
        )
    };

    _loadItems = (refresh = true) => {
        if(this.state.loading){
            return;
        }
        if(!refresh && this.state.isLast){
            return;
        }
        let items = this.state.items;
        let page = this.state.currentPage + 1;
        if(refresh){
            items = [];
            page = 1;
        }
        this.setState({
            loading: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'notification/list?page='+page
                );
                items = items.concat(rq.data.items);
                this.setState({
                    loading: false,
                    items: items,
                    currentPage: rq.data.currentPage,
                    isLast: rq.data.isLast
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
            }
        });
    };

    _delete = ()=>{
        if(this.state.processing){
            return;
        }
        this.setState({
            processing: true,
            editing: false
        }, async ()=>{
            if(this.state.selected.length === 0){
                this.setState({
                    processing: false
                });
                return;
            }

            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'notification/delete',
                    {
                        ids: this.state.selected
                    }
                );
                this.setState({
                    processing: false,
                    items: this.state.items.filter((item)=>{
                        return this.state.selected.indexOf(item.id) === -1
                    }),
                    selected: [],
                }, ()=>{
                    this.props.updateInfo({
                        count: rq.data
                    });
                });
            }
            catch (e) {
                this.setState({
                    processing: false
                });
            }
        });
    };

    _empty = () => {
        return (
            !this.state.loading?
                <WAEmptyPage style={{paddingRight: 30, paddingTop: 100}} title={'Chưa có thông báo'} subTitle={'Chưa có thông báo nào giành cho bạn, khi có thông báo bạn có thể tìm chúng ở đây'} />
                :null
        )
    };

    _keyExtractor = (item, index) => {
        return 'item-'+index;
    };

    _read = (id, after = null) => {
        if(this.state.processing){
            return;
        }
        this.setState({
            processing: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'notification/'+id+'/read'
                );
                this.setState({
                    processing: false,
                    items: this.state.items.map((item)=>{
                        if(item.id !== id){
                            return item;
                        }
                        item.read = true;
                        return item;
                    })
                }, ()=>{
                    this.props.updateInfo(
                        {
                            count: rq.data
                        }
                    );
                    if(after){
                        after();
                    }
                });
            }
            catch (e) {
                this.setState({
                    processing: false
                });
            }
        });
    };

    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                layoutPadding={30}
                keyboardAvoid={false}
                rightComponent={(
                    !this.state.loading && !this.state.processing?
                        this.state.items.length>0?
                            <View style={Styles.editButtons}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        let state = {
                                            editing: !this.state.editing
                                        };
                                        if(!this.state.editing){
                                            state = {
                                                ...state,
                                                selected: []
                                            }
                                        }
                                        this.setState(state)
                                    }}
                                >
                                    <Text style={Styles.editButton}>{this.state.editing?'Hủy':'Xóa'}</Text>
                                </TouchableOpacity>
                                {
                                    this.state.editing?
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.setState({
                                                    deleteAlert: true
                                                });
                                            }}
                                        >
                                            <Text style={Styles.deleteButton}>Xóa</Text>
                                        </TouchableOpacity>
                                        :undefined
                                }
                            </View>:
                            undefined
                        :<DotIndicator color={Colors.PRIMARY} size={4} count={3}/>
                )}
                headerContainerStyle={{backgroundColor: Colors.LIGHT}}
                headerTitleColor={Colors.LIGHT}
            >
                <WAAlert
                    yes={()=>{this.setState({deleteAlert: false}, ()=>{
                        this._delete()
                    })}}
                    no={()=>{this.setState({deleteAlert: false})}}
                    title={'Xóa thông báo'}
                    question={'Bạn muốn xóa những thông báo được chọn?'}
                    show={this.state.deleteAlert} />
                <FlatList
                    style={this.state.scrollY>0?Styles.scrollActived:Styles.scroll}
                    onScroll={(event) => {
                        this.setState({
                            scrollY: event.nativeEvent.contentOffset.y
                        })
                    }}
                    ListFooterComponent={()=>
                        this.state.loading?this._showLoadingItems():<View/>
                    }
                    ListEmptyComponent={this._empty}
                    onEndReached={()=>{this._loadItems(false)}}
                    onEndThreshold={0}
                    extraData={this.state}
                    data={this.state.items}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={
                        <View style={Styles.pageHeader}>
                            <Text style={Styles.pageHeaderTitle}>Thông báo</Text>
                            <Text style={Styles.pageHeaderDesc}>
                                Tin tức mới nhất sẽ được gửi tới cho bạn{"\n"}
                                hãy luôn theo dõi chúng tôi !
                            </Text>
                        </View>
                    }
                />

                <WALoading show={this.state.saving}/>
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
        updateInfo
    }
)(MemberAccountNotificationScreen);

class Item extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let item = this.props.data;
        let hasRoute = false;
        if(item.route){
            if(item.route.routeName){
                hasRoute = true;
            }
        }
        return (
            <View style={Styles.item}>
                <CheckBox data={item} onSelected={this.props.onSelected} id={item.key} editing={this.props.editing} selected={this.props.selected}/>
                <View style={Styles.itemCover}>
                    <Image style={Styles.itemCoverImage} source={{uri: item.cover}} />
                </View>
                <View style={Styles.itemInfo}>
                    <Text style={item.titleLink?Styles.itemTitleLink:Styles.itemTitle}>
                        {item.title}
                    </Text>
                    <View style={Styles.itemMeta}>
                        <Text style={Styles.itemDate}>{item.date}</Text>
                        {
                            hasRoute?(
                                    [
                                        <Icon style={Styles.itemDot} key={1} name={'circle'} />,
                                        <TouchableOpacity
                                            onPress={()=>{
                                                if(item.read){
                                                    let navigator = NavigationService.navigator();
                                                    let navigate = NavigationActions.navigate(item.route);
                                                    navigator.dispatch(navigate);
                                                    return 0;
                                                }
                                                this.props.read(item.id);
                                                setTimeout(()=>{
                                                        let navigator = NavigationService.navigator();
                                                        let navigate = NavigationActions.navigate(item.route);
                                                        navigator.dispatch(navigate);
                                                    },
                                                    100
                                                );
                                            }}
                                            hitSlop={{
                                                top: 30,
                                                bottom: 30,
                                                left: 5,
                                                right: 5
                                            }}
                                            key={2} style={Styles.itemDetailLink}>
                                            <Text style={Styles.itemDetailLinkText}>Chi tiết</Text>
                                        </TouchableOpacity>
                                    ]

                                )
                                :undefined
                        }
                        {
                            !item.read?
                                [
                                    <Icon style={Styles.itemDot} key={90} name={'circle'} />,
                                    <TouchableOpacity
                                        hitSlop={{
                                            top: 30,
                                            bottom: 30,
                                            left: 5,
                                            right: 5
                                        }}
                                        onPress={()=>{this.props.read(item.id)}}
                                        key={91} style={Styles.itemDetailLink}>
                                        <Text style={Styles.itemDetailLinkText}>Đã đọc</Text>
                                    </TouchableOpacity>
                                ]
                                :undefined
                        }
                    </View>
                </View>
                <View style={Styles.itemStatus}>
                    {
                        !item.read?
                            <Icon name={'circle'} style={Styles.itemStatusIcon} />:
                            undefined
                    }
                </View>
            </View>
        )
    }
}

class CheckBox extends PureComponent{
    constructor(props) {
        super(props);
    }
    render(){
        let checked = this.props.selected.indexOf(this.props.data.id) !== -1;
        return (
            <TouchableOpacity style={this.props.editing?Styles.itemCheckBoxEnabled:Styles.itemCheckBox}
                              onPress={()=>{
                                  let checked = this.props.selected.indexOf(this.props.data.id) !== -1;
                                  this.props.onSelected(this.props.data.id, !checked)
                              }}
            >

                {

                    checked?
                        (
                            <View style={[Styles.itemCheckBoxWrapper, Styles.itemCheckBoxWrapperChecked]}>
                                <Icon style={Styles.itemUnchecked} name={'check'}/>
                            </View>
                        )
                        :
                        (
                            <View style={Styles.itemCheckBoxWrapper}>
                            </View>
                        )
                }
            </TouchableOpacity>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        justifyContent: 'flex-start',
        backgroundColor: Colors.LIGHT,
        paddingLeft: 0,
        paddingRight: 0,

    },
    closeButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    editButton: {
        color: Colors.PRIMARY,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 50
    },
    deleteButton: {
        color: Colors.PRIMARY,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        marginLeft: 15,
        lineHeight: 50
    },
    editButtons: {
        flexDirection: 'row'
    },
    pageHeaderTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10
    },
    pageHeaderDesc: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
        fontSize: 16
    },
    pageHeader: {
        paddingBottom: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    items: {

    },
    item: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    itemCover: {
        marginRight: 10
    },
    itemCoverImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 25
    },
    itemInfo: {
        flex: 1
    },
    itemTitleLink: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY
    },
    itemTitle: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    itemStatus: {
        paddingRight: 30,
        paddingLeft: 15,
        paddingTop: 5
    },
    itemStatusIcon: {
        fontSize: 8,
        color: Colors.PRIMARY
    },
    scroll: {
        flex: 1,
        paddingLeft: 30,

    },
    scrollActived: {
        flex: 1,
        borderTopColor: Colors.SILVER,
        borderTopWidth: 1,
        paddingLeft: 30,

    },
    itemCheckBox: {
        marginRight: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 0,
        overflow: 'hidden'
    },
    itemCheckBoxEnabled: {
        marginRight: 0,
        justifyContent: 'center',
        width: 50,
        height: 50,
        overflow: 'hidden',
        alignItems: 'flex-start'
    },
    itemCheckBoxWrapper: {
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemCheckBoxWrapperChecked: {
        backgroundColor: Colors.PRIMARY,
        borderColor: Colors.PRIMARY,
    },
    itemUnchecked: {
        color: Colors.LIGHT,
        fontSize: 10,

    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    itemDate: {
        fontSize: 11,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
    },
    itemDetailLink: {

    },
    itemDetailLinkText: {
        fontSize: 11,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY
    },
    itemDot: {
        fontSize: 5,
        color: Colors.SILVER,
        marginRight: 5,
        marginLeft: 5
    },
    loadingItem: {
        paddingTop: 15,
        paddingBottom: 15
    },
    itemImagePhd: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: Colors.SILVER_LIGHT

    },
    itemTitlePhd: {
        height: 10,
        marginBottom: 5,
        backgroundColor: Colors.SILVER_LIGHT
    },
    itemMetaPhd: {
        height: 8,
        width: 50,
        marginRight: 5,
        backgroundColor: Colors.SILVER_LIGHT
    },
    itemStatusPhd: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.SILVER_LIGHT
    }
});

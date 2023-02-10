import React, {Component, PureComponent} from "react";
import {
    View,
    Text,
    ImageBackground,
    FlatList,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import WALightBox from "../components/WALightBox";
import {connect} from 'react-redux';
import Icon from "react-native-vector-icons/MaterialIcons";
import {likeShowcase} from "../redux/likes/actions";
import {updateCurrentSalonDetailShowcaseLike} from "../redux/search/actions";
import WAAlert from "../components/WAAlert";

class HomeSalonGalleries extends Component {
    static defaultProps = {
        pageTitle: 'Những tác phẩm đẹp'
    };
    constructor(props) {
        super(props);
        this.state = {
            items: [
            ],
            modalItems: [],
            loginAlert: false
        };
    }

    _renderHeader = () => {
        return <Text style={Styles.pageTitle}>{this.props.pageTitle}</Text>;
    };
    _renderItem = ({item}, index) => {
        return <Item requireLogin={this.requireLogin} onPress={() => {
            this.setState({
                modalItems: item.items.map((it)=>{
                    return {
                        url: it.image
                    }
                })
            })
        }} data={item}/>;
    };
    _keyExtractor = ({item}, index) => {
        return "item-" + index;
    };

    requireLogin = () => {
        this.setState({
            loginAlert: true
        });
    };

    render() {
        let items = this.props.search.currentSalon.showcase;
        return (
            <PageContainer navigation={this.props.navigation} layoutPadding={20}>
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
                <WALightBox
                    items={this.state.modalItems}
                    show={this.state.modalItems.length > 0}
                    onClose={() => {this.setState({modalItems: []})}}
                />
                <FlatList
                    keyExtractor={this._keyExtractor}
                    style={Styles.container}
                    renderItem={this._renderItem}
                    data={items}
                    ListHeaderComponent={this._renderHeader}
                />
            </PageContainer>
        );
    }
}

export default connect(
    state => {
        return {
            search: state.search
        }
    }
)(HomeSalonGalleries);


class IItem extends PureComponent {
    _renderItems = () => {
        let item = this.props.data;
        if (item.items.length === 1) {
            return (
                <View style={Styles.itemWrapper}>
                    <TouchableOpacity
                        onPress={()=>{
                            if(!this.props.account.token){
                                this.props.requireLogin();
                                return false;
                            }
                            this.props.likeShowcase(item.id, (data)=>{
                                this.props.updateCurrentSalonDetailShowcaseLike(item.id, data);
                            });
                        }}
                        hitSlop={{
                            top: 30,
                            left: 30,
                            right: 30,
                            bottom: 0
                        }}
                        style={Styles.showcaseLike}>
                        <Icon style={[Styles.showcaseLikeIcon, item.liked && {color: Colors.PRIMARY}]} name={item.liked?'favorite':"favorite-border"}/>
                    </TouchableOpacity>
                    <View style={Styles.images}>
                        <View style={Styles.ImageFull}>
                            <ImageBackground
                                style={Styles.image}
                                source={{uri: item.items[0].thumb}}
                            />
                        </View>
                    </View>
                    <Text style={Styles.itemTile}>{item.name}</Text>
                </View>
            );
        } else if (item.items.length === 2) {
            return (
                <View style={Styles.itemWrapper}>
                    <TouchableOpacity
                        onPress={()=>{
                            if(!this.props.account.token){
                                this.props.requireLogin();
                                return false;
                            }
                            this.props.likeShowcase(item.id, (data)=>{
                                this.props.updateCurrentSalonDetailShowcaseLike(item.id, data);
                            });
                        }}
                        hitSlop={{
                            top: 30,
                            left: 30,
                            right: 30,
                            bottom: 0
                        }}
                        style={Styles.showcaseLike}>
                        <Icon style={[Styles.showcaseLikeIcon, item.liked && {color: Colors.PRIMARY}]} name={item.liked?'favorite':"favorite-border"}/>
                    </TouchableOpacity>
                    <View style={Styles.images}>
                        <View style={[Styles.ImageHaft, Styles.ImageHaftLeft]}>
                            <ImageBackground
                                style={Styles.image}
                                source={{uri: item.items[0].thumb}}
                            />
                        </View>
                        <View style={[Styles.ImageHaft, Styles.ImageHaftRight]}>
                            <ImageBackground
                                style={Styles.image}
                                source={{uri: item.items[1].thumb}}
                            />
                        </View>
                    </View>
                    <Text style={Styles.itemTile}>{item.name}</Text>
                </View>
            );
        }
        else {
            return (
                <View style={Styles.itemWrapper}>
                    <TouchableOpacity
                        onPress={()=>{
                            if(!this.props.account.token){
                                this.props.requireLogin();
                                return false;
                            }
                            this.props.likeShowcase(item.id, (data)=>{
                                this.props.updateCurrentSalonDetailShowcaseLike(item.id, data);
                            });
                        }}
                        hitSlop={{
                            top: 30,
                            left: 30,
                            right: 30,
                            bottom: 0
                        }}
                        style={Styles.showcaseLike}>
                        <Icon style={[Styles.showcaseLikeIcon, item.liked && {color: Colors.PRIMARY}]} name={item.liked?'favorite':"favorite-border"}/>
                    </TouchableOpacity>
                    <View style={Styles.images}>
                        <View style={[Styles.ImageHaft, Styles.ImageHaftLeft, Styles.ImageHaftLeftAlt]}>
                            <ImageBackground
                                style={Styles.image}
                                source={{uri: item.items[0].thumb}}
                            />
                        </View>
                        <View style={[Styles.ImageHaft, Styles.ImageHaftRight, Styles.ImageHaftRightAlt]}>
                            <ImageBackground
                                style={[Styles.image, Styles.imageTop]}
                                source={{uri: item.items[1].thumb}}
                            />
                            <ImageBackground
                                style={[Styles.image, Styles.imageBottom]}
                                source={{uri: item.items[2].thumb}}
                            />
                        </View>
                    </View>
                    <Text style={Styles.itemTile}>{item.name}</Text>
                </View>
            )
        }
    };

    render() {
        //let items =  this._paging();

        return <TouchableOpacity
            onPress={this.props.onPress}
            style={Styles.item}>{this._renderItems()}</TouchableOpacity>;
    }
}

const Item = connect(
    state => {
        return {
            account: state.account
        }
    },
    {
        likeShowcase,
        updateCurrentSalonDetailShowcaseLike
    }
)(IItem);

const itemHeight = ((Dimensions.get("window").width - 40) * 12) / 16;
const Styles = StyleSheet.create({
    showcaseLike: {
        position: 'absolute',
        zIndex: 1,
        left: 15,
        top: 15
    },
    showcaseLikeIcon: {
        fontSize: 30,
        color: Colors.LIGHT
    },
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1
    },
    pageTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 15
    },
    item: {
        height: itemHeight,
        marginBottom: 20,
        marginTop: 20
    },
    itemWrapper: {
        flex: 1
    },
    ImageFull: {
        flex: 1
    },
    image: {
        flex: 1,
        borderRadius: 5,
        overflow: "hidden"
    },
    imageTop: {
        marginBottom: 3,
    },
    imageBottom: {
        marginTop: 3
    },
    images: {
        flex: 1,
        flexDirection: 'row',
    },
    ImageHaft: {
        flex: 1
    },
    ImageHaftLeft: {
        marginRight: 3,
    },
    ImageHaftRight: {
        marginLeft: 3,
    },
    ImageHaftLeftAlt: {
        flex: 3
    },
    ImageHaftRightAlt: {
        flex: 2
    },
    itemTile: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 17,
        marginTop: 15
    }
});

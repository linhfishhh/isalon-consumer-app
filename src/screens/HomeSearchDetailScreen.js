import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Image, Modal,
    Alert, StatusBar,
    Dimensions,
    Share, TextInput, FlatList, ScrollView, ImageBackground
} from 'react-native';
import ImageSources from "../styles/ImageSources";
import Colors from "../styles/Colors";
import GlobalStyles from "../styles/GlobalStyles";
import PageContainer from "../components/PageContainer";
import {getStatusBarHeight} from 'react-native-status-bar-height'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Carousel from "react-native-snap-carousel";
import WAStars from "../components/WAStars";
import MemberSearchScreen from "./MemberSearchScreen";
import {SceneMap, TabView} from "react-native-tab-view";
import {DotIndicator} from "react-native-indicators";
import {connect} from 'react-redux';
import Utils from '../configs'
import {getHints, doSearch, updateInfo as updateSearchInfo, updateHintLikes} from "../redux/search/actions";
import numeral from 'numeral';
import {likeSalon} from "../redux/likes/actions";


const FakeResult = {
    services: [
        {
            name: 'Hớt tóc nam'
        },
        {
            name: 'Hớt tóc nữ'
        },
        {
            name: 'Phục hồi tóc'
        },
    ],
    salons: [
        {
            image: ImageSources.IMG_SALON_SLIDE_1,
            name: 'Salon tóc Tấn Cang',
            address: '71 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
            distance: 1,
            services: [
                {
                    name: 'Hớt tóc nam kiểu Hàn',
                    price: 125,
                }
            ]
        },
        {
            image: ImageSources.IMG_SALON_SLIDE_2,
            name: 'Viện tóc Envy',
            address: '71 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
            distance: 2,
            services: [
                {
                    name: 'Hớt tóc nữ kiểu Hàn',
                    price: 200,
                    oldPrice: 300
                }
            ]
        },
        {
            image: ImageSources.IMG_SALON_SLIDE_1,
            name: 'Viện tóc Hà Nội',
            address: '71 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
            distance: 3,
            services: [
                {
                    name: 'Chăm sóc phục hồi tóc',
                    price: 500,
                }
            ]
        }
    ]
};

class HomeSearchDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            keyword: '',
            searching: false,
            searchKeyWord: '',
            searchResult: {
                salons: [],
                services: []
            },
            init: false,
            services: [],
            serviceLimit: 3
        }
    }

    async componentDidMount(){
        this.props.getHints();
    }

    _search = () => {
        if (this.state.keyword.trim().length === 0) {
            return;
        }
        this.setState(
            {
                tabIndex: 1,
                searchResult: {
                    services: [],
                    salons: []
                },
            }, ()=>{
                this.props.doSearch(this.state.keyword.trim());
            });
    };

    render() {
        return (
            <PageContainer
            contentWrapperStyle={Styles.container}
        >
                {
                    !this.props.search.fetching?
                        <View style={{flex:1}}>
                            <View style={Styles.header}>
                                <View style={Styles.headerSearch}>
                                    <TextInput
                                        ref={search => {
                                            this.search = search
                                        }}
                                        placeholder={'Nhập tên salon, dịch vụ cần tìm...'}
                                        placeholderTextColor={Colors.TEXT_DARK}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        style={Styles.headerSearchInput}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        returnKeyType={'search'}
                                        value={this.state.text}
                                        editable={!this.state.searching}
                                        onChangeText={(text) => {
                                            this.setState({keyword: text})
                                        }}
                                        onSubmitEditing={this._search}
                                    />
                                    <TouchableOpacity onPress={this._search} style={Styles.headerSearchIcon}>
                                        <Icon style={Styles.headerSearchIconF} name={'search'}/>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.tabIndex === 1) {
                                            this.setState({
                                                tabIndex: 0
                                            }, () => {
                                                this.search.blur();
                                            })
                                        }
                                        else{
                                            this.props.navigation.goBack();
                                        }
                                    }}
                                    hitSlop={touchSize}
                                    style={Styles.headerSearchButton}>
                                    <Text style={Styles.headerSearchButtonText}>{'Hủy'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Tabs
                                services={this.state.services}
                                serviceLimit={this.state.serviceLimit}
                                keyword={this.state.keyword}
                                  index={this.state.tabIndex} navigation={this.props.navigation}/>
                        </View>
                        :
                        <View style={{flex:1}}>
                            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                        </View>
                }
        </PageContainer>
        )
    }

}


class ITabs extends Component {
    static defaultProps = {
        index: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: this._getDefs(),
        };
    }

    _getDefs = () => [
        {
            key: 'default',
            title: 'default',
            navigation: this.props.navigation,
        },
        {
            key: 'result',
            title: 'result',
            navigation: this.props.navigation,
        },
    ];

    _handleIndexChange = index => this.setState({index});

    _renderTabBar = props => {
        return null
    };

    _renderScene = ({route}) => {
        switch (route.key) {
            case 'default':
                return <TabDefault navigation={this.props.navigation}/>;
            case 'result':
                return <TabSearchResult navigation={this.props.navigation} keyword={this.props.keyword}
                                        />;
        }
    };

    render() {

        return (
            <TabView
                animationEnabled={false}
                swipeEnabled={false}
                navigationState={{
                    ...this.state,
                    index: this.props.index,
                    test: this.props.test
                }}
                renderScene={this._renderScene}
                renderTabBar={this._renderTabBar}
                onIndexChange={this._handleIndexChange}
                tabBarPosition={'bottom'}
                useNativeDriver
                keyboardDismissMode="none"
            />
        )
    }
}

class ITabDefault extends Component {
    static defaultProps = {
        services: []
    };
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _keyExtractor = (item, index) => {
        return 'history-item-' + index;
    };

    _renderItem = ({item, index}) => {
        return (
            <View
                style={[Styles.historyItem, (((2 * index) - 1) % 3 === 1) && {flex: 1}]}
            >
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('home_result', {
                                query: {
                                    cat: [
                                        item.id
                                    ],
                                    catTitle: item.name
                                }

                            }
                        )
                    }
                    }
                >
                    <Image
                        style={Styles.historyItemImage}
                        source={item.image}
                    />
                    <Text numberOfLines={1} style={Styles.historyItemText}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    };
    _renderTipItem = ({item, index}) => {
        return (
            <TipItem navigation={this.props.navigation} item={item}/>
        )
    };

    render() {
        return (
            <ScrollView style={Styles.wrapper}>
                <View style={Styles.history}>
                    <Text style={Styles.blockTitle}>
                        Danh mục quan tâm
                    </Text>
                    <FlatList
                        style={Styles.historyItems}
                        data={this.props.search.featuredCats}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        numColumns={3}
                        bounces={false}
                    />
                </View>
                <View style={Styles.tip}>
                    <Text style={[Styles.blockTitle, Styles.blockTitleTip]}>
                        Gợi ý salon
                    </Text>
                    <View style={Styles.tips}>
                        <Carousel
                            ref={(c) => {
                                this._carousel = c;
                            }}
                            data={this.props.search.featuredSalons}
                            renderItem={this._renderTipItem}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Dimensions.get('window').width - 100}
                            inactiveSlideScale={1}
                            inactiveSlideOpacity={1}
                            enableMomentum={true}
                            activeSlideAlignment={'start'}
                            activeAnimationType={'spring'}
                            slideStyle={Styles.itemWrapper}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

class ITabSearchResult extends Component {
    constructor(props){
        super(props);
    }
    _showSearching = () => {
        return <View style={Styles.loading}>
            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        </View>
    };
    _showEmpty = () => {
        return <View style={Styles.noResult}>
            <Text>Không tìm thấy kết quả tương ứng nào</Text>
        </View>
    };
    _showItems = () => {
        if (this.props.search.searchResult.services.length === 0 && this.props.search.searchResult.salons.length === 0) {
            return this._showEmpty();
        }
        else {
            return (
                <View style={Styles.resultZone}>
                    <View style={Styles.resultHeader}>
                        <Text
                            style={Styles.resultHeaderText}>Có {this.props.search.searchResult.services.length + this.props.search.searchResult.total} kết
                            quả cho "{this.props.search.searchResult.keyword}"</Text>
                    </View>
                    <ScrollView style={{flex:1}}>
                        {
                            this.props.search.searchResult.services.length > 0 ?
                                <View>
                                    <View style={Styles.resultServices}>
                                        {
                                            this.props.search.searchResult.services.map((item, index) => {
                                                if(index>2 && this.props.search.searchResult.serviceLimit){
                                                    return false;
                                                }
                                                return (
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.props.navigation.navigate('home_result', {
                                                                query: {
                                                                    cat: [
                                                                        item.id
                                                                    ],
                                                                    keyword: this.props.keyword,
                                                                    catTitle: item.name
                                                                }
                                                            })
                                                        }}
                                                        key={index} style={Styles.resultService}>
                                                        <View style={Styles.resultServiceTag}>
                                                            <Text style={Styles.resultServiceTagText}>
                                                                Dịch vụ
                                                            </Text>
                                                        </View>
                                                        <Text
                                                            numberOfLines={1}
                                                            style={Styles.resultServiceName}>{item.name}</Text>
                                                        <Icon style={Styles.resultServiceIcon}
                                                              name={'keyboard-arrow-right'}/>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    {
                                        this.props.search.searchResult.services.length>=3?
                                            <View style={[Styles.loadMore, Styles.loadMoreFirst]}>
                                                <TouchableOpacity
                                                    onPress={()=>{
                                                        this.props.updateSearchInfo({
                                                            searchResult:{
                                                                ...this.props.search.searchResult,
                                                                serviceLimit: !this.props.search.searchResult.serviceLimit
                                                            }
                                                        });
                                                    }}
                                                    style={Styles.loadMoreButton}>
                                                    <Text style={Styles.loadMoreButtonText}>
                                                        {
                                                            !this.props.search.searchResult.serviceLimit?'Thu gọn kết quả':'Xem tất cả kết quả'
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            :undefined
                                    }
                                </View>
                                : undefined
                        }
                        {
                            this.props.search.searchResult.salons.length > 0 ?
                                <View>
                                    <View style={Styles.resultSalons}>
                                        {
                                            this.props.search.searchResult.salons.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.props.navigation.navigate('home_salon', {
                                                                id: item.id
                                                            })
                                                        }}
                                                        key={index} style={Styles.resultSalon}>
                                                        <View style={Styles.resultSalonCover}>
                                                            <Image
                                                                source={{uri: item.image}}
                                                                style={Styles.resultSalonCoverImage}/>
                                                        </View>
                                                        <View style={Styles.resultSalonInfo}>
                                                            <View style={Styles.resultSalonName}>
                                                                <Text style={Styles.resultSalonNameText}>{item.name}</Text>
                                                            </View>
                                                            <View style={Styles.resultSalonAddressDistance}>
                                                                <Text
                                                                    numberOfLines={1}
                                                                    style={Styles.resultSalonAddress}>
                                                                    {item.address}
                                                                </Text>
                                                                <Icon style={Styles.resultSalonDistanceIcon} name={'place'} />
                                                                <Text
                                                                    numberOfLines={1}
                                                                    style={Styles.resultSalonDistanceText}>
                                                                    {item.distance}Km
                                                                </Text>
                                                            </View>
                                                            <View style={Styles.resultSalonItems}>
                                                                {
                                                                    item.services.map((sitem,  sindex) => {
                                                                        return (
                                                                            <View
                                                                                style={Styles.resultSalonItem}
                                                                                key={sindex}>
                                                                                <Text
                                                                                    numberOfLines={1}
                                                                                    style={Styles.resultSalonItemName}>{sitem.name}</Text>
                                                                                {
                                                                                    sitem.oldPrice?
                                                                                        <Text style={Styles.resultSalonItemOldPrice}>
                                                                                            {sitem.oldPrice}
                                                                                        </Text>
                                                                                        :undefined
                                                                                }
                                                                                <Text style={Styles.resultSalonItemPrice}>
                                                                                    {sitem.price}
                                                                                </Text>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    {
                                        this.props.search.searchResult.salons.length>=0?
                                            <View style={Styles.loadMore}>
                                                <TouchableOpacity
                                                    onPress={()=>{
                                                        this.props.navigation.navigate('home_result', {
                                                            query: {
                                                                keyword: this.props.keyword
                                                            }
                                                        })
                                                    }}
                                                    style={Styles.loadMoreButton}>
                                                    <Text style={Styles.loadMoreButtonText}>Xem tất cả kết quả</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :undefined
                                    }
                                </View>
                                :undefined
                        }
                    </ScrollView>
                </View>
            )
        }
    };

    render() {
        return (
            this.props.search.fetching ?
                this._showSearching()
                : this._showItems()
        )
    }
}

class ITipItem extends PureComponent {

    constructor(props: Readonly<P>) {
        super(props);
        this.state = {}
    }

    _goToSalon = (salon_id) => {
        this.props.navigation.navigate('home_salon', {
            id: salon_id
        })
    };

    _like = () => {
        this.props.likeSalon(this.props.item.id, (liked) => {
            this.props.updateHintLikes(this.props.item.id, liked)
        });
    };

    render() {
        let item = this.props.item;
        return (
            <View style={Styles.item}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={()=>this._goToSalon(this.props.item.id)}
                    style={Styles.itemCover}
                >
                    <ImageBackground source={item.image} style={Styles.itemCoverImage}>
                        <TouchableOpacity
                            hitSlop={touchSize}
                            onPress={this._like}
                            style={Styles.likeSalon}
                        >
                            <Icon
                                style={[
                                    Styles.likeSalonIcon,
                                    item.liked && Styles.likeSalonIconLiked
                                ]}
                                name={item.liked ? "favorite" : "favorite-border"}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={Styles.itemBody}>
                    <View style={Styles.itemTitle}>
                        <TouchableOpacity onPress={()=>this._goToSalon(this.props.item.id)}>
                            <Text style={Styles.itemTitleText}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.itemAddress}>
                        <View style={Styles.itemAddressTextWrapper}>
                            <Text numberOfLines={1} style={Styles.itemAddressText}>
                                {item.address}
                            </Text>
                        </View>
                        <View style={Styles.itemAddressDistance}>
                            <Icon
                                style={Styles.itemAddressDistanceIcon}
                                name={"location-on"}
                            />
                            <Text style={Styles.itemAddressDistanceText}>
                                {item.distance}Km
                            </Text>
                        </View>
                    </View>
                    <View style={Styles.itemRatingPrice}>
                        <Text style={Styles.itemRatingNumber}>{numeral(item.rating).format('0,0.0')}</Text>
                        <View style={Styles.itemRating}>
                            <WAStars
                                set={""}
                                rating={item.rating}
                                starInfo={'( ' + item.ratingCount + ' )'}
                            />
                        </View>
                        <Text style={Styles.itemPrice}>Từ {item.price}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const Tabs = connect(
    state=>{
        return {
            search: state.search
        }
    }
)(ITabs);

const TabDefault = connect(
    state=>{
        return {
            search: state.search
        }
    }
)(ITabDefault);

const TabSearchResult = connect(
    state=>{
        return {
            search: state.search
        }
    },
    {
        updateSearchInfo
    }
)(ITabSearchResult);

const TipItem = connect(
    state=>{
        return {
            search: state.search,
        }
    },
    {
        likeSalon,
        updateHintLikes
    }
)(ITipItem);

export default connect(
    state => {
        return {
            search: state.search,
            home: state.home
        }
    },
    {
        getHints,
        doSearch
    }
)(HomeSearchDetailScreen);

const touchSize = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
};

const Styles = StyleSheet.create({
    noResult: {
      flex: 1,
        alignItems: 'center',
        padding: 30
    },
    container: {
        paddingTop: getStatusBarHeight()
    },
    wrapper: {
        flex: 1
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerSearch: {
        backgroundColor: '#F2F2F2',
        borderRadius: 3,
        paddingLeft: 15,
        paddingRight: 45,
        flex: 1,
        position: 'relative'
    },
    headerSearchInput: {
        height: 50,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    headerSearchButton: {
        marginLeft: 15
    },
    headerSearchButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
    },
    headerSearchIcon: {
        position: 'absolute',
        right: 10,
    },
    headerSearchIconF: {
        fontSize: 30,
        lineHeight: 50,
        color: Colors.PRIMARY,
    },
    history: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
    },

    blockTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        marginBottom: 10
    },
    historyItems: {},
    historyItemImage: {
        height: 80,
        width: 80,
        resizeMode: 'cover',
        borderRadius: 40,
        marginBottom: 10
    },
    historyItem: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    historyItemText: {
        width: 80,
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.TEXT_DARK,
    },
    tip: {

        paddingTop: 20,
        paddingBottom: 20,
    },

    blockTitleTip: {
        paddingLeft: 20,
        paddingRight: 20,
    },

    item: {
        elevation: 2,
        backgroundColor: Colors.LIGHT,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        marginLeft: 20,
        borderRadius: 5
    },
    itemWrapper: {},
    itemCover: {
        height: 200
    },
    itemCoverPlaceholder: {
        flex: 1,
        backgroundColor: Colors.SILVER_LIGHT
    },
    itemBody: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    itemTitle: {
        marginBottom: 10
    },
    itemTitleTextPlaceholder: {
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "50%"
    },
    itemAddress: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    itemAddressTextWrapper: {
        flex: 1
    },
    itemAddressTextPlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "70%"
    },
    itemAddressDistancePlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "10%"
    },
    itemRatingPrice: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    itemRating: {
        flex: 1
    },
    itemRatingPlaceholder: {
        height: 15,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "55%"
    },
    PricePlaceholder: {
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        width: "15%"
    },
    itemCats: {},
    itemCatPlaceholder: {
        flexDirection: "row"
    },
    itemCatPlaceholderItem: {
        flex: 1,
        height: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        marginRight: 5
    },
    itemCoverImage: {
        flex: 1
    },
    itemTitleText: {
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: "bold"
    },
    likeSalon: {
        position: "absolute",
        right: 15,
        top: 15
    },
    likeSalonIcon: {
        fontSize: 30,
        color: Colors.LIGHT
    },
    likeSalonIconLiked: {
        color: Colors.ERROR
    },
    itemAddressText: {
        color: Colors.SILVER_DARK,
        fontSize: 10,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemAddressDistance: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemAddressDistanceIcon: {
        color: Colors.SILVER_DARK,
        fontSize: 10,
        marginRight: 2
    },
    itemAddressDistanceText: {
        color: Colors.SILVER_DARK,
        fontSize: 10,
        fontFamily: GlobalStyles.FONT_NAME
    },
    itemRatingNumber: {
        fontSize: 12,
        marginRight: 5,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: "bold",
        color: Colors.TEXT_DARK
    },
    itemPrice: {
        color: Colors.PRIMARY,
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: GlobalStyles.FONT_NAME
    },
    loading: {
        flex: 1
    },
    resultZone: {
        flex: 1,
    },
    resultHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
    },
    resultHeaderText: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME
    },
    resultServices: {
    },
    resultService: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultServiceTag: {
        backgroundColor: '#46D3C5',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 15,
        marginRight: 10
    },
    resultServiceTagText: {
        color: Colors.TEXT_DARK,
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 30
    },
    resultServiceName: {
        flex: 1,
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    resultServiceIcon: {
        color: Colors.SILVER_LIGHT,
        fontSize: 30,
    },
    loadMore: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    loadMoreFirst: {
        borderBottomWidth: 5,
        borderBottomColor: Colors.SILVER_LIGHT
    },
    loadMoreButton: {
        backgroundColor: Colors.SILVER_LIGHT,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 17
    },
    loadMoreButtonText: {
        color: Colors.TEXT_LINK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 34
    },
    resultSalons: {

    },
    resultSalon: {
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultSalonCover: {
        marginRight: 15
    },
    resultSalonCoverImage: {
        height: 40,
        width: 40,
        resizeMode: 'cover',
        borderRadius: 20
    },
    resultSalonInfo: {
        flex: 1,
    },
    resultSalonName: {
        marginTop: 10
    },
    resultSalonNameText: {
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold'
    },
    resultSalonAddressDistance: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        marginTop: 5,
        marginBottom: 10
    },
    resultSalonAddress: {
        flex: 1,
        color: Colors.SILVER_DARK,
        fontSize: 10,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    resultSalonDistanceIcon: {
        color: Colors.SILVER_DARK,
        fontSize: 15
    },
    resultSalonDistanceText: {
        color: Colors.SILVER_DARK,
        fontSize: 10,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    resultSalonItems: {
        
    },
    resultSalonItem: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    resultSalonItemName: {
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        flex: 1
    },
    resultSalonItemOldPrice: {
        color: Colors.SILVER,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "#000",
        marginRight: 10
    },
    resultSalonItemPrice: {
        color: Colors.PRIMARY,
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold'
    }
});
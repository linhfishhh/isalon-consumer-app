import React, {Component} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from "react-native-slider";
import Svg, {Path} from "react-native-svg";
import WASearchFilter from "../components/WASearchFilter";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import {cacheCats, updateFilterSettings} from "../redux/filter/actions";

type Props = {};
class HomeResultFilterScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            sale: false,
            price: 0,
            priceShow: false,
            distance: 50,
            distanceShow: false,
            rating: 0,
            ratingShow: false,
            cat: undefined,
            catID: undefined,
            showCatSelector: false,
        }
    }
    componentDidMount = () => {
        let query = this.props.navigation.getParam('query');
        let overwrite = {};
        if(query.is_sale){
            overwrite.sale = true;
        }
        if(query.price){
            overwrite.price = query.price;
        }
        if(query.rating){
            overwrite.rating = query.rating;
        }
        if(query.cat){
            if(query.cat.length){
                if(query.cat.length > 0 && query.catTitle){
                    overwrite.cat = {
                        id: query.cat[0],
                        title: query.catTitle
                    };
                }
            }
        }
        if(query.distance){
            overwrite.distance = query.distance;
        }
        this.setState(overwrite);

    };
    render() {
        return (
                !this.state.showCatSelector?
                <PageContainer
                    darkTheme={false}
                    contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                    navigation={this.props.navigation}
                    backgroundColor={Colors.DARK}
                    navigationClose={true}
                    navigationAction={()=>{this.props.navigation.navigate('home_result')}}
                    navigationButtonStyle={Styles.closeButton}
                    headerTitle={'Bộ lọc'}
                    headerTitleStyle={{color: Colors.LIGHT, fontSize: 20}}
                    layoutPadding={30}
                    rightComponent={
                        <TouchableOpacity
                            hitSlop={touchSize}
                            onPress={()=>{
                                let old_query = this.props.navigation.getParam('query');
                                let apply_fn = this.props.navigation.getParam('onApply');
                                let query = {};
                                if(this.state.rating !== 0){
                                    query.rating = this.state.rating;
                                }
                                if(this.state.price !== 0){
                                    query.price = this.state.price;
                                }
                                if(this.state.cat){
                                    query.cat = [this.state.cat.id];
                                    query.catTitle = this.state.cat.title;
                                }
                                if(this.state.sale){
                                    query.is_sale = true
                                }
                                if(this.state.distance){
                                    query.distance = this.state.distance
                                }
                                if(old_query.address_lat && old_query.address_lng && old_query.address_text){
                                    query.address_lat = old_query.address_lat;
                                    query.address_lng = old_query.address_lng;
                                    query.address_text = old_query.address_text
                                }
                                apply_fn(query);
                            }}
                            style={Styles.save}>
                            <Text style={Styles.saveText}>Áp dụng</Text>
                        </TouchableOpacity>
                    }
                >
                    <ScrollView style={Styles.menu}>
                        <View style={[Styles.item, Styles.noBorder]}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        sale: !this.state.sale
                                    });
                                }}
                                style={Styles.itemTitle}>
                                <Text style={Styles.itemTitleText}>
                                    Khuyến mãi
                                </Text>
                                <View style={Styles.itemTitleRight}>
                                    <View
                                        style={Styles.itemTitleChk}>
                                        <View style={Styles.itemTitleChkWrapper}>
                                            {
                                                this.state.sale?
                                                    <View style={Styles.itemTitleChkInner}/>
                                                    :undefined
                                            }
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.item}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.cacheCats();
                                    this.setState({
                                        showCatSelector: true
                                    });
                                }}
                                hitSlop={touchSize}
                                style={Styles.itemTitle}>
                                <Text style={Styles.itemTitleText}>
                                    Dịch vụ
                                </Text>
                                <View style={Styles.itemTitleRight}>
                                    <View
                                        style={Styles.selector}>
                                        <Text style={Styles.selectorText}>{this.state.cat?this.state.cat.title:''}</Text>
                                        <Icon style={Styles.selectorIcon} name={'keyboard-arrow-right'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.item}>
                            <TouchableOpacity
                                hitSlop={touchSize}
                                onPress={()=>{
                                    this.setState({
                                        priceShow: !this.state.priceShow
                                    });
                                }}
                                style={Styles.itemTitle}>
                                <Text style={Styles.itemTitleText}>
                                    Giá
                                </Text>
                                <View style={Styles.itemTitleRight}>
                                    <View
                                        style={Styles.selector}>
                                        {
                                            !this.state.priceShow && this.state.price>0?
                                                <Text style={Styles.selectorText}>{this.state.price}K</Text>
                                                :undefined
                                        }
                                        <Icon style={Styles.selectorIcon} name={this.state.priceShow?'keyboard-arrow-down':'keyboard-arrow-right'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {
                                this.state.priceShow?
                                    <View style={Styles.silderFilter}>
                                        <Slider
                                            maximumValue={1000}
                                            step={1}
                                            thumbStyle={{width: 30, height: 30, borderRadius: 15}}
                                            value={this.state.price}
                                            onValueChange={value => this.setState({ price: value })}
                                            thumbTintColor={Colors.PRIMARY}
                                            minimumTrackTintColor={Colors.SILVER}
                                            maximumTrackTintColor={Colors.SILVER_DARK}
                                            trackStyle={{height: 3}}
                                        />
                                        <Text style={Styles.silderFilterText}>
                                            {this.state.price}K
                                        </Text>
                                    </View>
                                    :undefined
                            }
                        </View>
                        <View style={Styles.item}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        ratingShow: !this.state.ratingShow
                                    });
                                }}
                                hitSlop={touchSize}
                                style={Styles.itemTitle}>
                                <Text style={Styles.itemTitleText}>
                                    Nhận xét đánh giá
                                </Text>
                                <View style={Styles.itemTitleRight}>
                                    <View
                                        style={Styles.selector}>
                                        {
                                            !this.state.ratingShow && this.state.rating>0?
                                                <Text style={Styles.selectorText}>{this.state.rating} sao</Text>
                                                :undefined
                                        }
                                        <Icon style={Styles.selectorIcon} name={this.state.ratingShow?'keyboard-arrow-down':'keyboard-arrow-right'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {
                                this.state.ratingShow?
                                    <View style={Styles.ratingFilter}>
                                        <View style={Styles.ratingStars}>
                                            {
                                                [1, 2, 3, 4, 5].map((item) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={Styles.ratingStar}
                                                                onPress={()=>{
                                                                    this.setState({
                                                                        rating: item
                                                                    });
                                                                }}
                                                                key={'rating-'+item}>
                                                                <Svg width={30} height={30}>
                                                                    <Path
                                                                        d="M13.65,23,6.29,26.93A.84.84,0,0,1,5.06,26l1.41-8.3A.84.84,0,0,0,6.23,17l-6-5.89A.84.84,0,0,1,.72,9.68L9,8.47A.84.84,0,0,0,9.6,8L13.29.47a.84.84,0,0,1,1.51,0L18.48,8a.84.84,0,0,0,.63.46l8.25,1.21a.84.84,0,0,1,.47,1.43l-6,5.89a.84.84,0,0,0-.24.74L23,26a.84.84,0,0,1-1.22.88L14.44,23A.84.84,0,0,0,13.65,23Z"
                                                                        fill={this.state.rating>=item?'#ffb600':Colors.SILVER_DARK}/>
                                                                </Svg>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                )
                                            }
                                        </View>
                                    </View>
                                    :undefined
                            }
                        </View>
                        <View style={Styles.item}>
                            <TouchableOpacity
                                hitSlop={touchSize}
                                onPress={()=>{
                                    this.setState({
                                        distanceShow: !this.state.distanceShow
                                    });
                                }}
                                style={Styles.itemTitle}>
                                <Text style={Styles.itemTitleText}>
                                    Khoảng cách
                                </Text>
                                <View style={Styles.itemTitleRight}>
                                    <View
                                        style={Styles.selector}>
                                        {
                                            !this.state.distanceShow && this.state.distance>0?
                                                <Text style={Styles.selectorText}>{this.state.distance}Km</Text>
                                                :undefined
                                        }
                                        <Icon style={Styles.selectorIcon} name={this.state.distanceShow?'keyboard-arrow-down':'keyboard-arrow-right'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {
                                this.state.distanceShow?
                                    <View style={Styles.silderFilter}>
                                        <Slider
                                            minimumValue={1}
                                            maximumValue={50}
                                            step={1}
                                            thumbStyle={{width: 30, height: 30, borderRadius: 15}}
                                            value={isNaN(this.state.distance)?50:this.state.distance*1.0}
                                            onValueChange={value => this.setState({ distance: isNaN(value)?50:value*1.0 })}
                                            thumbTintColor={Colors.PRIMARY}
                                            minimumTrackTintColor={Colors.SILVER}
                                            maximumTrackTintColor={Colors.SILVER_DARK}
                                            trackStyle={{height: 3}}
                                        />
                                        <Text style={Styles.silderFilterText}>
                                            {this.state.distance}Km
                                        </Text>
                                    </View>
                                    :undefined
                            }
                        </View>
                        <View style={{marginBottom: 100}}/>
                    </ScrollView>
                    <WASearchFilter
                        addressText={
                            this.props.navigation.getParam('query') && this.props.navigation.getParam('query').address_text?
                                this.props.navigation.getParam('query').address_text:
                                'Địa điểm'
                        }
                        query={this.props.navigation.getParam('query')} onApply={this.props.navigation.getParam('onApply')}
                        bg={require('../assets/images/filler_bg2.png')} navigation={this.props.navigation} />
                </PageContainer>
                    :<View style={Styles.catSelector}>
                        <StatusBar
                            translucent={true}
                            backgroundColor={'transparent'}
                            barStyle={'dark-content'}
                        />
                        <View style={{flex: 1}}>
                            <View style={Styles.catSelectorHeader}>
                                <View style={Styles.catSelectorHeaderButton}>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            this.setState({
                                                showCatSelector: false
                                            });
                                        }}
                                        hitSlop={touchSize}
                                    >
                                        <Icon style={Styles.catSelectorHeaderButtonText} name={'keyboard-backspace'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={Styles.catSelectorHeaderCenter}>
                                    <Text style={Styles.catSelectorHeaderTitle}>
                                        Chọn dịch vụ
                                    </Text>
                                </View>
                                <View style={Styles.catSelectorHeaderButton}>
                                </View>
                            </View>
                            {
                                this.props.filter.fetching ?
                                    <DotIndicator color={Colors.PRIMARY} count={3} size={10}/>
                                    :
                                    <FlatList
                                        style={Styles.cats}
                                        data={this.props.filter.cacheCats}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem}
                                    />
                            }
                        </View>
                    </View>
        )
    }

    _keyExtractor = (item) => {
        return 'cat-'+item.id;
    };

    _renderItem = ({item}) => {
        return(
            <TouchableOpacity
                onPress={()=>{
                    this.setState({
                        cat: {
                            id: item.id,
                            title: item.title
                        },
                        showCatSelector: false
                    });
                }}
                hitSlop={touchSize}
                style={Styles.cat}
                >
                <Text
                    style={Styles.catText}
                >{item.title}</Text>
            </TouchableOpacity>
        )
    };
}
export default connect(
    state => {
        return {
            filter: state.filter
        }
    },
    {
        cacheCats,
        updateFilterSettings
    }
)(
    HomeResultFilterScreen
);
const touchSize = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};

const Styles = StyleSheet.create({
    cats: {
      flex: 1,
      padding: 20
    },
    cat: {
        paddingTop: 15,
        paddingBottom: 15
    },
    catText: {
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK
    },
    catSelector: {
        flex: 1,
        height: 50 + getStatusBarHeight(),
        paddingTop: getStatusBarHeight(),
        backgroundColor: 'white'
    },

    catSelectorHeaderTitle: {
        fontSize: 25,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.DARK
    },

    catSelectorHeaderButton: {
        flex: 1,
    },
    catSelectorHeaderButtonText: {
        fontSize: 30,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY
    },
    catSelectorHeaderCenter: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    catSelectorHeader: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    pageWrapper:{
        flex: 1,
        paddingLeft: 30,
        paddingRight: 0,

    },
    closeButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    saveText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 19
    },
    menu: {
      //backgroundColor: Colors.PRIMARY,
        flex: 1,
        marginTop: 30,
    },
    item: {
        paddingTop: 20,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingRight: 20
    },
    noBorder: {
        borderTopWidth: 0
    },
    itemTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    itemTitleChk: {
      marginRight: 10
    },
    itemTitleChkWrapper: {
        height: 26,
        width: 26,
        borderRadius: 13,
        backgroundColor: Colors.LIGHT,
        position: 'relative'
    },
    itemTitleChkInner: {
        position: 'absolute',
        height: 14,
        width: 14,
        borderRadius: 7,
        top: 6,
        left: 6,
        backgroundColor: Colors.PRIMARY
    },
    itemTitleText: {
        flex: 1,
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 19
    },
    itemTitleRight: {
        paddingRight: 0
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectorText: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        marginRight: 5
    },
    selectorIcon: {
        color: Colors.PRIMARY,
        fontSize: 40
    },
    silderFilter: {
        marginTop: 15,
        marginBottom: 15
    },
    silderFilterText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        marginTop: 5
    },
    ratingFilter: {
      marginTop: 20,
      marginBottom: 15,
        paddingLeft: 20
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingStar: {
        flex: 1
    }
});
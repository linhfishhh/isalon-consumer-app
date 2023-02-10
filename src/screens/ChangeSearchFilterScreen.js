import React, {Component, PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import numeral from 'numeral';
import {updateSearchState} from "../redux/new_search/actions";
import {connect} from "react-redux";
import Switch from 'react-native-switch-pro'
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {updateSearchCacheState} from "../redux/new_search_cache/actions";


type Props = {};
const defaultFilters = Utils.getDefaultFilters();
class ChangeSearchFilterScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            filters: this.props.search.filters,
            locations: [],
            location_show_all: false
        };
    }

    _selectLocation = (location) => {
        this.setState({
            filters: {
                ...this.state.filters,
                local: location
            }
        });
    };

    _selectRating = (rating) => {
        this.setState({
            filters: {
                ...this.state.filters,
                rating: rating
            }
        });
    };

    _changeSale = (value) => {
        this.setState({
            filters: {
                ...this.state.filters,
                sale_off: value
            }
        })
    };

    _changePriceRange = (value) => {
        this.setState({
            filters:{
                ...this.state.filters,
                price_from: value[0],
                price_to: value[1]
            }
        });
    };

    _beautyItems = (data) => {
        let index;
        let select_item = null;
        for (index in data){
            let item = data[index];
            if(item.id === this.state.filters.local.id && index>5){
                select_item = item;
                break;
            }
        }
        let items;
        if(select_item){
            items = data.filter((local, local_index) => {
                return local.id !== select_item.id;

            });
            items.unshift(select_item);
        }
        else{
            items = data;
        }
        return items;
    };

    _loadData = () => {
        let id = this.props.search.search_location.id;
        if(id !== 0){
            this.setState({
                loading: true,
            }, async ()=>{
                if(this.props.search_cache.locations.lv2.length>0){
                    let items = this._beautyItems(this.props.search_cache.locations.lv2);
                    this.setState({
                        loading: false,
                        locations: [
                            defaultFilters.local,
                            ...items
                        ]
                    });
                }
                else{
                    try{
                        let rs = await Utils.getAxios().post('search/location-list/'+ id);

                        let items = rs.data;

                        this.props.updateSearchCacheState({
                            locations: {
                                ...this.props.search_cache.locations,
                                lv2: items
                            }
                        });

                        items = this._beautyItems(items);
                        this.setState({
                            loading: false,
                            locations: [
                                defaultFilters.local,
                                ...items
                            ]
                        });
                    }
                    catch (e) {
                    }
                }
            });
        }
    };

    componentDidMount(){
        this._loadData();
    }

    _apply = () =>{
        this.props.updateSearchState({
            filters: this.state.filters
        });
        let fn = this.props.navigation.getParam('apply');
        fn();
        this.props.navigation.goBack();
    };

    enableScroll = () => this.setState({ scrollEnabled: true });
    disableScroll = () => this.setState({ scrollEnabled: false });

    formatPriceSuffix = (price) => {
        return numeral(price).format('0,000');
    };

    formatPriceValue = () => {
        let rs;
        if(this.state.filters.price_from === defaultFilters.price_from && this.state.filters.price_to === defaultFilters.price_to){
            rs = 'Bất Kỳ';
        }
        else{
            if(this.state.filters.price_from === defaultFilters.price_from){
                let t = this.formatPriceSuffix(this.state.filters.price_to);
                rs = 'Đến '+t;
            }
            else if(this.state.filters.price_to === defaultFilters.price_to){
                let f = this.formatPriceSuffix(this.state.filters.price_from);
                rs = 'Từ '+f;
            }
            else{
                let f = this.formatPriceSuffix(this.state.filters.price_from);
                let t = this.formatPriceSuffix(this.state.filters.price_to);
                rs = <Text>{f} <Text style={{color: Colors.SILVER_DARK}}>đến</Text> {t}</Text>;
            }
        }
        return rs;
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.PRIMARY}}
                headerTitle={'BỘ LỌC'}
                headerTitleStyle={{fontSize: 16, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
                rightComponent={
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                filters: defaultFilters
                            });
                        }}
                        hitSlop={{top: 15, bottom: 15, left: 0, right: 0}}
                    >
                        <Text style={Styles.resetFilter}>Xoá bộ lọc</Text>
                    </TouchableOpacity>
                }
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>:
                        <View style={{flex: 1}}>
                            <ScrollView
                              keyboardShouldPersistTaps="always"
                              style={{flex: 1}} scrollEnabled={this.state.scrollEnabled}>
                                <View style={Styles.filterGroup}>
                                    <Text style={Styles.filterGroupTitle}>Khuyến mãi</Text>
                                    <View style={Styles.filterLine}>
                                        <Text style={Styles.filterLineText}>Đang khuyến mãi?</Text>
                                        <View style={Styles.filterLineValue}>
                                            <Switch
                                                value={this.state.filters.sale_off}
                                                width={50}
                                                height={30}
                                                circleStyle={{height: 26, width: 26}}
                                                backgroundActive={Colors.PRIMARY}
                                                onSyncPress={(value) => {this._changeSale(value)}}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={Styles.filterGroup}>
                                    <Text style={Styles.filterGroupTitle}>Giá dịch vụ</Text>
                                    <View style={Styles.filterSlider}>
                                        <Text style={Styles.filterSliderText}>Giá dịch vụ: <Text style={Styles.filterSliderPrice}>{this.formatPriceValue()}</Text></Text>
                                        <MultiSlider
                                            customMarker={()=>{
                                                return (
                                                    <View style={Styles.sliderHandle}>
                                                    </View>
                                                )
                                            }}
                                        onValuesChangeStart={this.disableScroll}
                                        onValuesChangeFinish={this.enableScroll}
                                        onValuesChange={(value)=>{
                                           this._changePriceRange(value);
                                        }}
                                        values={[
                                            this.state.filters.price_from,
                                            this.state.filters.price_to
                                        ]}
                                        min={defaultFilters.price_from}
                                        max={defaultFilters.price_to}
                                        step={5000}
                                        sliderLength={Dimensions.get('window').width - 60}
                                        selectedStyle={{
                                            backgroundColor: Colors.PRIMARY
                                        }}
                                        />
                                    </View>
                                </View>
                                <View style={Styles.filterGroup}>
                                    <Text style={Styles.filterGroupTitle}>Xếp hạng sao</Text>
                                    <Ratings onSelect={this._selectRating} rating={this.state.filters.rating}/>
                                </View>
                                {
                                    !this.state.locations?undefined:
                                        <Locations
                                            onSelect={this._selectLocation}
                                            locations={this.state.locations} local={this.state.filters.local} />
                                }
                            </ScrollView>
                            <View style={Styles.saveBar}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.props.navigation.goBack();
                                    }}
                                    style={[Styles.saveBarBtn, Styles.saveBarBtnClose]}>
                                    <Text style={Styles.saveBarbtnText}>HUỶ BỎ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this._apply}
                                    style={[Styles.saveBarBtn]}>
                                    <Text style={Styles.saveBarbtnText}>ÁP DỤNG</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </PageContainer>
        )
    }
}

class Locations extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            location_show_all: false
        }
    }

    render(){
        return (
            <View style={Styles.filterGroup}>
                <Text style={Styles.filterGroupTitle}>Quận / Huyện</Text>
                {
                    this.props.locations
                        .filter((item, index)=>{
                            if(this.state.location_show_all){
                                return true;
                            }
                            else{
                                return index<=5
                            }
                        })
                        .map((item, index)=>{
                            let active = this.props.local.id === item.id;
                            return (
                                <TouchableOpacity key={index} style={Styles.ratingLine}
                                                  onPress={()=>{this.props.onSelect(item)}}
                                >
                                    <Text style={[Styles.ratingText, active && Styles.ratingTextActive]}>{item.name}</Text>
                                    <Icon style={[Styles.ratingIcon, active && Styles.ratingIconActive]} name={active?'radio-button-checked':'radio-button-unchecked'} />
                                </TouchableOpacity>
                            );
                        })
                }
                {
                    (!this.state.location_show_all && this.props.locations.length>5)?
                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    location_show_all: true
                                });
                            }}
                            style={Styles.filterGroupShowAll}>
                            <Text style={Styles.filterGroupShowAllText}>Hiển thị nhiều hơn</Text>
                            <Icon style={Styles.filterGroupShowAllIcon} name={'keyboard-arrow-down'}/>
                        </TouchableOpacity>
                        :undefined
                }
            </View>
        );
    }
}

class Ratings extends PureComponent {
    render(){
        return(
            <View>
                {
                    [
                        'Tất cả xếp hạng',
                        '1 sao',
                        '2 sao',
                        '3 sao',
                        '4 sao',
                        '5 sao'
                    ].map((item, index) => {
                        let active = this.props.rating === index;
                        return (
                            <TouchableOpacity key={index} style={Styles.ratingLine}
                                              onPress={()=>{
                                                  this.props.onSelect(index);
                                              }}
                            >
                                <Text style={[Styles.ratingText, active && Styles.ratingTextActive]}>{item}</Text>
                                <Icon style={[Styles.ratingIcon, active && Styles.ratingIconActive]} name={active?'radio-button-checked':'radio-button-unchecked'} />
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

export default connect(
    state => {
        return {
            search: state.new_search,
            search_cache: state.new_search_cache
        }
    },
    {
        updateSearchState,
        updateSearchCacheState
    }
)(ChangeSearchFilterScreen);



const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },

    resetFilter: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 14,
    },

    saveBar: {
        backgroundColor: Colors.DARK,
        flexDirection: 'row'
    },
    saveBarBtn: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        margin: 15,
        borderRadius: 2
    },
    saveBarbtnText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 14
    },
    saveBarBtnClose: {
        backgroundColor: Colors.SILVER_DARK
    },
    filterGroup: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 30,
        paddingBottom: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
    },
    filterGroupTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    filterLine: {
      flexDirection:'row',
        alignItems: 'center'
    },
    filterLineText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 14,
        flex: 1
    },
    filterSlider:{
        marginLeft: 15,
        marginRight: 15
    },
    filterSliderText: {
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 14,
        marginBottom: 10,
    },
    filterSliderPrice: {
        color: Colors.PRIMARY
    },
    sliderHandle: {
        borderColor: Colors.PRIMARY,
        borderWidth: 2,
        height: 34,
        width: 34,
        backgroundColor: Colors.LIGHT,
        borderRadius: 17
    },
    ratingLine: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 2,
        paddingTop: 2,
    },
    ratingText: {
        flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 16,
    },
    ratingTextActive: {
        color: Colors.TEXT_DARK
    },
    ratingIcon: {
        fontSize: 34,
        color: Colors.SILVER_LIGHT
    },
    ratingIconActive: {
        color: Colors.PRIMARY
    },
    filterGroupShowAll: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        marginBottom: 50
    },
    filterGroupShowAllText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 16,
    },
    filterGroupShowAllIcon: {
        fontSize: 20,
        color: Colors.PRIMARY,

    }
});

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import  SearchInput, { createFilter } from 'react-native-search-filter';
import slugify from 'slugify';
import {connect} from "react-redux";
import {updateSearchState} from "../redux/new_search/actions";
import {updateSearchCacheState} from "../redux/new_search_cache/actions";

type Props = {};
const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();
class ChangeSearchTypeScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            select_location: this.props.search.search_location,
            type: this.props.search.search_type.slug,
            loading: false,
        };
    }
    _loadData = () => {
        this.setState({
            loading: true
        }, async ()=>{
            if(this.props.search_cache.locations.lv1.length>0){
                this.setState({
                    loading: false,
                    locations: [
                        {
                            id: 0,
                            name: 'Toàn quốc',
                            slug: 'toan-quoc'
                        },
                        ...this.props.search_cache.locations.lv1
                    ],
                    searchTerm: ''
                });
                return true;
            }
            else{
                try{
                    let rq = await Utils.getAxios().post('search/location-list');
                    let ls = rq.data.map((item, index) => {
                        return {
                            ...item,
                            slug: slugify(item.name, {lower: true})
                        }
                    });
                    this.props.updateSearchCacheState({
                        locations: {
                            ...this.props.search_cache.locations,
                            lv1: ls
                        }
                    });
                    this.setState({
                        loading: false,
                        locations: [
                            {
                                id: 0,
                                name: 'Toàn quốc',
                                slug: 'toan-quoc'
                            },
                            ...ls
                        ],
                        searchTerm: ''
                    });
                }
                catch (e) {
                }
            }
        });
    };

    componentDidMount(){
        this._loadData();
    }

    _keyExtractor = (item, index) => {
        return item.id+''
    };

    _renderItem = ({item}) => {
        return <TouchableOpacity
            onPress={()=>{
                this.setState({
                    select_location: {
                        id: item.id,
                        name: item.name.replace('Tỉnh', '').replace('Thành phố', '').trim()
                    }
                });
            }}
            style={Styles.location}>
            <Text style={Styles.locationText}>{item.name}</Text>
            {
                this.state.select_location.id === item.id?
                    <Icon style={Styles.locationIcon} name={'check-circle'}/>
                    :undefined
            }
        </TouchableOpacity>
    };

    _searchUpdated = (term) =>{
        this.setState({ searchTerm: slugify(term, {lower: true}) });
    };

    _filter = () => {
        const filtereds = this.state.locations.filter(createFilter(this.state.searchTerm, ['slug']));
        return filtereds;
    };

    _apply = () =>{
        let search_location = {
            id: this.state.select_location.id,
            name: this.state.select_location.name.replace('Tỉnh', '').replace('Thành phố', '').trim()
        };

        let search_type = this.props.search.search_type;
        if(this.state.type === 'service'){
            search_type = search_types.service;
        }
        else if (this.state.type === 'salon'){
            search_type = search_types.salon
        }
        let filters = this.props.search.filters;
        if(search_location.id !== this.props.search.search_location.id){
            filters = {
                ...filters,
                local: defaultFilters.local
            };
        }

        this.props.updateSearchState({
            search_type: search_type,
            filters: filters,
            search_location: search_location
        });

        this.props.updateSearchCacheState({
            locations:{
                ...this.props.search_cache.locations,
                lv2: []
            }
        });
        let fn = this.props.navigation.getParam('apply');
        fn();
        this.props.navigation.goBack();
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                headerTitle={'Trọng tâm tìm kiếm'}
                headerTitleStyle={{fontSize: 16, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>:
                        <View style={{flex: 1}}>
                            <Text style={Styles.blockTitle}>Tìm kiếm theo</Text>
                            <View style={Styles.typeSelect}>
                                <TouchableOpacity
                                    hitSlop={{top: 15, bottom: 15, left: 0, right: 0}}
                                    onPress={()=>{
                                        this.setState({
                                            type: 'service'
                                        });
                                    }}
                                    style={Styles.type}>
                                    <Icon style={Styles.typeIcon} name={'radio-button-'+(this.state.type==='service'?'checked':'unchecked')} />
                                    <Text style={Styles.typeText}>Tên dịch vụ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    hitSlop={{top: 15, bottom: 15, left: 0, right: 0}}
                                    onPress={()=>{
                                        this.setState({
                                            type: 'salon'
                                        });
                                    }}
                                    style={Styles.type}>
                                    <Icon style={Styles.typeIcon} name={'radio-button-'+(this.state.type==='salon'?'checked':'unchecked')} />
                                    <Text style={Styles.typeText}>Tên salon</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={Styles.blockTitle}>Tìm kiếm tại: <Text style={Styles.selectLocation}>{this.state.select_location.name}</Text></Text>
                            <View style={Styles.locations}>
                                <View style={Styles.locationSearch}>
                                    <SearchInput
                                        placeholder={'Lọc địa phương...'}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        returnKeyType={'done'}
                                        style={Styles.locationSearchField}
                                        onChangeText={(term) => { this._searchUpdated(term) }}

                                    />
                                </View>
                                <FlatList
                                    data={this._filter()}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                />
                            </View>
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
)(ChangeSearchTypeScreen);


const Styles = StyleSheet.create({
    pageWrapper: {

    },
    blockTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 16,
        padding: 15,
        backgroundColor: Colors.SILVER_LIGHT
    },
    typeSelect: {
        flexDirection: 'row',
        padding: 15
    },
    type: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30
    },
    typeIcon: {
        fontSize: 24,
        marginRight: 5,
        color: Colors.PRIMARY
    },
    typeText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14
    },
    selectLocation: {
        fontWeight: 'bold',
        color: Colors.PRIMARY
    },
    locations: {
      flex: 1
    },
    location: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14,
        flex: 1
    },
    locationIcon: {
        fontSize: 16,
        color: Colors.PRIMARY
    },
    locationSearch: {
        padding: 15,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    locationSearchField: {
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        height: 40,
        paddingLeft: 15
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
    }
});
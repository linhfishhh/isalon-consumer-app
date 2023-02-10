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

type Props = {};
export default class ChangeSearchFilterLocationScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            lv1: this.props.navigation.getParam('lv1'),
            select_location: this.props.navigation.getParam('lv2')?this.props.navigation.getParam('lv2'):{
                id: 0,
                name: 'Bất kỳ quận huyện nào',
                slug: 'bat-ky-quan-huyen-nao'
            },
            loading: false,
        };
    }
    _loadData = () => {
        this.setState({
            loading: true
        }, async ()=>{
            try{
                let rq = await Utils.getAxios().post('search/location-list/'+this.state.lv1.id);
                let ls = rq.data.map((item, index) => {
                    return {
                        ...item,
                        slug: slugify(item.name, {lower: true})
                    }
                });
                this.setState({
                    loading: false,
                    locations: [
                        {
                            id: 0,
                            name: 'Bất kỳ quận huyện nào',
                            slug: 'bat-ky-quan-huyen-nao'
                        },
                        ...ls
                    ],
                    searchTerm: ''
                });
            }
            catch (e) {
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
        let params = {
            lv2: this.state.select_location.id? this.state.select_location: null
        }
        ;
        let fn = this.props.navigation.getParam('apply');
        fn(params);
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
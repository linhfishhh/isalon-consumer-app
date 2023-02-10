import React, {Component} from 'react';
import {ScrollView, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import numeral from 'numeral';
import  SearchInput, { createFilter } from 'react-native-search-filter';
import slugify from 'slugify';

type Props = {};
const RadiusList = Utils.getRadiusList();
export default class ChangeSearchMapJumpScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            searchTerm: ''
        };
    }

    componentDidMount(){
    }

    _apply = async (id) =>{
        try{
            let rs = await Utils.getAxios().get(
                'https://maps.googleapis.com/maps/api/place/details/json?' +
                'key='+Utils.googleMapApiKey +
                '&placeid='+id +
                '&language=vi' +
                '&fields=geometry/location'
            );
            if(rs.data.status === 'OK'){
                let location = rs.data.result.geometry.location;
                let fn = this.props.navigation.getParam('apply');
                fn(location);
                this.props.navigation.goBack();
            }

        }
        catch (e) {
        }
    };

    _searchUpdated = (term) => {
        this.setState({ searchTerm: term }, ()=>{
            this._search();
        });
    };

    _search = async () => {
        try {
            let results = [];
            let rs = await Utils.getAxios().get(
                'https://maps.googleapis.com/maps/api/place/autocomplete/json?' +
                'key='+Utils.googleMapApiKey +
                '&language=vi' +
                //'&types=address' +
                '&components=country:vn'+
                '&input='+this.state.searchTerm
            );
            if(rs.data.status === "OK"){
                results = rs.data.predictions.map((item)=>{
                    return {
                        title: item.description.replace(/, Việt Nam/g, ''),
                        id: item.place_id
                    }
                });
            }
            this.setState({
                locations: results
            });
        }
        catch (e) {
        }
    };

    _keyExtractor = (item, index) => {
        return index+'';
    };

    _renderItem = ({item}) => {
        return <TouchableOpacity
            onPress={()=>{this._apply(item.id)}}
            style={Styles.searchResultItem}>
            <Text style={Styles.searchResultItemText}>{item.title}</Text>
        </TouchableOpacity>
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
                headerTitle={'DI CHUYỂN NHANH'}
                headerTitleStyle={{fontSize: 14, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
            >
                <View style={{flex: 1}}>
                            <View style={Styles.searchBox}>
                                <SearchInput
                                    placeholder={'Nhập địa điểm bạn muốn di chuyển đến'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    returnKeyType={'done'}
                                    style={Styles.locationSearchField}
                                    onChangeText={(term) => { this._searchUpdated(term) }}
                                    throttle={1000}
                                    autoFocus={true}
                                    //onSubmitEditing={this._search}
                                />
                            </View>
                            <FlatList
                                data={this.state.locations}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />

            </View>
            </PageContainer>
        )
    }
}


const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },

    locationSearchField: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        backgroundColor: Colors.LIGHT,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3
    },

    searchBox: {
        backgroundColor: Colors.PRIMARY,
        padding: 15
    },

    searchResultItem: {
        padding: 15,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },

    searchResultItemText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 12
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
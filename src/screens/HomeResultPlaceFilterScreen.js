import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WASearchFilter from "../components/WASearchFilter";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Path from "react-native-svg/elements/Path";
import Svg from "react-native-svg/elements/Svg";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Utils from '../configs';
import {DotIndicator} from 'react-native-indicators';

type Props = {};
export default class HomeResultPlaceFilterScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            searching: false,
            searched: false,
            results: [
            ]
        }
    }
    componentDidMount = () => {
    };
    _search = async () => {
        let results = [];
        if(this.state.input.trim().length === 0){
            return
        }
        this.setState({
           searching: true,
            searched: true
        });
        try {
            let rs = await Utils.getAxios().get(
                'https://maps.googleapis.com/maps/api/place/autocomplete/json?' +
                'key='+Utils.googleMapApiKey +
                '&language=vi' +
                '&types=geocode' +
                '&components=country:vn'+
                '&input='+this.state.input
            );
            if(rs.data.status === "OK"){
                results = rs.data.predictions.map((item)=>{
                    return {
                        title: item.description.replace(/, Việt Nam/g, ''),
                        id: item.place_id
                    }
                });
            }
        }
        catch (e) {
        }
        finally {
            this.setState({
                results: results,
                searching: false
            });
        }

    };
    render() {
        return (
                <PageContainer
                    darkTheme={false}
                    contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                    navigation={this.props.navigation}
                    backgroundColor={Colors.DARK}
                    navigationClose={true}
                    navigationAction={()=>{this.props.navigation.navigate('home_result')}}
                    navigationButtonStyle={Styles.closeButton}
                    headerTitle={'Đia điểm'}
                    headerTitleStyle={{color: Colors.LIGHT, fontSize: 20}}
                    layoutPadding={30}
                    // rightComponent={
                    //     <TouchableOpacity
                    //         hitSlop={touchSize}
                    //         onPress={()=>{
                    //             let apply_fn = this.props.navigation.getParam('onApply');
                    //             let query = {};
                    //             apply_fn(query);
                    //         }}
                    //         style={Styles.save}>
                    //         <Text style={Styles.saveText}>Áp dụng</Text>
                    //     </TouchableOpacity>
                    // }
                >
                    <View style={Styles.searchZone}>
                        <View style={Styles.searchBoxWrapper}>
                            <Svg style={Styles.searchBoxIcon} width={15} height={20}>
                                <Path d="M7.25,0A7.2,7.2,0,0,0,0,7.21,8.58,8.58,0,0,0,1.06,11a80.31,80.31,0,0,0,6.19,9,76.61,76.61,0,0,0,6.28-9,8.54,8.54,0,0,0,1-3.84A7.26,7.26,0,0,0,7.25,0Zm0,9.77a2.56,2.56,0,1,1,2.6-2.56A2.58,2.58,0,0,1,7.24,9.77Z" fill="#ff5c39"/>
                            </Svg>
                            <TextInput
                                ref={ref=>this.inputBox = ref}
                                style={Styles.searchBox}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                spellCheck={false}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                onFocus={()=>{this.setState({editing: true})}}
                                onBlur={()=>{this.setState({editing: false})}}
                                onChangeText={(text) => this.setState({input: text})}
                                onSubmitEditing={this._search}
                                editable={!this.state.searching}
                                placeholder={'Quận, huyện, đường, phố...'}
                            />
                            <TouchableOpacity
                                onPress={()=>{
                                    this.inputBox.blur();
                                    this._search();
                                }}
                                hitSlop={touchSize}
                                style={Styles.searchBoxIconButton}>
                                <Icon
                                    style={Styles.searchBoxIconS} name={'search'}/>
                            </TouchableOpacity>
                        </View>
                        {
                            !this.state.editing?
                                !this.state.searching?
                                    <FlatList
                                        style={[Styles.results, this.state.editing && {marginBottom: 0}]}
                                        data={this.state.results}
                                        renderItem={this._renderItem}
                                        keyExtractor={this._keyExtractor}
                                        ListEmptyComponent={this._renderEmpty}
                                    />
                                    :
                                    <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                                :undefined
                        }
                    </View>
                    {
                        !this.state.editing && !this.state.searching?
                            <WASearchFilter
                                addressText={
                                    this.props.navigation.getParam('query') && this.props.navigation.getParam('query').address_text?
                                        this.props.navigation.getParam('query').address_text:
                                        'Địa điểm'
                                }
                                query={this.props.navigation.getParam('query')} onApply={this.props.navigation.getParam('onApply')}
                                styleRight={false}  navigation={this.props.navigation} />
                            :undefined
                    }

                </PageContainer>
        )
    }

    _renderEmpty = () => {
        return (
            this.state.searched?
                <View style={Styles.empty}>
                    <Icon style={Styles.emptyIcon} name={'sentiment-very-dissatisfied'} />
                    <Text style={Styles.emptyText}>Không có địa điểm nào tương ứng</Text>
                </View>
                :false
        );
    };

    _keyExtractor = (item, index) => {
        return 'place-'+index;
    };

    _getDetail = async (id, text) => {
        this.setState({
            searching: true
        });
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
                let query = this.props.navigation.getParam('query');
                query.address_lat = location.lat;
                query.address_lng = location.lng;
                query.address_text = text;
                if(!query.distance){
                    query.distance = 50
                }
                let apply_fn = this.props.navigation.getParam('onApply');
                apply_fn(query);
            }

        }
        catch (e) {
        }
        finally {
            this.setState({
                searching: false
            });
        }
    };
    _renderItem = ({item}) => {
        return(
            <TouchableOpacity
                onPress={()=>{
                    this._getDetail(item.id, item.title);
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
// export default connect(
//     state => {
//         return {
//             filter: state.filter
//         }
//     },
//     {
//         cacheCats,
//         updateFilterSettings
//     }
// )(
//     HomeResultPlaceFilterScreen
// );
const touchSize = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};

const Styles = StyleSheet.create({

    empty: {
        margin: 30,
        alignItems: 'center'
    },
    emptyIcon: {
        fontSize: 50,
        color: Colors.LIGHT,
        marginBottom: 15
    },
    emptyText: {
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
        color:  Colors.LIGHT,
        flex: 1
    },
    searchZone: {
        flex: 1,
    },
    searchBoxIcon: {
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 1
    },
    searchBoxIconButton: {
      position: 'absolute',
        right: 20,
        top: 10,
        zIndex: 2
    },
    searchBoxIconS: {
        fontSize: 30,
        color: Colors.TEXT_DARK
    },
    searchBoxWrapper: {
      position: 'relative',
        marginTop: 30
    },
    searchBox: {
      backgroundColor: 'white',
        height: 50,
        width: '100%',
        borderRadius: 25,
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        textAlign: 'center'
    },
    results: {
      flex: 1,
      marginBottom: 100,
        marginTop: 30,
    },
    cat: {
        paddingTop: 10,
        paddingBottom: 10
    },
    catText: {
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT
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
        paddingLeft: 40,
        paddingRight: 40,
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
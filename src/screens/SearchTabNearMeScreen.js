import React, {Component, PureComponent} from 'react';
import {ScrollView, Dimensions, Alert,Linking, AppState, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing, RefreshControl, Platform} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import numeral from 'numeral';
import  SearchInput, { createFilter } from 'react-native-search-filter';
import slugify from 'slugify';
import MapView, {Circle, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import {NavigationEvents} from "react-navigation";
import {getUserLocation, updateSearchState} from "../redux/new_search/actions";
import {connect} from "react-redux";
import {updateSearchTabNearMeState, getResultSearchTabNearMe} from "../redux/search_tab_near_me/actions";
import WASearchTabResult, {Salon} from "../components/WASearchTabResult";
import OpenAppSettings from 'react-native-app-settings'
import {PulseIndicator} from "react-native-indicators";

type Props = {};
class SearchTabNearMeScreen extends PureComponent<Props> {
    constructor(props){
        super(props);
        this.state = {
            appState: AppState.currentState,
            appStateWaitToCheck: false,
            loading: false,
            userLocationInit : false,
            userLocation: {
                latitude: this.props.search.user_location.lat,
                longitude: this.props.search.user_location.lng,
            },
            searchRadius: 0,
            currentLocation: {
                latitude: this.props.search.user_location.lat,
                longitude: this.props.search.user_location.lng,
            },
            waitForRefresh: false,
            selectedLocation: 0,
            salons: [

            ],
            selectedSalon: {
                id: 0
            },
            showRadiusSelector: false,
            showMarker: true
        };
    }

    _getSearchRadiusValue = () => {
            let SearchRadiusList = this.props.tab.searchRadiusList;
            return SearchRadiusList[this.props.tab.searchRadiusIndex];
    };

    _loadSalons = () => {
        this.setState(
          {
              showRadiusSelector: false
          },
          ()=>{
              this.props.updateSearchTabNearMeState({
                  loaded: false
              });
              this.props.getResultSearchTabNearMe(
              );
          }
        );
    };

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.setState({
                appStateWaitToCheck: false
            }, ()=>{
                this.props.getUserLocation();
            })
        }
        this.setState({appState: nextAppState});
    };

    componentDidMount(){
        AppState.addEventListener('change', this._handleAppStateChange);
        //this._loadSalons();
        this.props.updateSearchTabNearMeState({
            searchApplyCallBack: this._onSearchApply
        });
    }

    deg2rad = (angle) => {
        return (angle /180.0)*Math.PI // (angle / 180) * Math.PI;
    };

    rad2deg = (angle) => {
        return angle /Math.PI*180.0 // angle / Math.PI * 180
    };

    getRegion = (lat, lng) => {
        let radiusInRad = (((this._getSearchRadiusValue() + (this._getSearchRadiusValue()/20))*2.0/1000.0) / 6378.1);
        let longitudeDelta = this.rad2deg(radiusInRad / Math.cos(this.deg2rad(lat)));
        let latitudeDelta = 1.0 * this.rad2deg(radiusInRad);
        return {
            latitude: lat,
            longitude: lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
        };
    };

    _onUserLocationChange = (event) => {

        let location = event.nativeEvent.coordinate;
        if(!this.state.userLocationInit){
            this.setState({
                userLocationInit: true,
                currentLocation: this.getRegion(location.latitude, location.longitude),
                userLocation: location,
            }, () => {
                this.props.updateSearchState({
                    user_location: {
                        ...this.props.search.user_location,
                        lat: location.latitude,
                        lng: location.longitude
                    }
                });
                this.map.animateCamera(location, 1);
            });
        }
        else{
            this.setState({
                userLocation: location,
            });
        }
    };

    _onRegionChange = (region) => {
        this.props.updateSearchTabNearMeState({
            currentLocation: {
                address_lat: region.latitude,
                address_lng: region.longitude
            }
        });
        this.setState({
            showMarker: false
        }, ()=>{
            this.setState({
                showMarker: true
            }, ()=>{
                this.salon_info.hideMe();
                this.setState({
                    selectedSalon: {
                        id: 0
                    },
                    currentLocation: this.getRegion(region.latitude, region.longitude),
                }, ()=>{
                    this._loadSalons();
                });
            });
        });
    };

    _goToMyLocation = () => {
        if(!this.state.userLocation){
            return false;
        }
        let location = this.state.userLocation;
        this.setState({
            currentLocation: this.getRegion(location.latitude, location.longitude),
        }, () => {
            this.map.animateToRegion(this.state.currentLocation, 1);
        });
    };


    _refreshRegion = () => {
        this.map.animateToRegion(this.getRegion(this.state.currentLocation.latitude, this.state.currentLocation.longitude));
    };

    _jumpToLocation = (location) => {
        this.setState({
            currentLocation: {
                ...this.state.currentLocation,
                latitude: location.lat,
                longitude: location.lng
            }
        });
    };

    _jumpScreen = () => {
        this.setState({
            waitForRefresh: true
        }, ()=>{
            this.props.route.navigation.navigate('map_location_picker', {
                apply: this._jumpToLocation
            });
        });
    };

    _showMapResult = ()=>{
        if(!this.map_result_view){
            return;
        }
        let ref = this.map_result_view.getWrappedInstance();
       ref.showMe();
    };

    _hideMapResult = (after = ()=>{})=>{
        if(!this.map_result_view){
            return;
        }
        let ref = this.map_result_view.getWrappedInstance();
        ref.hideMe(after);
    };

    render() {
        if(!this.props.tab.init){
            return <View/>
        }
        return (

            (!this.props.search.user_location.lat && !this.props.search.user_location.lng)?
                    <View style={[Styles.page, Styles.pageNoUserLocation]}>
                        <Icon style={Styles.noUserLocationIcon} name={'location-off'} />
                        <Text style={Styles.noUserLocationText}>
                            Ứng dụng tạm thời không thể xác định được vị trí của bạn
                        </Text>
                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    appStateWaitToCheck: true
                                }, async ()=>{
                                    if(Platform.OS === 'android'){
                                        // await this.props.getUserLocation();
                                        await OpenAppSettings.open()
                                    }
                                    else{
                                        Linking.openURL('app-settings:');
                                    }

                                })
                            }}
                            style={Styles.noUserLocationLinkButton}>
                            <Text style={Styles.noUserLocationLink}>Kiểm tra chức năng định vị</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={Styles.page}>
                        <NavigationEvents
                            onWillBlur={()=>{}}
                            onDidFocus={()=>{
                                if(this.state.waitForRefresh){
                                    this.setState({
                                        waitForRefresh:false
                                    }, ()=>{
                                        this._refreshRegion();
                                    })
                                }
                            }}
                        />
                        <View style={[Styles.mapToolLeft, {zIndex: 9999}]}>
                            <TouchableOpacity
                                onPress={this._showMapResult}
                                style={[Styles.mapToolButton]}>
                                <Icon style={Styles.mapToolButtonIcon} name={'view-list'} />
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.mapToolRight}>
                            <TouchableOpacity
                                onPress={this._goToMyLocation}
                                style={Styles.mapToolButton}>
                                <Icon style={Styles.mapToolButtonIcon} name={'near-me'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this._jumpScreen}
                                style={Styles.mapToolButton}>
                                <Icon style={Styles.mapToolButtonIcon} name={'search'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={this._showSearchRadiusSelector}
                              style={Styles.mapToolButton}>
                                <Text style={Styles.mapToolButtonSmText}>{numeral(this._getSearchRadiusValue()/1000.0).format('0.0')}{'\n'}Km</Text>
                            </TouchableOpacity>
                        </View>
                        <MapView
                            moveOnMarkerPress={false}
                            showsMyLocationButton={false}
                            showsUserLocation={true}
                            showsCompass={false}
                            loadingEnabled={true}
                            rotateEnabled={false}
                            ref={map => {
                                this.map = map
                            }}
                            onUserLocationChange={this._onUserLocationChange}
                            onRegionChangeComplete={this._onRegionChange}
                            style={Styles.map}
                            initialRegion={
                                this.getRegion(this.state.currentLocation.latitude, this.state.currentLocation.longitude)
                            }
                            provider={PROVIDER_GOOGLE}

                        >
                            {
                                !this.state.waitForRefresh?
                                    <Circle
                                        ref={ref => this.circle = ref}
                                        onLayout={() => this.circle.setNativeProps({
                                            strokeColor: Colors.PRIMARY
                                          })}
                                        center={{
                                            latitude: this.state.currentLocation.latitude,
                                            longitude: this.state.currentLocation.longitude,
                                        }}
                                        radius={this._getSearchRadiusValue()}
                                        strokeWidth={1}
                                        strokeColor={Colors.PRIMARY}
                                    />
                                    :undefined
                            }
                            {
                                this.state.showMarker?
                                this.props.tab.result.items.map((salon, salon_index)=>{
                                    let active = salon.id === this.state.selectedSalon.id;
                                    return <SalonMarker
                                      marker_color_1_normal={this.props.tab.marker_color_1_normal}
                                      marker_color_2_normal={this.props.tab.marker_color_2_normal}
                                      marker_color_1_active={this.props.tab.marker_color_1_active}
                                      marker_color_2_active={this.props.tab.marker_color_2_active}
                                      onSelect={this._onMarkerSelect} active={active} salon={salon} key={salon.id}/>
                                })
                                  :undefined
                            }
                        </MapView>
                        <SalonInfo navigation={this.props.route.navigation} data={this.state.selectedSalon} ref={salon_info=>this.salon_info=salon_info}/>
                        {
                            this.state.showRadiusSelector?
                              <View style={Styles.radiusSelector}>
                                  <View style={Styles.radiusSelectorInner}>
                                      <Text style={Styles.radiusSelectorTitle}>Chọn bán kính tìm kiếm</Text>
                                      {
                                          this.props.tab.searchRadiusList.map((radius, rindex)=>{
                                              return (
                                                <TouchableOpacity
                                                  onPress={()=>{this._setSearchRadiusIndex(rindex)}}
                                                  hitSlop={{top: 15, bottom: 15, left: 0, right: 0}}
                                                  style={Styles.radiusSelectorItem} key={rindex}>
                                                    <Icon style={Styles.radiusSelectorItemIcon} name={'radio-button-'+(rindex===this.props.tab.searchRadiusIndex?'checked':'unchecked')}/>
                                                    <Text style={Styles.radiusSelectorItemText}>{radius} mét</Text>
                                                </TouchableOpacity>
                                              );
                                          })
                                      }
                                  </View>
                              </View>
                              :undefined
                        }
                        {
                            this.props.tab.showRadiusQuestion?
                              <View style={Styles.radiusSelector}>
                                  <View style={Styles.radiusQuestion}>
                                      <Text style={Styles.radiusQuestionText}>Không tìm thấy salon tương ứng trong bán kính tìm kiếm hiện tại. Bạn có muốn tăng bán kinh tìm kiếm lên hay không?</Text>
                                      <View style={Styles.radiusQuestionTextButtons}>
                                          <TouchableOpacity
                                            onPress={this._hideRadiusQuestion}
                                            style={[Styles.radiusQuestionTextButton, {backgroundColor: Colors.SILVER_DARK}]}>
                                              <Text style={Styles.radiusQuestionTextButtonText}>Bỏ qua</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            onPress={this._increaseRadius}
                                            style={Styles.radiusQuestionTextButton}>
                                              <Text style={Styles.radiusQuestionTextButtonText}>Đồng ý</Text>
                                          </TouchableOpacity>
                                      </View>
                                  </View>
                              </View>:
                              undefined
                        }
                        <MapResultView
                          increaseRadius={this._increaseRadiusFromResult}
                          navigation={this.props.route.navigation} ref={map_result_view=>this.map_result_view=map_result_view}/>
                        <View pointerEvents="none" style={Styles.searchInProcess}>

                            {
                                  <PulseIndicator pointerEvents="none" size={30} color={Colors.PRIMARY}/>
                            }
                        </View>
                    </View>

        )
    }

    _increaseRadius = async () => {
        let index = this.props.tab.searchRadiusIndex + 1;
        await this.props.updateSearchTabNearMeState({
            showRadiusQuestion: false,
            searchRadiusIndex: index
        });
        this._refreshRegion();
    };

    _increaseRadiusFromResult = () => {
        this._hideMapResult(this._increaseRadius);
    };

    _hideRadiusQuestion = () =>{
        this.props.updateSearchTabNearMeState({
            showRadiusQuestion: false
        });
    };

    _showSearchRadiusSelector = ()=>{
        this.setState({
            showRadiusSelector: true
        });
    };

    _setSearchRadiusIndex = (index)=>{
        this.props.updateSearchTabNearMeState({
            searchRadiusIndex: index
        });
        this.setState({
            showRadiusSelector: false
        }, ()=>{
            this._refreshRegion()
        });
    };

    _onSearchApply = ()=>{
        this.setState({
            selectedSalon: {
                id: 0
            },
        }, ()=>{
            if(!this.salon_info){
                return;
            }
            this._hideMapResult();
            this.salon_info.hideMe();
        });
    };

    _onMarkerSelect = (salon) => {
        this.setState({
            selectedSalon: salon,
            showMarker: false
        }, ()=>{
            this.setState({
                showMarker: true
            }, ()=>{
                this.salon_info.showMe();
            });
        });
    };
}

class SalonInfo extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            top: new Animated.Value(0),
            height: 0,
        }
    }

    hideMe = ()=>{
        if(this.state.top._value === this.state.height){

        }
        else{
            Animated.timing(
                this.state.top, {
                    toValue: this.state.height,
                    easing: Easing.linear,
                    duration: 300
                }
            ).start();
        }
    };

    showMe = (after=()=>{})=>{
        if(this.state.top._value === 0){
            //this.hideMe();
        }
        else{
            Animated.timing(
                this.state.top, {
                    toValue: 0,
                    easing: Easing.linear,
                    duration: 200
                }
            ).start(after);
        }
    };

    _onLayout= event => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height: height, top:  new Animated.Value(height)});
    };

    render(){
        return <Animated.View
            onLayout={this._onLayout}
            style={[Styles.selectedSalon, {transform: [{translateY: this.state.top}]}]}>
            <Salon navigation={this.props.navigation} data={this.props.data}/>
        </Animated.View>
    }
}

class SalonMarker extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    _onPress = () =>{
        this.props.onSelect(this.props.salon);
    };

    render(){
        let salon = this.props.salon;
        return <Marker
            onPress={this._onPress}
            identifier={salon.id+'-'}
            tracksViewChanges={false}
            anchor={
                {
                    x: 0.5,
                    y: 0.5
                }
            }
            style={Styles.mapMarker}
            coordinate={salon.location}>
            <View style={{backgroundColor: this.props.active?this.props.marker_color_1_active:this.props.marker_color_1_normal, width: 30, height: 30, borderRadius: 15, borderColor: Colors.LIGHT, borderWidth: 1}}>
                <View style={{backgroundColor: this.props.active?this.props.marker_color_2_active:this.props.marker_color_2_normal, width: 10, height: 10, borderRadius: 5, marginTop: 9, marginLeft: 9}}/>
            </View>
        </Marker>
    }
}

class IMapResultView extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            top: new Animated.Value(0),
            height: 0,
            refreshing: false,
            offsetFrom: 0,
        }
    }

    showMe = ()=>{
        if(this.state.top._value === 0){
            this.hideMe();
        }
        else{
            Animated.timing(
                this.state.top, {
                    toValue: 0,
                    easing: Easing.linear,
                    duration: 200
                }
            ).start();
        }
    };

    hideMe = (after = ()=>{})=>{
        Animated.timing(
            this.state.top, {
                toValue: this.state.height,
                easing: Easing.linear,
                duration: 200
            }
        ).start(after);
    };

    _onLayout= event => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height: height, top:  new Animated.Value(height)});
    };

    render(){
        let showExtendRadius = this.props.tab.searchRadiusIndex < this.props.tab.searchRadiusList.length-1;
        return (
            <Animated.View
                onLayout={this._onLayout}
                style={[Styles.mapResultView, {transform: [{translateY: this.state.top}]}]}>
                    <WASearchTabResult
                      mutiple_page={false} navigation={this.props.navigation} data={this.props.tab}
                      forMap={true}
                      showExtendRadiusAction={showExtendRadius}
                      extendRadiusAction={this.props.increaseRadius}
                    />
            </Animated.View>
        );
    }
}

const MapResultView = connect(
    state => {
        return {
            search: state.new_search,
            tab: state.new_search_tab_near_me
        }
    },
    {
        //updateSearchState,
        updateSearchTabNearMeState
    }, null, { withRef: true }
)(IMapResultView);

export default connect(
    state => {
        return {
            search: state.new_search,
            tab: state.new_search_tab_near_me
        }
    },
    {
        updateSearchState,
        updateSearchTabNearMeState,
        getResultSearchTabNearMe,
        getUserLocation
    }
)(
    SearchTabNearMeScreen
);

const Styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.LIGHT
    },
    searchInProcess: {
        position: 'absolute',
        zIndex: 1,
        left: '50%',
        marginLeft: -15,
        top: '50%',
        marginTop: -15,
        height: 30,
        width: 30,
        //backgroundColor: Colors.TEXT_LINK,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapMarker: {

    },
    searchCenter: {
        color: Colors.PRIMARY,
        fontSize: 30
    },
    pageNoUserLocation: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 50
    },
    noUserLocationIcon: {
        fontSize: 40,
        color: Colors.SILVER,
        marginBottom: 15
    },
    noUserLocationText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.SILVER_DARK,
        textAlign: 'center',
        marginBottom: 15,
        width: 250
    },
    noUserLocationLinkButton: {
        backgroundColor: Colors.PRIMARY,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3
    },
    noUserLocationLink: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
    },
    map: {
        flex: 1
    },
    mapResultView: {
        position: 'absolute',
        bottom:0,
        top: 0,
        left:0,
        right:0,
        zIndex:2,
        backgroundColor: Colors.LIGHT,

    },

    selectedSalon: {
        position: 'absolute',
        bottom:0,
        left:0,
        right:0,
        zIndex:1,
        height: 110,
        backgroundColor: Colors.LIGHT,
    },

    buttons: {
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        backgroundColor: Colors.LIGHT
    },
    button: {
        height: 24,
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: Colors.DARK,
        borderRadius: 2,
        marginRight: 2,
        marginLeft: 2,
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.LIGHT
    },
    radiusModal: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 9999,
    },
    mapToolRight: {
        position: 'absolute',
        right: 0,
        zIndex: 1,
        flexDirection: 'row',
    },
    mapToolLeft: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
    },
    mapToolButton: {
        height: 30,
        width: 30,
        margin: 5,
        backgroundColor: Colors.PRIMARY,
        borderColor: Colors.LIGHT,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapToolButtonSmText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 8,
        color: Colors.LIGHT,
        textAlign: 'center'
    },
    mapToolButtonIcon: {
        color: Colors.LIGHT,
        fontSize: 14
    },
    backToMap: {
        position: 'absolute',
        backgroundColor: Colors.PRIMARY,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        top: 5,
        right: 5
    },
    backToMapText:{
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.LIGHT
    },
    radiusSelector: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    radiusSelectorInner: {
        width: 200,
        minHeight: 100,
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        padding: 20
    },
    radiusSelectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5
    },
    radiusSelectorItemIcon: {
        fontSize: 26,
        marginRight: 10,
        color: Colors.PRIMARY
    },
    radiusSelectorItemText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK
    },
    radiusSelectorTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.TEXT_LINK,
        marginBottom: 5
    },
    radiusQuestion: {
        width: '80%',
        minHeight: 100,
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        padding: 20
    },
    radiusQuestionText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.TEXT_DARK,
        marginBottom: 5
    },
    radiusQuestionTextButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    radiusQuestionTextButton:{
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY,
        height: 30,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3
    },
    radiusQuestionTextButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.LIGHT,
    }
});

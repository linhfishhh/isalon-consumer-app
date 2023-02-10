import React, {PureComponent, Component} from 'react';
import {PermissionsAndroid, Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import Colors from "../styles/Colors";
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import Icon from 'react-native-vector-icons/MaterialIcons'
import GlobalStyles from "../styles/GlobalStyles";
import WAStars from "../components/WAStars";
import ImageSources from "../styles/ImageSources";
import SVG from 'react-native-svg';
import {Image as SVGI, Svg, Path} from 'react-native-svg';
import { isEqual } from 'lodash'
import {connect} from 'react-redux';
import {updateInfo as updateHomeInfo} from "../redux/home/actions";
import {getSalonNearBy} from "../redux/search/actions";
import {updateInfo as updateMapInfo} from "../redux/map/actions";
import {BallIndicator} from 'react-native-indicators';
import numeral from 'numeral';
import Utils from "../configs";

class MemberSearchScreen extends PureComponent {
    static defaultProps = {
    };
    constructor(props){
        super(props);
        this.state = {
            selected: undefined,
            selectedIndex: undefined,
            updateMaker: false,
            searchRadius: 250,
            defaultLocation: {
                latitude: 21.028511,
                longitude: 105.804817,
            },
            userLocationInit : false,
            userLocation: undefined,
            currentLocation: {
                latitude: 21.028511,
                longitude: 105.804817,
            },
            foundSalons: [],
            init: false,
            locationInit: false
        }
    }
    _select = (item, index) => {
        let items = this.state.foundSalons;
        this.setState({
            selected: item,
            selectedIndex: item.id,
            foundSalons: [],
        }, ()=>{
            this.setState({
                foundSalons: items
            });
        })
    };
    _goToSalon = () => {
      this.props.route.navigation.navigate('home_salon')
    };

    componentDidUpdate(){
    }

    loadMapSetting = async ()=>{
        // try {
        //     let rq = await Utils.getAxios().post('search/map-radius');
        //     this.setState({
        //         searchRadius: rq.data,
        //         init: true
        //     });
        // }
        // catch (e) {
            this.setState({
                searchRadius: 250,
                init: true
            });
        // }
    };

    componentDidMount(){
        this.loadMapSetting();
    }

    deg2rad = (angle) => {
        return (angle /180.0)*Math.PI // (angle / 180) * Math.PI;
    };

    rad2deg = (angle) => {
        return angle /Math.PI*180.0 // angle / Math.PI * 180
    };

    getRegion = (lat, lng) => {
        let radiusInRad = (((this.state.searchRadius + (this.state.searchRadius/20))*2.0/1000.0) / 6378.1);
        let longitudeDelta = this.rad2deg(radiusInRad / Math.cos(this.deg2rad(lat)));
        let latitudeDelta = 1.0 * this.rad2deg(radiusInRad);
        return {
            latitude: lat,
            longitude: lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
        };
    };

    _loadSalons = () => {
        if(this.state.loading){
            return;
        }
        if(this.props.home.tabIndex !== 0){
            return;
        }
        try {
            this.setState(
                {
                    loading: true,
                    foundSalons: []
                }
                ,
                async ()=>{
                    let from_lat = this.state.currentLocation.latitude;
                    let from_lng = this.state.currentLocation.longitude;
                    let rq = await Utils.getAxios().post('search/salon-near-me', {
                        from_lat: from_lat,
                        from_lng: from_lng,
                        user_from_lat: this.state.userLocation?this.state.userLocation.latitude: from_lat,
                        user_from_lng: this.state.userLocation?this.state.userLocation.longitude: from_lng,
                        version: 1,
                    });
                    if(this.state.searchRadius !== rq.data.radius){
                        this.setState({
                            foundSalons: rq.data.salons,
                            searchRadius: rq.data.radius,
                            loading: false
                        }, ()=>{
                            let points = this.get4PointsAroundCircumference(
                                this.state.currentLocation.latitude,
                                this.state.currentLocation.longitude,
                                (rq.data.radius+(rq.data.radius/20.0))/1000
                            );
                            if(this.props.home.tabIndex !== 0){
                                return;
                            }
                            this.map.fitToCoordinates(points, {
                                animated: true
                            })
                        });
                    }
                    else{
                        this.setState({
                            foundSalons: rq.data.salons,
                            loading: false
                        });
                    }
                }
            );
        }
        catch (e) {
        }
    };

    get4PointsAroundCircumference = (latitude, longitude, radius) => {
        const earthRadius = 6378.1;
        const lat0 = latitude + (-radius / earthRadius) * (180 / Math.PI);
        const lat1 = latitude + (radius / earthRadius) * (180 / Math.PI);
        const lng0 = longitude + (-radius / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
        const lng1 = longitude + (radius / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);

        return [{
            latitude: lat0,
            longitude: longitude
        }, //bottom
            {
                latitude: latitude,
                longitude: lng0
            }, //left
            {
                latitude: lat1,
                longitude: longitude
            }, //top
            {
                latitude: latitude,
                longitude: lng1
            } //right
        ]
    };


    _onRegionChange = (region) => {
        if(this.props.home.tabIndex !== 0){
            return;
        }
        if(this.props.home.mapSaved){
            this.props.updateHomeInfo({
                mapSaved: false
            });
            return;
        }
        this.setState({
            currentLocation: this.getRegion(region.latitude, region.longitude),
            selected: undefined,
            selectedIndex: undefined,
        }, ()=>{
           this._loadSalons();
        });
    };

    _goToUserLocation = () => {
        if(!this.state.userLocation){
            return false;
        }
        this.setState({
            currentLocation: {
                ...this.state.currentLocation,
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude,
            }
        }, () => {
            this.map.animateCamera({
                ...this.state.currentLocation,
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude,
            }, 1);
        });
    };

    _onUserLocationChange = (event) => {
        if(this.props.home.tabIndex !== 0){
            return;
        }
        let location = event.nativeEvent.coordinate;
        this.props.updateMapInfo({
            hasPermission: true,
            data: {
                latitude: location.latitude,
                longitude: location.longitude,
            }
        });
        if(!this.state.userLocationInit){
            this.setState({
                userLocationInit: true,
                currentLocation: this.getRegion(location.latitude, location.longitude),
                userLocation: location,
            }, () => {
                this.map.animateCamera(location, 1);
                this._loadSalons();
            });
        }
        else{
            this.setState({
                userLocation: location,
            });
        }
    };

    render() {
        if(this.props.home.tabIndex !== 0 || !this.props.home.homeActive){
            return <View/>;
        }
        return (
            <View style={Styles.container}>
                {
                         <View style={{flex:1}}>
                             {
                                 (this.props.home.tabIndex === 0 &&  this.state.init)?
                                     <MapView
                                         moveOnMarkerPress={false}
                                         showsMyLocationButton={false}
                                         showsUserLocation={true}
                                         showsCompass={false}
                                         loadingEnabled={true}
                                         ref={map => {
                                             this.map = map
                                         }}
                                         onUserLocationChange={this._onUserLocationChange}
                                         onRegionChangeComplete={this._onRegionChange}
                                         initialRegion={
                                             this.getRegion(this.state.currentLocation.latitude, this.state.currentLocation.longitude)
                                         }
                                         style={Styles.map}
                                         provider={PROVIDER_GOOGLE}

                                     >
                                         {
                                             this.state.foundSalons?
                                                 this.state.foundSalons.map((item, index) => {
                                                     return (
                                                         <SalonMarker
                                                             // tracksViewChanges={false}
                                                             key={'salon'+item.id}
                                                             onPress={this._select}
                                                             hack={this.state.selectedIndex}
                                                             data={item}
                                                             active={this.state.selectedIndex === item.id}
                                                             zIndex={index}
                                                         />
                                                     )
                                                 }):
                                                 undefined
                                         }
                                         <Marker
                                             tracksViewChanges={false}
                                             coordinate={
                                             this.state.currentLocation
                                         }/>
                                         <Circle
                                             center={{
                                                 latitude: this.state.currentLocation.latitude,
                                                 longitude: this.state.currentLocation.longitude,
                                             }}
                                             radius={this.state.searchRadius}
                                             strokeWidth={1}
                                             strokeColor={Colors.PRIMARY}
                                         />
                                     </MapView>
                                     :<View style={{flex: 1, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center'}}>
                                         <Text style={{color: Colors.PRIMARY}}>Đang xử lý bản đồ...</Text>
                                     </View>
                             }
                             <TouchableOpacity
                                 activeOpacity={1}
                                 style={Styles.form}
                                 onPress={()=>{
                                     this.props.route.navigation.navigate('home_search_detail');
                                 }}
                             >
                                 <Icon style={Styles.formIcon} name={'search'}/>
                                 <Text style={Styles.formText} >Tìm theo tên salon, dịch vụ cần tìm...</Text>
                             </TouchableOpacity>
                             {
                                 this.state.selected?
                                     <View style={Styles.salonInfo}>
                                         <TouchableOpacity
                                             onPress={()=>{
                                                 this.props.route.navigation.navigate('home_salon', {
                                                     id: this.state.selected.id
                                                 })
                                             }}
                                         >
                                             <ImageBackground source={{uri: this.state.selected.image}} style={Styles.salonInfoCover}>

                                             </ImageBackground>
                                         </TouchableOpacity>
                                         <View style={Styles.salonInfoBody}>
                                             <TouchableOpacity
                                                 onPress={()=>{
                                                     this.props.route.navigation.navigate('home_salon', {
                                                         id: this.state.selected.id
                                                     })
                                                 }}
                                             >
                                                 <Text style={Styles.salonInfoName}>
                                                     {this.state.selected.name}
                                                 </Text>
                                             </TouchableOpacity>
                                             <View style={Styles.salonInfoCol}>
                                                 <View style={Styles.salonInfoAdressWrapper}>
                                                     <Text numberOfLines={1} style={Styles.salonInfoAdress}>
                                                         {this.state.selected.address}
                                                     </Text>
                                                 </View>
                                                 <Icon style={Styles.salonInfoDistanceIcon} name={'place'} />
                                                 <Text style={Styles.salonInfoDistance}>{this.state.selected.distance}Km</Text>
                                             </View>
                                             <View style={Styles.salonInfoCol}>
                                                 <Text style={Styles.salonInfoRatingNumber}>{numeral(this.state.selected.rating).format('0,000.0')}</Text>
                                                 <WAStars style={Styles.salonInfoRating} starStyle={Styles.salonInfoStarStyle} rating={this.state.selected.rating}
                                                          starInfo={'( '+this.state.selected.rating_count+' )'}
                                                 />
                                                 <Text style={Styles.salonInfoPrice}>Từ {this.state.selected.price_from}</Text>
                                             </View>
                                         </View>
                                     </View>
                                     :undefined
                             }
                             {
                                 !this.state.selected?
                                     <View style={Styles.mapTools}>
                                         {
                                             this.state.userLocation?
                                                 <TouchableOpacity
                                                     onPress={this._goToUserLocation}
                                                     style={Styles.mapTool}
                                                 >
                                                     <Icon
                                                         style={Styles.mapToolText}
                                                         name={'near-me'} />
                                                 </TouchableOpacity>
                                                 :undefined
                                         }
                                     </View>
                                     :undefined
                             }
                         </View>
                }
            </View>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            home: state.home
        }
    },
    {
        updateMapInfo,
        updateHomeInfo
    }
)(MemberSearchScreen);

class SalonMarker extends Component{
    static defaultProps = {
        tracksViewChanges: false,
    };
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Marker
                zIndex={this.props.active?999999:this.props.zIndex}
                anchor={
                    {
                        x: 0.5,
                        y: 0.5
                    }
                }
                tracksViewChanges={false}
                onPress={()=>{
                    this.props.onPress(this.props.data)
                }}
                style={Styles.markerWrapper}
                coordinate={
                    {
                        latitude:  this.props.data.lat,
                        longitude: this.props.data.lng
                    }
                }>
                <View style={{backgroundColor: this.props.active?this.props.data.marker_color_sl_1:this.props.data.marker_color_1, width: 30, height: 30, borderRadius: 15, borderColor: Colors.LIGHT, borderWidth: 1}}>
                    <View style={{backgroundColor: this.props.active?this.props.data.marker_color_sl_2:this.props.data.marker_color_2, width: 10, height: 10, borderRadius: 5, marginTop: 9, marginLeft: 9}}/>
                </View>


            </Marker>
        )
    }
}

const Styles = StyleSheet.create({
    noMap: {
        flex: 1,
        backgroundColor: Colors.SILVER_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50
    },
    noMapIcon: {
      fontSize: 50,
        marginBottom: 15,
        color: Colors.PRIMARY,
    },
    noMapText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 15
    },
    container: {
        backgroundColor: Colors.LIGHT,
        flex: 1
    },
    map: {
        flex: 1
    },
    form: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        height: 50,
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formIcon: {
        fontSize: 25,
        color: Colors.PRIMARY,
        marginRight: 5
    },
    formText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14
    },
    markerWrapper: {

    },
    salonMaker: {
        position: 'relative',
        height: 70,
        width: 57
    },
    salonMakerWrapper: {
        position: 'absolute',
        left: -15,
        right: 60,
        top: -8
    },
    salonMakerInfo: {
        position: 'absolute',
        top: 0,
        bottom: 15,
        right: 0,
        left: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    salonMakerInfoPrice:{
        fontSize: 8,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        marginTop: 2
    },
    salonMakerInfoPriceActive: {
        color: Colors.LIGHT
    },
    starStyle: {
        // width: 8,
        // height: 8,
        // resizeMode: 'cover'
    },
    starStyleBlock: {
        marginRight: 1
    },
    salonInfo: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        backgroundColor: Colors.LIGHT,
        elevation: 5,
        borderRadius: 3,
        flexDirection: 'row',

    },
    salonInfoCover: {
        height: 100,
        width:100,
    },
    salonInfoBody: {
      flex: 1,
        paddingRight: 15,
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 15
    },
    salonInfoName: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        marginBottom: 2
    },
    salonInfoCol: {
      flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    salonInfoAdressWrapper: {
        flex: 1,
    },
    salonInfoAdress: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,

    },
    salonInfoDistanceIcon: {
        color: Colors.SILVER_DARK,
    },
    salonInfoDistance: {
        fontSize: 10,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    salonInfoRatingNumber: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        marginRight: 5
    },
    salonInfoStarStyle: {
        marginRight: 5
    },
    salonInfoRating: {
        flex: 1
    },
    salonInfoPrice: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    mapTools: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        zIndex: 99
    },
    mapTool: {
        backgroundColor: Colors.PRIMARY,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    mapToolText: {
        color: Colors.LIGHT
    }
});

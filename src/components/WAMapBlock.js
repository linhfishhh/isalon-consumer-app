import React, {Component, PureComponent} from 'react';
import MapView, { PROVIDER_GOOGLE, Marker}  from 'react-native-maps';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconFA from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";

export default class WAMapBlock extends PureComponent{
    static defaultProps = {
        position: {},
        hideInfo: false,
        location: {
            lat: 37.78825,
            lng: -122.4324,
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            enabled: false
        }
    };
    render(){
        return (
            <View>
                <MapView
                    ref={ref=>this.map=ref}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: this.props.location.lat,
                        longitude: this.props.location.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    provider={PROVIDER_GOOGLE}
                    style={Styles.map}
                    scrollEnabled={this.state.enabled}
                    zoomEnabled={this.state.enabled}
                    rotateEnabled={this.state.enabled}
                    pitchEnabled={this.state.enabled}
                >
                    <Marker
                        coordinate={{
                            latitude: this.props.location.lat,
                            longitude: this.props.location.lng,
                        }}
                    >

                    </Marker>
                </MapView>
                <View style={Styles.mapTools}>
                    <TouchableOpacity style={[Styles.mapButtonTop]}
                                      onPress={()=>{
                                          this.setState({
                                              enabled: !this.state.enabled
                                          })
                                      }}
                    >
                        <Icon style={[Styles.mapButtonIcon, this.state.enabled && Styles.mapButtonIconActive]} name={'pan-tool'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> {
                            this.map.fitToElements(true);
                        }}
                        style={Styles.mapButtonBottom}>
                        <Icon style={Styles.mapButtonIcon}  name={'near-me'} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    map: {
        height: 350,
        width: '100%',
        position: 'relative'
    },
    mapTools: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: Colors.LIGHT,
        alignItems: 'center',
        width: 40,
        borderRadius: 20
    },
    mapButtonTop: {
        height: 45,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        width: '100%',
        alignItems: 'center'
    },
    mapButtonBottom: {
        height: 45,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
    },
    mapButtonIcon: {
        color: Colors.SILVER,
        fontSize: 20
    },
    mapButtonIconActive: {
        color: Colors.PRIMARY
    },
})
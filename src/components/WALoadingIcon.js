import React, {Component} from 'react';
import {Image, View} from 'react-native';

export default class WALoadingIcon extends Component {
    render() {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                <Image style={{width: 250, resizeMode: 'contain'}}  source={require('../assets/images/ISALON-03.png')}/>
            </View>
        );
    };
}
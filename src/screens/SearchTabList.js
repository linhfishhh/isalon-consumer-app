import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import {facebookLogin} from  '../auth';
import {updateInfo as updateAccountInfo} from "../redux/account/actions";
import {connect} from "react-redux";
type Props = {};
export default class SearchTabList extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View/>
        )
    }
}


const Styles = StyleSheet.create({

});
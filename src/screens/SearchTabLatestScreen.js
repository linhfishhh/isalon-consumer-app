import React, {Component, PureComponent} from 'react';
import {ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import numeral from 'numeral';
import {connect} from "react-redux";
import WASearchTabResult from "../components/WASearchTabResult";
import {getResultSearchTabLatest, updateSearchTabLatestState} from "../redux/search_tab_latest/actions";

type Props = {};
class SearchTabLatestScreen extends PureComponent<Props> {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    _loadMore = ()=>{
        this.props.getResultSearchTabLatest({}, false);
    };

    render() {
        return (
            <WASearchTabResult
              onLoadMore={this._loadMore}
              mutiple_page={true} navigation={this.props.route.navigation} data={this.props.tab}/>
        )
    }
}

export default connect(
    state => {
        return {
            search: state.new_search,
            tab: state.new_search_tab_latest
        }
    },
    {
        updateSearchTabLatestState,
        getResultSearchTabLatest,
    }
)(SearchTabLatestScreen);

const Styles = StyleSheet.create({
});
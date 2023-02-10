import React,  { Component, PureComponent} from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, StatusBar, Modal, View
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../styles/GlobalStyles";
import {connect} from 'react-redux';
import ImageSources from "../styles/ImageSources";
import {Svg, Path, Line} from "react-native-svg";

class WASearchFilter extends Component<Props> {
    static defaultProps = {
        bg: require('../assets/images/filter_bg.png'),
        styleRight: true,
        addressText: 'Địa điểm'
    };
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <View style={[Styles.filter, this.props.search.fetching && {opacity: 0.5}]}>
                <Image
                    style={Styles.filterBg}
                    source={this.props.bg}
                />
                <TouchableOpacity
                    onPress={()=>{
                        if(!this.props.search.fetching){
                            this.props.navigation.navigate('home_result_filter', {
                                onApply: this.props.onApply,
                                query: this.props.query
                            });
                        }
                    }}
                    style={Styles.filterLeft}>
                    <Svg width={22} height={22}>
                        <Path d="M13.22,6,17.68.5H.5L7,9a.93.93,0,0,1,.22.6V20.5" fill="none" stroke="#ff5c39"/>
                        <Line x1="10.62" y1="8.76" x2="22.04" y2="8.76" fill="none" stroke="#ff5c39" />
                        <Line x1="10.62" y1="13.15" x2="22.04" y2="13.15" fill="none" stroke="#ff5c39"/>
                        <Line x1="10.62" y1="17.53" x2="22.04" y2="17.53" fill="none" stroke="#ff5c39"/>
                    </Svg>
                    <Text style={Styles.filterTitle}>Bộ lọc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        if(!this.props.search.fetching){
                            this.props.navigation.navigate('home_result_place_filter', {
                                onApply: this.props.onApply,
                                query: this.props.query
                            });
                        }
                    }}
                    style={[Styles.filterRight, this.props.styleRight && Styles.filterRightActive]}>
                    <Svg width={15} height={20}>
                        <Path d="M7.25,0A7.2,7.2,0,0,0,0,7.21,8.58,8.58,0,0,0,1.06,11a80.31,80.31,0,0,0,6.19,9,76.61,76.61,0,0,0,6.28-9,8.54,8.54,0,0,0,1-3.84A7.26,7.26,0,0,0,7.25,0Zm0,9.77a2.56,2.56,0,1,1,2.6-2.56A2.58,2.58,0,0,1,7.24,9.77Z" fill="#ff5c39"/>
                    </Svg>
                    <Text numberOfLines={1} style={Styles.filterText}>{this.props.addressText}</Text>
                </TouchableOpacity>
            </View>
        );
    };
}

export default connect(state=>{
    return {
        search: state.search
    }
})(WASearchFilter);

const Styles = StyleSheet.create({
    filter: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center'
    },
    filterBg: {
        // borderColor: 'red',
        // borderWidth: 1
    },
    filterWrapper: {
        position: 'relative',
    },
    filterRight: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        height: 50,
        paddingLeft: 20,
        paddingRight: 40,
        //paddingLeft: 55,
        width: '50%',
        // borderWidth: 1,
        // borderColor: Colors.DARK,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    filterRightActive: {
        paddingLeft: 60,
    },
    filterLeft: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        height: 50,
        width: '50%',
        // borderWidth: 1,
        // borderColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingRight: 40
    },
    filterTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 16,
        marginLeft: 5,
        marginBottom: 5
    },
    filterText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 14,
        marginLeft: 5,
        overflow: 'hidden'
    },
});

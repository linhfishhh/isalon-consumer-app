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

class WAAvatar extends Component<Props> {
    static defaultProps = {
        style: {},
        backgroundColor: Colors.SILVER_LIGHT
    };
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <Image
                style={[{
                    backgroundColor: this.props.backgroundColor
                }, this.props.style]}
                source={{uri: this.props.account.avatar}}
            />
        );
    };
}

export default connect(state=>{
    return {
        account: state.account
    }
})(WAAvatar);

const Styles = StyleSheet.create({
});

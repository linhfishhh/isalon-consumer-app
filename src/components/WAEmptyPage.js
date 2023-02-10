import React,  { Component , PureComponent} from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, View
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../styles/GlobalStyles";
import ImageSources from "../styles/ImageSources";

export default class WAEmptyPage extends PureComponent<Props> {
    static defaultProps = {
        title: '',
        subTitle: '',
        style: undefined
    };
    constructor(props) {
        super(props)
    };
    render() {

        return (
            <View style={[Styles.container, this.props.style]}>
                <Image source={ImageSources.IMG_EMPTY_PAGE} style={Styles.img} />
                <Text style={Styles.title}>
                    {this.props.title}
                </Text>
                <Text style={Styles.subTitle}>
                    {this.props.subTitle}
                </Text>
            </View>
        );
    };
}

const Styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },

    img: {
        width: 250,
        height: 200,
        resizeMode: 'contain'
    },
    title: {
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 25,
        color: Colors.TEXT_DARK,
        marginBottom: 5
    },
    subTitle: {
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.SILVER,
    }
});

import React, {Component, PureComponent} from 'react';
import {
    StatusBar,
    Text,
    View,
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import Colors from  '../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import GlobalStyles from "../styles/GlobalStyles";
import PropTypes from 'prop-types';


type Props = {
    darkTheme: PropTypes.bool,
    navigation: PropTypes.object,
    navigationAction: PropTypes.func,
    navigationClose: PropTypes.bool,
    navigationButtonStyle: PropTypes.object,
    backgroundImage: ImageBackground.PropTypes.source,
    overlayColor: PropTypes.string,
    contentWrapperStyle: PropTypes.object,
    rightComponent: PropTypes.object,
    headerTitle: PropTypes.string,
    backgroundColor: PropTypes.string,
    replace: PropTypes.bool,
    layoutPadding: PropTypes.number,
    keyboardAvoid: PropTypes.bool,
    headerContainerStyle: PropTypes.object,
    headerTitleStyle: PropTypes.object,
};

export default class PageContainer extends Component<Props> {
    static defaultProps = {
        darkTheme: true,
        navigation: undefined,
        navigationAction: undefined,
        navigationClose: false,
        navigationButtonStyle: undefined,
        backgroundImage: undefined,
        overlayColor: 'transparent',
        contentWrapperStyle: {},
        rightComponent: undefined,
        headerTitle: undefined,
        backgroundColor: Colors.LIGHT,
        replace: undefined,
        layoutPadding: GlobalStyles.LAYOUT_PADDING,
        keyboardAvoid: true,
        headerContainerStyle: undefined,
        headerTitleStyle: undefined
    };
    render() {
        return (
            <ImageBackground
                source={this.props.backgroundImage}
                style={{backgroundColor: this.props.backgroundColor, flex: 1}}>

                <View style={{flex: 1 ,  backgroundColor:this.props.overlayColor}}>
                    <StatusBar
                        translucent={true}
                        backgroundColor={'transparent'}
                        barStyle={this.props.darkTheme?'dark-content':'light-content'}
                    />
                    {this.props.navigation?
                        <View style={[Styles.headerContainer, this.props.headerContainerStyle]}>
                            <View style={Styles.headerWrapper}>
                                <View style={[Styles.HeaderLeft, {paddingLeft: this.props.layoutPadding}]}>
                                    <TouchableOpacity
                                        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                                        onPress={()=>{
                                        if(this.props.navigationAction){
                                            this.props.navigationAction();
                                        }
                                        else{
                                            this.props.replace?this.props.navigation.navigate('new_login'):this.props.navigation.goBack()
                                        }
                                    }}

                                    >
                                        <Icon style={[this.props.darkTheme?Styles.backIconDark:Styles.backIcon, this.props.navigationButtonStyle]}
                                              name={this.props.navigationClose?"close":"arrow-back"}/>
                                    </TouchableOpacity>
                                </View>
                                {this.props.headerTitle?
                                <View style={Styles.headerTitle}><Text style={[Styles.headerTitleText, this.props.headerTitleStyle]}>{this.props.headerTitle}</Text></View>
                                    :undefined}
                                <View style={[Styles.HeaderRight, {paddingRight: this.props.layoutPadding}]}>
                                    {this.props.rightComponent}
                                </View>
                            </View>
                        </View>
                        :
                        undefined}
                        <View
                            style={[{
                                flex: 1,
                                backgroundColor: Colors.TRANSPARENT
                            }, this.props.contentWrapperStyle]}
                        >
                            {this.props.children}
                        </View>

                </View>

            </ImageBackground>

        )
    }
}


const Styles = StyleSheet.create({
    headerContainer:{
        height: 50 + getStatusBarHeight(),
        paddingTop: getStatusBarHeight(),
    },
    headerWrapper:{
        flex: 1,
        flexDirection: 'row',
    },
    HeaderLeft:{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',

    },
    HeaderRight:{
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleText: {
        color: Colors.TEXT_DARK,
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME
    },
    backButton:{
        width: 30
    },
    backIcon:{
        color: Colors.LIGHT,
        fontSize: 30
    },
    backIconDark: {
        color: Colors.TEXT_DARK,
        fontSize: 30
    }
});

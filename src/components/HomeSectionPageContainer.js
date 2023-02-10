import React, {Component} from 'react';
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


type Props = {};
export default class HomeSectionPageContainer extends Component<Props> {
    static defaultProps = {
        style: undefined
    };
    render() {
        return (
            <View style={[Styles.container, this.props.style]}>
                {/*<StatusBar*/}
                    {/*//translucent={true}*/}
                    {/*//backgroundColor={'transparent'}*/}
                  {/*//  barStyle={'dark-content'}*/}
                {/*/>*/}
                {this.props.children}
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    container: {
        paddingTop: getStatusBarHeight(),
        backgroundColor: Colors.LIGHT,
        flex: 1
    }
});
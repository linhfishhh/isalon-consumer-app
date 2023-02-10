import React, {Component} from 'react';
import {Alert, ScrollView, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {createAccount, updateJoinTOS, updateStartupRoute} from "../redux/account/actions";
import AutoHeightWebView from 'react-native-webview-autoheight';

type Props = {};
class AgreementScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onSubmit = () => {
        this.props.createAccount(this.props.navigation);
    };

    componentWillMount(){
        this.props.updateJoinTOS();
        this.props.updateStartupRoute(undefined);
    }

    componentDidUpdate(){
        if (this.props.account.startupRoute !== undefined){
            this.props.navigation.replace(this.props.account.startupRoute);
        }
    }

    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper, {paddingLeft: 20, paddingRight: 20}]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
            >
                <View style={Styles.pageWrapper}>
                    <View style={Styles.title}>
                        <Text style={Styles.titleText}>Lưu ý khi tham gia</Text>
                    </View>
                    <View style={Styles.content}>
                        <WebView
                            style={Styles.contentWeb}
                            originWhitelist={['*']}
                            startInLoadingState={true}
                            source={
                                {
                                    baseUrl: '',
                                    html: this.props.account.temp.joinTOS
                                }
                            }
                            scalesPageToFit={Platform.OS !== 'ios'}
                        />
                        <View style={Styles.buttons}>
                            <WAButton
                                onPress={this.onSubmit}
                                text={'Chấp nhận'} style={[Styles.button, Styles.buttonOK]} />
                            <WAButton
                                text={'Từ chối'} textStyle={Styles.buttonNoText}
                                style={[Styles.button, Styles.buttonNO]}
                            />
                        </View>
                    </View>
                </View>
                <WALoading show={this.props.account.fetching}/>
            </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
        updateJoinTOS,
        createAccount,
        updateStartupRoute
    }
)(AgreementScreen);

const Styles = StyleSheet.create({
    pageWrapper:{
        flex: 1,
    },
    title: {
        marginBottom: 30
    },
    titleText: {
        fontSize: 26,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME
    },
    content: {
        flex: 1
    },
    contentWeb: {
        flex: 1
    },
    buttons: {
        height: 180
    },
    textOne: {
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginBottom: 5,
        fontFamily: GlobalStyles.FONT_NAME
    },
    linkWrapper: {

    },
    linkText: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    textTwo: {
        fontSize: 17,
        color: Colors.TEXT_DARK,
        marginTop: 30,
        marginBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME
    },
    button: {
        width: 200,
        marginBottom: 15
    },
    buttonOK: {

    },
    buttonNO: {
        backgroundColor: Colors.LIGHT,
        borderWidth: 1,
        borderColor: Colors.PRIMARY
    },
    buttonNoText: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    }
});
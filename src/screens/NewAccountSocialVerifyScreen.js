import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {
    clearError,
    determineAccessRoute,
    loadSettings,
    registerStepTwo,
    resendPhoneVerify, saveAccountSettings, updateInfo as updateAccountInfo
} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";
import Utils from "../configs";
import { authService } from '../shop/services';

type Props = {};
class NewAccountSocialVerifyScreen extends Component<Props> {
    defaultMessage = 'Hãy mở tin nhắc điện thoại và nhập 6 chữ được gửi trong tin nhắn';
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            editing: false,
            ...this.props.navigation.getParam('data'),
            fetching: false,
            error: false,
            errorMessage: '',
        }
    }

    onSubmit = () => {
        this.code.blur();
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        }, async () => {
            try {
                let form = {
                    phone: this.state.phone,
                    token: this.state.token,
                    code: this.state.code,
                    provider: this.state.provider
                };
                let rq = await Utils.getAxios().post(
                    'social/create-account',
                    form
                );
                let data = rq.data;
                this.setState({
                    fetching: false,
                }, async ()=>{
                    let route = await determineAccessRoute();
                    let settings = await loadSettings();
                    this.props.updateAccountInfo({
                        ...data.user,
                        token: data.token,
                        tabIndex: settings.tabIndex
                    });
                    await saveAccountSettings([
                        [
                            '@iSalon:token',
                            data.token
                        ]
                    ]);
                    await authService.login(data.user.user_id);
                    this.props.navigation.replace(route);
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status===422?Utils.getValidationMessage(e.response):e.response.status===400?e.response.data.message:'Có lỗi xảy ra trong quá trình xử lý'
                });
            }
        });
    };
    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios'?'padding':undefined}
                style={{flex: 1}}>
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
            >
                <NavigationEvents
                    onWillFocus={this.props.clearError}
                />
                {
                    !this.state.editing?
                        <Image  source={ImageSources.IMG_CHECK} style={Styles.headerImg}/>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text style={[GlobalStyles.pageTitle, NewUserFormStyles.pageTitle, Styles.pageTitle]}>
                            Xác minh{"\n"}Tài khoản mới
                        </Text>:
                        undefined
                }
                {
                    !this.state.editing?
                        <Text style={Styles.msg}>Một tin nhắn đã gửi tới số</Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text style={Styles.msgPhone}>{this.state.phone}</Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text style={[Styles.msgNote, this.state.error && Styles.msgNoteError]}>{this.state.error?this.state.errorMessage:this.defaultMessage}</Text>
                        :undefined
                }
                <View>
                    <View style={[GlobalStyles.textField, Styles.codeField]}>
                        <TextInput
                            ref={ref=>this.code=ref}
                            style={[GlobalStyles.textFieldInput]}
                            placeholder={'Mã xác nhận'}
                            placeholderTextColor={Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.PRIMARY}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType={'numeric'}
                            returnKeyType={'done'}
                            returnKeyLabel={'Xong'}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({code: text})}
                        />
                    </View>
                    <WAButton
                        text={"Xác minh"}
                        style={[Styles.button]}
                        iconLeft={false}
                        onPress={this.onSubmit}
                    />
                    <WAButton
                        text={"Gửi xác minh lại"}
                        style={[Styles.button, Styles.buttonRetry]}
                        textStyle={Styles.buttonRetryText}
                        iconLeft={false}
                        onPress={this._resendVerifyPhone}
                    />
                </View>
                <WALoading show={this.state.fetching}/>
            </PageContainer>
            </KeyboardAvoidingView>
        )
    }

    _resendVerifyPhone = () => {
        this.code.blur();
        this.setState({
            fetching: true,
            error: false,
            errorMessage: '',
            editing: false
        }, async()=>{
            try {
                let rq = await Utils.getAxios().post(
                    'verify-phone',
                    {
                        phone: this.state.phone
                    }
                );
                this.setState({
                    fetching: false
                }, () => {

                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 400?e.response.data.message:'Có lỗi xảy ra trong quá trình gửi mã xác nhận'
                });
            }
        });
    };
}

export default connect(
    state=>{
        return {
            account: state.account
        }
    },
    {
        resendPhoneVerify,
        registerStepTwo,
        clearError,
        updateAccountInfo
    }
)(NewAccountSocialVerifyScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {
        marginBottom: 15
    },
    button: {
        marginTop: 15,
        marginBottom: 0,
    },
    headerImg: {
        marginBottom: 15
    },
    msg: {
        fontSize: 15,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgPhone: {
        fontSize: 15,
        color: Colors.PRIMARY,
        marginBottom: 5,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgNote: {
        fontSize: 15,
        color: Colors.SILVER,
        marginBottom: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgNoteError: {
        color: Colors.ERROR,
        fontFamily: GlobalStyles.FONT_NAME
    },
    codeField: {
        marginBottom: 30
    },
    buttonRetry: {
        backgroundColor: Colors.LIGHT,
        borderColor: Colors.TEXT_DARK,
        borderWidth: 1,
    },
    buttonRetryText: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    }
});
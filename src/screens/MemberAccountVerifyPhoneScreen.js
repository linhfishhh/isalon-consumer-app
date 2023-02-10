import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {clearError, registerStepTwo, resendPhoneVerify} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";
import {DotIndicator} from 'react-native-indicators';
import Utils from '../configs';

type Props = {};
class MemberAccountVerifyPhoneScreen extends Component<Props> {
    defaultMessage = 'Hãy mở tin nhắc điện thoại và nhập 6 chữ được gửi trong tin nhắn';
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            editing: false,
            phone: this.props.navigation.getParam('phone'),
            fetching: false,
            onSuccess: this.props.navigation.getParam('onSuccess'),
            error: false,
            errorMessage: ''
        }
    }

    _verifyPhoneCode = () => {
        this.code.blur();
        this.setState({
            fetching: true,
            error: false,
            errorMessage: '',
            editing: false
        }, async() => {
            try {
                await Utils.getAxios(this.props.account.token).post(
                    'profile/update-phone',
                    {
                        phone: this.state.phone,
                        code: this.state.code
                    }
                );
                this.setState({
                    fetching: false,
                }, ()=>{
                    this.state.onSuccess();
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 400? e.response.data.message: 'Lỗi xảy ra khi xử lý mả xác thực'
                });
            }
        });
    };

    _requestPhoneCode = () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: '',
            editing: false
        }, async() => {
            try {
                await Utils.getAxios().post('verify-phone', {phone: this.state.phone});
                this.setState({
                    fetching: false
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 400? e.response.data.message: 'Lỗi xảy ra khi yêu cầu mã xác thực mới'
                });
            }
        });
    };
    render() {
        return (
            this.state.fetching?
                <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                    <DotIndicator count={3} color={Colors.PRIMARY} size={10} />
                </View>
                :
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
                                Xác minh số{"\n"}điện thoại mới
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
                            <Text style={[Styles.msgNote, this.state.error && Styles.msgNoteError]}>
                                {this.state.error?this.state.errorMessage:this.defaultMessage}
                            </Text>
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
                            onPress={this._verifyPhoneCode}
                            text={"Xác minh"}
                            style={[Styles.button]}
                            iconLeft={false}
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
        )
    }

    _resendVerifyPhone = () => {
        this._requestPhoneCode();
    };
}

export default connect(
    state=>{
        return {
            account: state.account
        }
    },
    {
    }
)(MemberAccountVerifyPhoneScreen);

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
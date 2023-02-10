import React, {Component} from 'react';
import {KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Text, TouchableOpacity, View, WebView, TextInput} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {createAccount, updateJoinTOS, updateStartupRoute} from "../redux/account/actions";
import {DotIndicator} from 'react-native-indicators';
import Utils from '../configs';

type Props = {};
class MemberAccountChangePasswordScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            oldPassword: '',
            password: '',
            confirmPassword: '',
            error: false,
            errorMessage: '',
            fetching: false
        }
    }

    _save = () => {
        if(this.state.fetching){
            return;
        }
        this.oldPass.blur();
        this.newPass.blur();
        this.ConfPass.blur();
        this.setState({
            fetching: true,
            error: false,
            errorMessage: '',
            editing: false
        }, async()=>{
            try {
                await Utils.getAxios(this.props.account.token)
                    .post('profile/change-password',
                        {
                            old_password: this.state.oldPassword,
                            password: this.state.password,
                            password_confirmation: this.state.confirmPassword
                        }
                        );
                this.setState({
                    fetching: false,
                }, ()=>{
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 422?Utils.getValidationMessage(e.response):'Lỗi xảy ra khi lưu mật khẩu'
                });
            }
        });
    };

    render() {
        return (
            <PageContainer
                darkTheme={true}
                navigationButtonStyle={{color: Colors.PRIMARY}}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper, {justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 0}]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                rightComponent={
                    <TouchableOpacity
                        onPress={()=>{
                            if(this.state.fetching){
                                return;
                            }
                            this._save();
                        }}
                        hitSlop={{top: 30, bottom: 30, right: 30, left: 30}}>
                        <Text style={Styles.save}>Lưu</Text>
                    </TouchableOpacity>
                }
            >
                {
                    this.state.fetching?
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                        :
                        <ScrollView style={{paddingLeft: 20}}>
                            {
                                !this.state.editing?
                                    <View style={Styles.title}>
                                        <Text style={Styles.titleText}>Đổi mật khẩu</Text>
                                        <Text style={[Styles.titleTextSub, this.state.error && Styles.titleTextSubError]}>
                                            {
                                                this.state.error?this.state.errorMessage:
                                                    'Vui lòng nhập mật khẩu cũ đang sử dụng và mật khẩu mới cần thay đổi'
                                            }
                                        </Text>
                                    </View>
                                    :undefined
                            }
                            <View style={Styles.form}>
                                <View style={Styles.field}>
                                    <Text style={Styles.fieldLabel}>Mật khẩu hiện tại</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        ref={ref=>this.oldPass=ref}
                                        style={[Styles.fieldInput]}
                                        placeholder={'Nhập mật khẩu hiện tại'}
                                        placeholderTextColor={Colors.SILVER}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        selectionColor={Colors.PRIMARY}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        spellCheck={false}
                                        value={this.state.oldPassword}
                                        onFocus={() => {
                                            this.setState({editing: true})
                                        }}
                                        onBlur={() => {
                                            this.setState({editing: false})
                                        }}
                                        onChangeText={(text) => this.setState({oldPassword: text})}
                                    />
                                </View>
                                <View style={Styles.field}>
                                    <Text style={Styles.fieldLabel}>Mật khẩu mới</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        ref={ref=>this.newPass=ref}
                                        style={[Styles.fieldInput]}
                                        placeholder={'Nhập mật khẩu mới cần đổi'}
                                        placeholderTextColor={Colors.SILVER}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        selectionColor={Colors.PRIMARY}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        spellCheck={false}
                                        value={this.state.password}
                                        onFocus={() => {
                                            this.setState({editing: true})
                                        }}
                                        onBlur={() => {
                                            this.setState({editing: false})
                                        }}
                                        onChangeText={(text) => this.setState({password: text})}
                                    />
                                </View>
                                <View style={Styles.field}>
                                    <Text style={Styles.fieldLabel}>Nhập lại mật khẩu</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        ref={ref=>this.ConfPass=ref}
                                        style={[Styles.fieldInput]}
                                        placeholder={'Nhập lại mật khẩu mới để xác nhận'}
                                        placeholderTextColor={Colors.SILVER}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        selectionColor={Colors.PRIMARY}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        spellCheck={false}
                                        value={this.state.confirmPassword}
                                        onFocus={() => {
                                            this.setState({editing: true})
                                        }}
                                        onBlur={() => {
                                            this.setState({editing: false})
                                        }}
                                        onChangeText={(text) => this.setState({confirmPassword: text})}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                }
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
)(MemberAccountChangePasswordScreen);

const Styles = StyleSheet.create({
    title: {
        marginBottom: 30,
        paddingRight: 20
    },
    titleText: {
        fontSize: 34,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME
    },

    titleTextSub: {
        fontSize: 14,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        marginTop: 5
    },
    titleTextSubError: {
        color: Colors.ERROR
    },
    field: {
        marginBottom: 30
    },
    fieldLabel: {
        fontSize: 15,
        fontFamily: this.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    fieldInput: {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        height: 50,
        fontSize: 14,
        fontFamily: this.FONT_NAME,
        color: Colors.TEXT_DARK,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    save: {
        fontSize: 18,
        fontFamily: this.FONT_NAME,
        color: Colors.PRIMARY,
    }
});
import React, {Component} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import {NavigationEvents} from "react-navigation";
import {connect} from 'react-redux';
import {clearError, resetPassswordStepThree} from "../redux/account/actions";
import WAAlert from "../components/WAAlert";

type Props = {};
class NewPassScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: "Đặt lại\nMật khẩu",
            errorMessage: 'Vui lòng nhập mật khẩu mới và xác nhận mật khẩu mới',
            password: '',
            cpassword: '',
            editing: false,
            phone: this.props.navigation.getParam('phone'),
            code: this.props.navigation.getParam('code'),
        }
    }

    onSubmit = () => {
        this.refs.password.blur();
        this.refs.cpassword.blur();
        this.props.resetPassswordStepThree(this.state.phone, this.state.code, this.state.password, this.state.cpassword, this.props.navigation)
    };

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios'?'padding':undefined}
                style={{flex: 1}}>
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, AccessFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={this.props.account.error?Colors.ERROR:Colors.DARK}
                navigationClose={true}
                replace={'login'}
            >
                <NavigationEvents
                    onWillFocus={this.props.clearError}
                />
                {
                    !this.state.editing?
                        <Text key={1} style={[GlobalStyles.pageTitle, AccessFormStyles.pageTitle, Styles.pageTitle]}>
                            {this.state.pageTitle}
                        </Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text key={2} style={[AccessFormStyles.error]}>
                            {
                                this.props.account.error?this.props.account.errorMessage:this.state.errorMessage
                            }
                        </Text>
                        :undefined
                }
                <View style={AccessFormStyles.form}>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                        this.props.account.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.props.account.error && AccessFormStyles.textFieldIconError]} name={'lock'}/>
                        </View>
                        <TextInput
                            ref={'password'}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'Mật khẩu mới'}
                            placeholderTextColor={this.props.account.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            secureTextEntry={true}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({password: text})}
                        />
                    </View>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                        this.props.account.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.props.account.error && AccessFormStyles.textFieldIconError]} name={'unlock'}/>
                        </View>
                        <TextInput
                            ref={'cpassword'}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'Xác nhận mật khẩu'}
                            placeholderTextColor={this.props.account.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            secureTextEntry={true}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({cpassword: text})}
                        />
                    </View>
                    <WAButton
                        text={"Hoàn tất"}
                        style={[Styles.button, Styles.buttonLogin, this.props.account.error && AccessFormStyles.buttonError]}
                        textStyle={this.props.account.error && AccessFormStyles.buttonErrorText}
                        onPress={this.onSubmit}
                    />
                </View>
                <WALoading show={this.state.loading}/>
                <WAAlert
                    title = 'Khởi tạo mật khẩu'
                    question = 'Mật khẩu mới đã được khởi tạo, bạn có thể dùng để đăng nhập từ bây giờ'
                    no={false}
                    yes={()=>{
                        this.props.navigation.replace('new_login');
                    }}
                    show={this.props.account.resetPasswordDone}
                    titleFirst={true}
                    yesTitle={'Tôi đã hiểu'}
                />
            </PageContainer>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    state=>{
        return {
            account: state.account
        }
    },
    {
        clearError,
        resetPassswordStepThree
    }
)(NewPassScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {

    },
    button: {
        marginTop: 50,
    },
});
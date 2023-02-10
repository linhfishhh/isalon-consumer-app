import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import {connect} from 'react-redux';
import {clearError, login, setError, updateStartupRoute} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";

type Props = {};
class LoginScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            editing: false
        }
    }
    
    onSubmit = () => {
        this.refs.username.blur();
        this.refs.password.blur();
        this.props.login(this.state.username, this.state.password);
    };

    componentWillMount(){
        this.props.updateStartupRoute(undefined);
    }

    componentDidUpdate(){
        if (this.props.account.startupRoute !== undefined){
            this.props.navigation.replace(this.props.account.startupRoute);
        }
    }

    componentDidMount(){
        let autoLogin = this.props.navigation.getParam('autoLogin');
        if(autoLogin){
            this.setState({
                username: autoLogin.username,
                password: autoLogin.password,
            }, () => {
                this.onSubmit();
            });
        }
    }

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
                >
                    <NavigationEvents
                        onWillFocus={this.props.clearError}
                    />
                    {
                        !this.state.editing?
                            <Text key={1} style={[GlobalStyles.pageTitle, AccessFormStyles.pageTitle, Styles.pageTitle]}>
                                {this.props.account.error?
                                    this.props.account.errorTitle:
                                    'Đăng nhập'
                                }
                            </Text>
                            :undefined
                    }
                    {
                        !this.state.editing?
                            <Text key={2} style={[AccessFormStyles.error]}>
                                {
                                    this.props.account.error?
                                        this.props.account.errorMessage:
                                        ''
                                }
                            </Text>
                            :undefined
                    }
                    <View style={AccessFormStyles.form}>
                        <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                            this.props.account.error && AccessFormStyles.textFieldError]}>
                            <View style={GlobalStyles.textFieldIconWrapper}>
                                <Icon style={[GlobalStyles.textFieldIcon,
                                    this.props.account.error && AccessFormStyles.textFieldIconError]} name={'user'}/>
                            </View>
                            <TextInput
                                ref={'username'}
                                style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                                placeholder={'Số điện thoại hoặc email'}
                                placeholderTextColor={this.props.account.error?Colors.LIGHT:Colors.SILVER}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                selectionColor={Colors.LIGHT}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                spellCheck={false}
                                value={this.state.username}
                                onFocus={()=>{this.setState({editing: true})}}
                                onBlur={()=>{this.setState({editing: false})}}
                                onChangeText={(text) => this.setState({username: text})}
                            />
                        </View>
                        <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                            this.props.account.error && AccessFormStyles.textFieldError]}>
                            <View style={GlobalStyles.textFieldIconWrapper}>
                                <Icon style={[GlobalStyles.textFieldIcon,
                                    this.props.account.error && AccessFormStyles.textFieldIconError]} name={'lock'}/>
                            </View>
                            <TextInput
                                ref={'password'}
                                style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                                placeholder={'Mật khẩu đăng nhập'}
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
                                value={this.state.password}
                            />
                        </View>
                        <TouchableOpacity
                            style={[Styles.resetPassLink]}
                            onPress={()=>{this.props.navigation.navigate('reset_pass')}}
                        >
                            <Text
                                style={[Styles.resetPassLinkText, this.props.account.error && Styles.resetPassLinkTextError]}>
                                Quên mật khẩu
                            </Text>
                        </TouchableOpacity>
                        <WAButton
                            text={"Đăng nhập"}
                            style={[Styles.button, Styles.buttonLogin, this.props.account.error && AccessFormStyles.buttonError]}
                            textStyle={this.props.account.error && AccessFormStyles.buttonErrorText}
                            onPress={this.onSubmit}
                        />
                    </View>
                    <WALoading show={this.props.account.fetching}/>
                </PageContainer>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }, {
        clearError,
        setError,
        login,
        updateStartupRoute
    }
)(LoginScreen);


const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {

    },
    button: {
        marginTop: 15,
        marginBottom: 15
    },
    resetPassLink: {
        marginBottom: 30,
        alignSelf: 'stretch',
    },
    resetPassLinkText: {
        color: Colors.TEXT_LINK,
        textAlign: 'right',
        fontFamily: GlobalStyles.FONT_NAME
    },
    resetPassLinkTextError: {
        color: '#fff',
        fontFamily: GlobalStyles.FONT_NAME
    },
});
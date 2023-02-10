import React, {Component} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import {connect} from 'react-redux';
import {clearError, registerStepOne} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";

type Props = {};
class RegisterScreen
    extends Component<Props> {
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
        this.props.registerStepOne(this.state.username, this.state.password, this.props.navigation);
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
            >
                <NavigationEvents
                    onWillFocus={this.props.clearError}
                />
                {
                    !this.state.editing?
                        <Text key={1} style={[GlobalStyles.pageTitle, AccessFormStyles.pageTitle, Styles.pageTitle]}>
                            {this.props.account.error?this.props.account.errorTitle:'Đăng ký'}
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
                        this.state.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.props.account.error && AccessFormStyles.textFieldIconError]} name={'user'}/>
                        </View>
                        <TextInput
                            ref={'username'}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'Số điện thoại'}
                            placeholderTextColor={this.props.account.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType={'numeric'}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({username: text.trim()})}
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
                            onChangeText={(text) => this.setState({password: text.trim()})}
                        />
                    </View>
                    <WAButton
                        text={"Đăng ký"}
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
    componentWillMount(){
        this.props.clearError();
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {registerStepOne, clearError}
)(RegisterScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {
        fontFamily: GlobalStyles.FONT_NAME
    },
    button: {
        marginTop: 50,
        marginBottom: 0,
    },
});

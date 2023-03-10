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
import Utils from '../configs';

type Props = {};
class NewAccountSocialScreen
    extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            fetching: false,
            error: false,
            errorMessage: '',
            data: this.props.navigation.getParam('data'),
            username: ''
        }
    }

    onSubmit = () => {
        this.username.blur();
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
                        phone: this.state.username
                    }
                );
                this.setState({
                    fetching: false
                }, () => {
                    this.props.navigation.replace(
                        'social_phone_verify',
                        {
                            data: {
                                ...this.state.data,
                                phone: this.state.username
                            }
                        }
                    );
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 400?e.response.data.message:'C?? l???i x???y ra trong qu?? tr??nh g???i m?? x??c nh???n'
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
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, AccessFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={this.state.error?Colors.ERROR:Colors.DARK}
            >
                <NavigationEvents
                    onWillFocus={this.props.clearError}
                />
                {
                    !this.state.editing?
                        <Text key={1} style={[GlobalStyles.pageTitle, AccessFormStyles.pageTitle, Styles.pageTitle]}>
                            T??i kho???n m???i
                        </Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text key={2} style={[AccessFormStyles.error]}>
                            {
                                this.state.error?
                                    this.state.errorMessage:
                                    'B???n ???? ????ng k?? b???ng t??i kho???n m???ng x?? h???i v???i email: '+this.state.data.email+'. ch??ng t??i v???n c???n th??m s??? ??i???n tho???i c???a b???n ????? c?? th??? ph???c v??? v?? li??n h??? b???n t???t h??n'
                            }
                        </Text>
                        :undefined
                }
                <View style={AccessFormStyles.form}>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                        this.state.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.state.error && AccessFormStyles.textFieldIconError]} name={'user'}/>
                        </View>
                        <TextInput
                            ref={ref=>this.username=ref}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'S??? ??i???n tho???i'}
                            placeholderTextColor={this.state.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType={'numeric'}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            value={this.state.username}
                            onChangeText={(text) => this.setState({username: text.trim()})}
                        />
                    </View>
                    <WAButton
                        text={"X??c nh???n"}
                        style={[Styles.button, Styles.buttonLogin, this.state.error && AccessFormStyles.buttonError]}
                        textStyle={this.state.error && AccessFormStyles.buttonErrorText}
                        onPress={this.onSubmit}
                    />
                </View>
                <WALoading show={this.state.fetching}/>
            </PageContainer>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    state => {
        return {
            //account: state.account
        }
    },
    {

    }
)(NewAccountSocialScreen);

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

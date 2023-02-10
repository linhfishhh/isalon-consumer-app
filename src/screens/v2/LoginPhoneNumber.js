import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import PageContainer from '../../components/PageContainer';
import GlobalStyles from '../../styles/GlobalStyles';
import Colors from '../../styles/Colors';
import WAButton from '../../components/WAButton';
import AccessFormStyles from '../../styles/AccessFormStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from '../../components/WALoading';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase';

type Props = {};
export default class LoginPhoneNumber extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      phoneNumber: '',
      verificationCode: '',
      error: undefined,
      confirmResult: null,
      message: '',
      editing: false
    };
  }

  // componentDidMount() {
  //   this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({ user: user.toJSON() });
  //       this.props.loggedInWithUser(user);
  //     } else {
  //       // User has been signed out, reset the state
  //       this.setState({
  //         user: null,
  //         phoneNumber: '',
  //         verificationCode: '',
  //         error: undefined,
  //         confirmResult: null,
  //         message: '',
  //         editing: false
  //       });
  //     }
  //   });
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) this.unsubscribe();
  // }

  onReceiveVerificationCode = () => {
    this.refs.txtPhoneNumber.blur();
    let phone = _.trim(this.state.phoneNumber);
    if (_.startsWith(phone, '0')) {
      phone = '+84' + phone.substring(1);
    }
    firebase
      .auth()
      .signInWithPhoneNumber(phone)
      .then(confirmResult =>
        this.setState({ confirmResult, message: 'Đã gửi mã xác thực' })
      )
      .catch(error =>
        this.setState({ error: `Đã có lỗi xảy ra khi gửi mã xác thực` })
      );
  };

  onSendVerificationCode = () => {
    this.refs.txtVerificationCode.blur();
    const { verificationCode, confirmResult } = this.state;

    if (confirmResult && verificationCode.length) {
      confirmResult
        .confirm(verificationCode)
        .then(user => {
          this.setState({ message: 'Xác thực thành công' });
          this.props.loggedInWithUser(user);
        })
        .catch(error =>
          this.setState({
            error: `Đã có lỗi xảy ra khi xác thực mã. Vui lòng thử lại sau`
          })
        );
    }
  };

  cancelLogin = () => {
    this.props.loggedInWithUser(null);
  };

  onPhoneChange = text => {
    this.setState({
      user: undefined,
      phoneNumber: text,
      verificationCode: '',
      error: undefined,
      confirmResult: null,
      message: ''
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <PageContainer
          darkTheme={false}
          contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
          backgroundColor={this.state.error ? Colors.ERROR : Colors.DARK}
        >
          <NavigationEvents />
          <TouchableOpacity
            onPress={this.cancelLogin}
            style={Styles.closeButton}
          >
            <MaterialIcon
              style={Styles.closeIcon}
              name="close"
              color="#ffffff"
              size={35}
            />
          </TouchableOpacity>
          <Text
            key={1}
            style={[
              GlobalStyles.pageTitle,
              AccessFormStyles.pageTitle,
              Styles.pageTitle
            ]}
          >
            {'Đăng nhập'}
          </Text>
          <Text key={2} style={[AccessFormStyles.message]}>
            {this.state.error || this.state.message}
          </Text>
          <View style={AccessFormStyles.form}>
            <View
              style={[
                GlobalStyles.textField,
                GlobalStyles.textFieldHasIcon,
                this.state.error && AccessFormStyles.textFieldError
              ]}
            >
              <View style={GlobalStyles.textFieldIconWrapper}>
                <Icon
                  style={[
                    GlobalStyles.textFieldIcon,
                    this.state.error && AccessFormStyles.textFieldIconError
                  ]}
                  name={'user'}
                />
              </View>
              <TextInput
                ref={'txtPhoneNumber'}
                style={[
                  GlobalStyles.textFieldInput,
                  AccessFormStyles.textFieldInput
                ]}
                placeholder={'Số điện thoại'}
                placeholderTextColor={
                  this.state.error ? Colors.LIGHT : Colors.SILVER
                }
                underlineColorAndroid={Colors.TRANSPARENT}
                selectionColor={Colors.LIGHT}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                value={this.state.phoneNumber}
                onFocus={() => {
                  this.setState({ editing: true });
                }}
                onBlur={() => {
                  this.setState({ editing: false });
                }}
                onChangeText={text => this.onPhoneChange(text)}
                editable={!this.state.confirmResult}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'phone-pad'}
              />
            </View>
            {this.state.confirmResult ? (
              <View
                style={[
                  GlobalStyles.textField,
                  GlobalStyles.textFieldHasIcon,
                  this.state.error && AccessFormStyles.textFieldError
                ]}
              >
                <View style={GlobalStyles.textFieldIconWrapper}>
                  <Icon
                    style={[
                      GlobalStyles.textFieldIcon,
                      this.state.error && AccessFormStyles.textFieldIconError
                    ]}
                    name={'lock'}
                  />
                </View>
                <TextInput
                  ref={'txtVerificationCode'}
                  style={[
                    GlobalStyles.textFieldInput,
                    AccessFormStyles.textFieldInput
                  ]}
                  placeholder={'Mã xác thực'}
                  placeholderTextColor={
                    this.state.error ? Colors.LIGHT : Colors.SILVER
                  }
                  underlineColorAndroid={Colors.TRANSPARENT}
                  selectionColor={Colors.LIGHT}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  spellCheck={false}
                  onFocus={() => {
                    this.setState({ editing: true });
                  }}
                  onBlur={() => {
                    this.setState({ editing: false });
                  }}
                  onChangeText={text =>
                    this.setState({ verificationCode: text })
                  }
                  value={this.state.verificationCode}
                  keyboardType={
                    Platform.OS === 'ios' ? 'default' : 'number-pad'
                  }
                />
              </View>
            ) : null}
            {this.state.confirmResult ? (
              <WAButton
                text={'Xác thực'}
                style={[
                  Styles.button,
                  Styles.buttonLogin,
                  this.state.error && AccessFormStyles.buttonError
                ]}
                textStyle={this.state.error && AccessFormStyles.buttonErrorText}
                onPress={this.onSendVerificationCode}
              />
            ) : (
              <WAButton
                text={'Nhận mã xác thực'}
                style={[
                  Styles.button,
                  Styles.buttonLogin,
                  this.state.error && AccessFormStyles.buttonError
                ]}
                textStyle={this.state.error && AccessFormStyles.buttonErrorText}
                onPress={this.onReceiveVerificationCode}
              />
            )}
          </View>
          {/* <WALoading show={this.props.account.fetching} /> */}
        </PageContainer>
      </KeyboardAvoidingView>
    );
  }
}

const Styles = StyleSheet.create({
  pageWrapper: {
    width: '100%',
    height: '100%'
  },
  pageTitle: {},
  button: {
    marginTop: 15,
    marginBottom: 15
  },
  resetPassLink: {
    marginBottom: 30,
    alignSelf: 'stretch'
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
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 70,
    height: 35,
    width: 35
  },
  closeIcon: {
    height: 35,
    width: 35
  }
});

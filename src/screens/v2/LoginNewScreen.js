import React, { Component } from 'react';
import {
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import PageContainer from '../../components/PageContainer';
import GlobalStyles from '../../styles/GlobalStyles';
import Colors from '../../styles/Colors';
import { facebookLogin } from '../../auth';
import { connect } from 'react-redux';
import {
  updateInfo as updateAccountInfo,
  loginWithOldTokenV2
} from '../../redux/account/actions';
import DialogInput from 'react-native-dialog-input';
import LoginPhoneNumber from './LoginPhoneNumber';
import WALoading from '../../components/WALoading';

type Props = {};
class LoginV2Screen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      hasBack: this.props.navigation.getParam('hasBack')
        ? this.props.navigation.getParam('hasBack')
        : false,
      isVerifyScreenVisible: false
    };
  }

  //Event click close login
  _close = async () => {
    if (this.state.hasBack) {
      this.props.navigation.goBack();
      return;
    }
    let index = 2;
    try {
      index = await AsyncStorage.getItem('@iSalon:tabIndex');
      index = index * 1;
      this.props.updateAccountInfo({
        tabIndex: index
      });
    } catch (e) {}
    this.props.navigation.replace('home');
  };

  //Event click button login facebook
  _facebookLogin = () => {
    facebookLogin(data => {
      this.props.navigation.navigate('social_checking', {
        data: data
      });
    });
  };

  //Event click button login with phonenumber
  _submit = () => {
    this.setState({
      isVerifyScreenVisible: true
    });
  };

  componentDidMount() {
    this._loginWithToken();
  }

  loggedInWithUser = user => {
    this.setState({
      isVerifyScreenVisible: false
    });
    if (user) {
      this._loginWithToken();
    }
  };

  _loginWithToken = () => {
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser
        .getIdToken(false)
        .then(idToken => {
          this.props.loginWithOldTokenV2(
            idToken,
            currentUser.phoneNumber,
            currentUser.email,
            data => {
              if (this.props.account.startupRoute !== undefined) {
                var navigation = this.props.navigation;
                navigation.replace('home'); //this.props.account.startupRoute
              }
            },
            error => {
              if (error.data.message !== undefined) {
                alert(`${error.data.message}`);
              }
            }
          );
        })
        .catch(error => {});
    }
  };

  renderMainScreen() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={Styles.main}>
          <ImageBackground
            style={Styles.bg}
            source={require('../../assets/images/login_bg_2.jpeg')}
          />
          <View style={Styles.closeView}>
            {Platform.OS === 'android' ? (
              <TouchableOpacity onPress={this._close}>
                <Image
                  style={Styles.closeIcon}
                  source={require('../../assets/images/close.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this._close} underlayColor="#fff">
                <Text style={Styles.buttonIgnore}>BỎ QUA</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={Styles.bodyView}>
            <PageContainer
              darkTheme={false}
              // navigation={}
              contentWrapperStyle={Styles.wrapper}
              backgroundColor="transparent"
            >
              <TouchableWithoutFeedback style={{ flex: 1 }}>
                <View
                  style={[Styles.body, this.state.editing && Styles.bodyActive]}
                >
                  <View style={Styles.bodyInner}>
                    <Text style={Styles.topText}>
                      Bắt đầu trải nghiệm cùng iSalon
                    </Text>
                    <TouchableOpacity
                      onPress={this._submit}
                      style={Styles.phonebtn}
                    >
                      <ImageBackground
                        style={Styles.bg}
                        source={require('../../assets/images/backgroud_button.png')}
                      />
                      <Icon style={Styles.phoneIcon} name={'phone'} />
                      <Text style={Styles.phoneText}>Số điện thoại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this._facebookLogin}
                      style={Styles.facebook}
                    >
                      <Icon style={Styles.facebookIcon} name={'facebook'} />
                      <Text style={Styles.facebookText}>
                        Tiếp tục với Facebook
                      </Text>
                    </TouchableOpacity>
                    <Text style={Styles.agrees}>
                      Tôi đồng ý với điều kiện và điều khoản{'\n'}
                      sử dụng của iSalon
                    </Text>
                    {/* <TouchableOpacity
                      onPress={this._submit}
                      activeOpacity={this.state.phone.trim() !== '' ? 0.5 : 1}
                      style={[Styles.submit, this.state.phone.trim() !== '' && Styles.submitActive]}>
                      <Text style={Styles.submitText}>Tiếp tục</Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <WALoading show={this.props.account.fetching} />
            </PageContainer>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  renderLoginPhoneNumber = () => {
    return <LoginPhoneNumber loggedInWithUser={this.loggedInWithUser} />;
  };

  render() {
    return this.state.isVerifyScreenVisible
      ? this.renderLoginPhoneNumber()
      : this.renderMainScreen();
  }
}

export default connect(
  state => {
    return {
      account: state.account
    };
  },
  { updateAccountInfo, loginWithOldTokenV2 } //API
)(LoginV2Screen);

const Styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white'
  },
  bg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover'
  },
  closeView: {
    zIndex: 2,
    position: 'absolute',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  closeIcon: {
    height: 35,
    width: 35,
    marginLeft: 5
  },
  bodyView: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  body: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  bodyActive: {
    backgroundColor: 'transparent' //white
  },
  bodyInner: {
    backgroundColor: 'white',
    minHeight: 250,
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10
  },
  topText: {
    marginTop: 30,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    marginBottom: 20
  },
  phone: {
    height: 50,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  phonebtn: {
    height: 50,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    //backgroundColor: Colors.PRIMARY,//'#E5E5E5'
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  phoneInput: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 17,
    alignSelf: 'center',
    textAlign: 'center'
  },
  phoneIcon: {
    color: 'white',
    fontSize: 26,
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20
  },
  phoneText: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginRight: 40
  },
  facebook: {
    height: 50,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#334C94',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10
  },
  facebookText: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginRight: 40
  },
  facebookIcon: {
    color: 'white',
    fontSize: 26,
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20
  },
  agrees: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    textAlign: 'center',
    color: Colors.SILVER_DARK,
    marginBottom: 30
  },
  submit: {
    backgroundColor: '#CCCCCC',
    height: 60,
    width: '100%',
    marginBottom: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitActive: {
    backgroundColor: Colors.PRIMARY
  },
  submitText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 22,
    color: 'white'
  },
  buttonIgnore: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#715935',
    marginLeft: 5,
    marginBottom: 5,
    color: '#fff',
    borderRadius: 20
  }
});

import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CodeInput from 'react-native-code-input';
import PageContainer from "../../components/PageContainer";
import { connect } from 'react-redux';
import GlobalStyles from '../../styles/GlobalStyles';
import Colors from '../../styles/Colors';
import Permissions from 'react-native-permissions'

type Props = {};
class LoginPhoneConfirmNewScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      countDown: 60
    }
  }

  componentDidMount(): void {
    this._runTimer();
  }

  componentWillUnmount(): void {
    clearInterval(this.timer);
  }

  _runTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ countDown: 60 }, () => {
      this.timer = setInterval(() => {
        let t = this.state.countDown - 1;
        if (t < 0) {
          clearInterval(this.timer);
        } else {
          this.setState({ countDown: t });
        }
      }, 1000);
    });
  };

  //Event click button confirm code
  _submit = () => {
    let code = this._getCode().trim();
    if (code.length === 6) {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      //'ủy quyền', 'bị từ chối', 'bị hạn chế' hoặc 'không xác định'
      //Permissions.check('notification').then(response => {
      //  this.setState({ notificationPermission: response })  
      //})
      
      // API confirm code 
      var navigation = this.props.navigation;
      navigation.navigate('ask_noti_permission');
    }
  };

  //Event click button resend code
  _resendCode = () => {
    if (this.state.countDown <= 0) {
      // do resend code
    }
    else{
      // API resend code
    }
  };

  _getCode = () => {
    let code = '';
    if (this.code) {
      this.code.state.codeArr.every((str) => {
        code += str;
        return true;
      })
    }
    return code;
  };

  render() {
    let code = this._getCode();
    let phone = this.props.navigation.getParam('phone') ? this.props.navigation.get('phone') : '+84949562456';
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        <PageContainer
          darkTheme={true}
          navigation={this.props.navigation}
          navigationClose={true}
          contentWrapperStyle={Styles.wrapper}
          layoutPadding={15}
        >
          <Text style={Styles.pageTitle}>Xác nhận</Text>
          <Text style={Styles.pageDesc}>Mã OTP đã được gửi vào{'\n'}
            số điện thoại của bạn</Text>
          <Text style={Styles.phone}>{phone}</Text>
          <View style={Styles.codes}>
            <CodeInput
              ref={ref => this.code = ref}
              activeColor="rgba(49, 180, 4, 1)"
              inactiveColor="rgba(49, 180, 4, 1.3)"
              autoFocus={true}
              inputPosition="center"
              size={26}
              codeLength={6}
              containerStyle={Styles.codesContainer}
              codeInputStyle={Styles.codeInputStyle}
              onFulfill={(code) => this.setState({ code })}
            />
          </View>
          <Text style={Styles.note}>Nhập mã</Text>
          <TouchableOpacity
            onPress={this._submit}
            activeOpacity={code.trim().length === 6 ? 0.5 : 1}
            style={[Styles.submit, code.trim().length === 6 && Styles.submitActive]}>
            <Text style={Styles.submitText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={this.state.countDown <= 0 ? 0.5 : 1}
            onPress={this._resendCode}
            style={Styles.resend}>
            <Text style={Styles.resendText}>Gửi
              lại {this.state.countDown > 0 ? '( ' + this.state.countDown + ' )' : undefined}</Text>
          </TouchableOpacity>
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
  }, 
  {} //API
)(LoginPhoneConfirmNewScreen);


const Styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 30
  },
  pageTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 24,
    color: Colors.DARK,
    fontWeight: 'bold',
    marginBottom: 24
  },
  pageDesc: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 10
  },
  phone: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 20
  },
  codesContainer: {},
  codes: {
    height: 40,
    marginBottom: 20
  },
  codeInputStyle: {
    borderWidth: 1,
    borderColor: Colors.TRANSPARENT,
    borderBottomColor: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 20,
    color: Colors.DARK
  },
  note: {
    color: Colors.SILVER,
    textAlign: 'center',
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    marginBottom: 30
  },
  submit: {
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginBottom: 15
  },
  submitActive: {
    backgroundColor: Colors.PRIMARY,
  },
  submitText: {
    color: 'white',
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 20,
    fontWeight: 'bold'
  },
  resend: {
    alignSelf: 'center'
  },
  resendText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.SILVER
  }
});

import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import PageContainer from "../../components/PageContainer";
import { connect } from 'react-redux';
import GlobalStyles from '../../styles/GlobalStyles';
import NewUserFormStyles from '../../styles/NewUserFormStyles';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Colors from '../../styles/Colors';
import Permissions from 'react-native-permissions'

type Props = {};
class AskNotiPermissionScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  componentDidMount() {
    if (Platform.OS === "ios") {
      Permissions.check('notification').then(response => {
        if(response === 'authorized') {
          this._goToMainScreen();
        }
      });
    }else if (Platform.OS === "android") {
    }
  };

  _OnNotification = () => {
    if (Platform.OS === "ios") {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      //'ủy quyền', 'bị từ chối', 'bị hạn chế' hoặc 'không xác định'
      //Permissions.check('notification').then(response => {
      //  this.setState({ notificationPermission: response })  
      //})
      Permissions.request('notification', { type: ['alert', 'badge'] }).then(response => {
        if(response === 'authorized') {
          this._goToMainScreen();
        }else {
          Alert.alert (
            'Thông báo', "Vui lòng cấp quyền truy cập thông báo cho ứng dụng trong cài đặt !",
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'OK', onPress: () => {Permissions.openSettings()}},
            ],
            { cancelable: true }
          )  
        }
      })
    }else if (Platform.OS === "android") {
      this._goToMainScreen();
    }
  };

  _OffNotification = () => {
    this._goToMainScreen();
  };

  _goToMainScreen = () => {
    var navigation = this.props.navigation;
    navigation.replace('home');
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        <PageContainer
          darkTheme={true}
          // navigation={this.props.navigation}
          navigationClose={false}
          contentWrapperStyle={Styles.container}
        >
          <View style={Styles.body}>
            <Image source={require('../../assets/images/icon_ask_noti.png')} />
            <Text style={Styles.pageTitle}>Bật thông báo?</Text>
            <Text style={Styles.content}>
              Chúng tôi có thể cho bạn biết khi có
              ai đó thông báo cho bạn hoặc thông báo
              cho bạn về các hoạt động tài khoản
              quan trọng khác.
            </Text>
            <TouchableOpacity style={[Styles.button, Styles.buttonActive]} onPress={this._OnNotification}>
              <Text style={[Styles.buttonText, Styles.buttonActiveText]}>Có, thông báo cho tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Styles.button]} onPress={this._OffNotification}>
              <Text style={[Styles.buttonText]}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>
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
)(AskNotiPermissionScreen);


const Styles = StyleSheet.create({
  container: {
    height: 50 + getStatusBarHeight(),
    paddingTop: getStatusBarHeight(),
  },
  body: {
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50
  },
  pageTitle: {
    marginTop: 30,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.DARK,
    marginBottom: 30
  },
  content: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 50
  },
  button: {
    height: 50,
    justifyContent: 'center',
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20
  },
  buttonText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.DARK
  },
  buttonActive: {
    backgroundColor: Colors.PRIMARY
  },
  buttonActiveText: {
    color: 'white'
  }
});

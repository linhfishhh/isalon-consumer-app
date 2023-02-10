import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  Image,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { connect } from 'react-redux';
import {
  loginWithOldToken,
  loginWithOldTokenV2
} from '../redux/account/actions';
import firebase from 'react-native-firebase';

type Props = {};
class AccountCheckingScreen extends Component<Props> {
  componentDidMount() {
    //this.props.loginWithOldToken();
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser
        .getIdToken(true)
        .then(idToken => {
          this.props.loginWithOldTokenV2(
            idToken,
            currentUser.phoneNumber,
            currentUser.email,
            success => {
              if (this.props.account.startupRoute !== undefined) {
                var navigation = this.props.navigation;
                navigation.replace('home'); //this.props.account.startupRoute
              }
            },
            error => {
              var navigation = this.props.navigation;
              navigation.replace('new_login');
            }
          );
        })
        .catch(error => {});
    } else {
      this.props.loginWithOldToken();
    }
  }

  componentDidUpdate() {
    if (this.props.account.startupRoute !== undefined) {
      var navigation = this.props.navigation;
      navigation.replace(this.props.account.startupRoute);
    }
  }

  render() {
    return (
      <View style={Styles.main}>
        {/* <ImageBackground style={Styles.bg} source={require('../assets/images/ISALON-05.png')}/> */}
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        {/* <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FC5D41'}}>
                        <Image style={{
                            width: Dimensions.get('window').width,
                            resizeMode: 'contain'
                        }}  source={require('../assets/images/ISALON-03.png')}/>
                </View> */}
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      account: state.account
    };
  },
  { loginWithOldToken, loginWithOldTokenV2 } //API
)(AccountCheckingScreen);

const Styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  bg: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover'
  }
});

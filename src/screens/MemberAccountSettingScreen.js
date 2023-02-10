import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getVersion } from 'react-native-device-info';
import { connect } from 'react-redux';
import PageContainer from '../components/PageContainer';
import GlobalStyles from '../styles/GlobalStyles';
import Colors from '../styles/Colors';
import { updateInfo } from '../redux/account/actions';

type Props = {};
class MemberAccountSettingScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _renderSettings = () => {
    let items = [
      {
        title: 'Đổi mật khẩu',
        desc: '',
        icon: true,
        action: () => {
          this.props.navigation.navigate('home_account_change_pass');
        },
        requireLogin: true
      },
      {
        title: 'Màn hình mặt định',
        desc: 'Chọn màn hình mặc định khi đăng nhập',
        icon: true,
        action: () => {
          this.props.navigation.navigate('home_account_default');
        },
        requireLogin: false
      },
      {
        title: 'Điều khoản dịch vụ',
        desc: 'Các quy định sử dụng và bảo mật của ứng dụng',
        icon: true,
        action: () => {
          this.props.navigation.navigate('home_account_tos');
        },
        requireLogin: false
      },
      {
        title: 'Khởi tạo cấu hình',
        desc: 'Phục hồi cấu hình mặc định',
        icon: false,
        action: () => {
          Alert.alert(
            'iSalon',
            'Bạn có chắc muốn khởi tạo lại?',
            [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                onPress: async () => {
                  await AsyncStorage.multiRemove(
                    ['@iSalon:welcomed', '@iSalon:tabIndex']
                  );
                  this.props.updateInfo({
                    tabIndex: 0
                  });
                  Alert.alert('iSalon', 'Đã khởi tạo thành công');
                }
              }
            ],
            { cancelable: false }
          );
        },
        requireLogin: false
      }
    ];
    if (!this.props.account.token) {
      items = items.filter(item => {
        return !item.requireLogin;
      });
    }
    return items.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={item.action}
          key={index}
          style={[
            Styles.setting,
            index === 0 ? Styles.settingFirst : undefined
          ]}
        >
          <View style={Styles.settingTextWrapper}>
            <Text style={Styles.settingText}>{item.title}</Text>
            {item.desc ? (
              <Text style={Styles.settingDesc}>{item.desc}</Text>
            ) : (
              undefined
            )}
          </View>
          {item.icon ? (
            <View style={Styles.settingIconWrapper}>
              <Icon style={Styles.settingIcon} name={'angle-right'} />
            </View>
          ) : (
            undefined
          )}
        </TouchableOpacity>
      );
    });
  };
  render() {
    return (
      <PageContainer
        darkTheme={true}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationClose={true}
        navigationButtonStyle={Styles.closeButton}
        layoutPadding={30}
      >
        <View style={Styles.pageWrapperInner}>
          <View style={Styles.title}>
            <Text style={Styles.titleText}>Cài đặt</Text>
          </View>
          <View style={Styles.settings}>{this._renderSettings()}</View>
          <View style={Styles.accountInfoWrapper}>
            <Text style={Styles.appInfo}>
              <Text style={Styles.appInfoVersion}>V.{getVersion()}</Text> Phát
              triển bởi team iSalon
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              let url = '';
              if (Platform.OS === 'ios') {
                url = 'itms-apps://itunes.apple.com/us/app/id1439284821?mt=8';
              } else {
                url = 'market://details?id=com.isalonbooking';
              }
              try {
                Linking.openURL(url);
              } catch (e) {
              }
            }}
          >
            <Text style={Styles.feedback}>Phản hồi về app</Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    );
  }
}

export default connect(
  state => {
    return {
      account: state.account
    };
  },
  {
    updateInfo
  }
)(MemberAccountSettingScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 0,
    alignItems: 'flex-start'
  },
  pageWrapperInner: {
    flex: 1,
    width: '100%'
  },
  closeButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME
  },
  title: {
    marginBottom: 50
  },
  titleText: {
    fontSize: 34,
    color: Colors.TEXT_DARK,
    fontWeight: 'bold',
    fontFamily: GlobalStyles.FONT_NAME
  },
  settings: {
    //flex: 1
  },
  setting: {
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingFirst: {
    borderTopWidth: 0
  },
  settingTextWrapper: {
    flex: 1
  },
  settingText: {
    color: Colors.TEXT_DARK,
    fontSize: 17,
    fontFamily: GlobalStyles.FONT_NAME
  },
  settingDesc: {
    color: Colors.SILVER,
    fontSize: 11,
    marginTop: 5,
    fontFamily: GlobalStyles.FONT_NAME
  },
  settingIconWrapper: {
    paddingLeft: 30,
    paddingRight: 30
  },
  settingIcon: {
    fontSize: 20,
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME
  },
  appInfo: {
    fontSize: 11,
    color: Colors.TEXT_LINK,
    fontFamily: GlobalStyles.FONT_NAME
  },
  appInfoVersion: {
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME
  },
  accountInfoWrapper: {
    marginTop: 30,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10
  },
  feedback: {
    color: Colors.TEXT_LINK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME
  }
});

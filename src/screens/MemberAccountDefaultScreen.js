import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PageContainer from '../components/PageContainer';
import GlobalStyles from '../styles/GlobalStyles';
import Colors from '../styles/Colors';
import NewUserFormStyles from '../styles/NewUserFormStyles';
import { connect } from 'react-redux';
import {
  createAccount,
  updateJoinTOS,
  updateStartupRoute,
  updateInfo
} from '../redux/account/actions';
import { DotIndicator } from 'react-native-indicators';
import Utils from '../configs';
import ImageSources from '../styles/ImageSources';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {};
class MemberAccountDefaultScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.account.tabIndex,
      items: [
        {
          id: 0,
          icon: ImageSources.SVG_ICON_SEARCH_ACTIVE,
          title: 'Màn hình bản đồ địa điểm các salon'
        },
        {
          id: 1,
          icon: ImageSources.SVG_ICON_HOME_ACTIVE,
          title: 'Màn hình trang chủ của ứng dụng'
        },
        {
          id: 2,
          icon: ImageSources.SVG_ICON_SHOP_ACTIVE,
          title: 'Màn hình trang sản phẩm'
        },
        {
          id: 3,
          icon: ImageSources.SVG_ICON_HISTORY_ACTIVE,
          title: 'Màn hình các đặt chỗ sẽ thực hiện'
        },
        {
          id: 4,
          icon: ImageSources.SVG_ICON_ACCOUNT_ACTIVE,
          title: 'Màn hình tài khoản và cài đặt'
        }
      ]
    };
  }

  _save = async () => {
    try {
      await AsyncStorage.setItem('@iSalon:tabIndex', this.state.selected + '');
      this.props.updateInfo({
        tabIndex: this.state.selected
      });
      this.props.navigation.goBack();
    } catch (error) {
      return Promise.reject({
        title: 'Lỗi không xác định',
        message: 'Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại'
      });
    }
  };

  _renderItem = ({ item }) => {
    return (
      <View style={Styles.item}>
        <TouchableOpacity
          hitSlop={{
            top: 30,
            bottom: 30,
            left: 30,
            right: 30
          }}
          onPress={() => {
            this.setState({
              selected: item.id
            });
          }}
          style={Styles.itemButton}
        >
          {item.icon}
          <Text style={Styles.itemText}>{item.title}</Text>
          <View style={Styles.checker}>
            {this.state.selected === item.id ? (
              <Icon style={Styles.itemIcon} name={'check-circle'} />
            ) : (
              undefined
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <PageContainer
        darkTheme={true}
        navigationButtonStyle={{ color: Colors.PRIMARY }}
        contentWrapperStyle={[
          GlobalStyles.pageWrapper,
          NewUserFormStyles.pageWrapper,
          { justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 0 }
        ]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        layoutPadding={20}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              this._save();
            }}
            hitSlop={{ top: 30, bottom: 30, right: 30, left: 30 }}
          >
            <Text style={Styles.save}>Lưu</Text>
          </TouchableOpacity>
        }
      >
        <View style={{ paddingLeft: 20 }}>
          <View style={Styles.title}>
            <Text style={Styles.titleText}>Màn Hình mặc định</Text>
            <Text style={[Styles.titleTextSub]}>
              Chọn màn hình mặc định khi bạn đăng nhập vào app thuận tiện nhất
              cho bạn
            </Text>
          </View>
          <FlatList
            data={this.state.items}
            extraData={this.state}
            keyExtractor={(item, index) => {
              return 'item' + index;
            }}
            renderItem={this._renderItem}
            style={Styles.list}
          />
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
)(MemberAccountDefaultScreen);

const Styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    paddingRight: 20
  },
  titleText: {
    fontSize: 34,
    color: Colors.TEXT_DARK,
    fontWeight: 'bold',
    fontFamily: GlobalStyles.FONT_NAME
  },

  titleTextSub: {
    fontSize: 14,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    marginTop: 5
  },
  titleTextSubError: {
    color: Colors.ERROR
  },
  save: {
    fontSize: 18,
    fontFamily: this.FONT_NAME,
    color: Colors.PRIMARY
  },
  item: {
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemText: {
    flex: 1,
    marginLeft: 15
  },
  checker: {
    width: 50
    //backgroundColor: 'red'
  },
  itemIcon: {
    fontSize: 25,
    color: '#00a307'
  }
});

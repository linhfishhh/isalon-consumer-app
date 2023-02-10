import React, { PureComponent } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import HomeSectionPageContainer from '../components/HomeSectionPageContainer';
import Colors from '../styles/Colors';
import GlobalStyles from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WAAvatar from '../components/WAAvatar';
import { connect } from 'react-redux';
import { DotIndicator } from 'react-native-indicators';
import WAEmptyPage from '../components/WAEmptyPage';
import { loadWaitingHistory } from '../redux/history/actions';
import Utils from '../configs';

class MemberHistoryScreen extends PureComponent {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      items: []
    };
  }

  componentDidMount() {}

  _renderItem = data => {
    let item = data.item;
    let itemStatus = Utils.getBookingStatus(item.status);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.route.navigation.navigate('home_order_detail', {
            id: item.id
          });
        }}
        style={Styles.item}
      >
        <Text style={Styles.itemID}>#{item.id}</Text>
        <View style={Styles.itemDateTime}>
          <View style={Styles.itemTimeWrapper}>
            <Text style={Styles.itemTime}>{item.time}</Text>
          </View>
          <Text style={Styles.itemDate}>{item.date}</Text>
        </View>
        <View style={Styles.itemInfo}>
          <Text style={Styles.itemTitle}>{item.service}</Text>
          <View style={Styles.itemMinuteSalon}>
            <Text style={Styles.itemMinute}>{item.service_times} phút</Text>
            <Icon style={Styles.itemDot} name={'lens'} />
            <Text numberOfLines={1} style={Styles.itemSalon}>
              {item.salon.name}
            </Text>
          </View>
          <Text style={Styles.itemAddress}>{item.salon.address}</Text>
          <View style={Styles.itemStatus}>
            <Text style={Styles.itemStatusLabel}>Tình trạng</Text>
            <Icon
              name={itemStatus.name}
              style={[Styles.itemIcon, { color: itemStatus.color }]}
            />
            <Text style={Styles.itemStatusText}>{itemStatus.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onRefresh = () => {
    this.setState({ refreshing: false }, () => {
      if (!this.props.account.token) {
        return false;
      }
      this.props.loadWaitingHistory(true);
    });
  };

  render() {
    return (
      <HomeSectionPageContainer style={Styles.container}>
        {this.props.history.fetching ? (
          <DotIndicator count={3} color={Colors.PRIMARY} size={10} />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            ListHeaderComponent={
              this.props.history.data.total > 0 ? (
                <View style={Styles.accountInfo}>
                  <View style={Styles.accountInfoNameWrapper}>
                    <Text numberOfLines={1} style={Styles.accountInfoName}>
                      {this.state.accountName}
                    </Text>
                    <Text style={Styles.headerTitle}>
                      Hiện bạn có {this.props.history.data.total} đặt chỗ{'\n'}
                      sẽ thực hiện
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.route.navigation.navigate(
                        'home_account_profile'
                      );
                    }}
                    style={Styles.avatarWrapper}
                  >
                    <WAAvatar style={Styles.avatar} />
                  </TouchableOpacity>
                </View>
              ) : (
                undefined
              )
            }
            keyExtractor={(item, index) => {
              return '' + index;
            }}
            data={this.props.history.data.orders}
            renderItem={this._renderItem}
            ListEmptyComponent={
              !this.props.history.fetching ? (
                <WAEmptyPage
                  title={'Đặt chỗ sẽ làm'}
                  subTitle={
                    !this.props.account.token ? (
                      <Text style={Styles.commonText}>
                        Vui lòng{' '}
                        <Text
                          style={Styles.clickable}
                          onPress={() => {
                            this.props.route.navigation.navigate('new_login', {
                              hasBack: true
                            });
                          }}
                        >
                          đăng nhập
                        </Text>{' '}
                        để quản lý các đặt chỗ sẽ thực hiện sắp tới tại đây nhé!
                      </Text>
                    ) : (
                      <Text style={Styles.commonText}>
                        Bạn chưa có đơn đặt chỗ nào sẽ thực hiện sắp tới, khi
                        nào có chúng sẽ hiển thị tại đây
                      </Text>
                    )
                  }
                  style={Styles.emptyPage}
                />
              ) : (
                undefined
              )
            }
          />
        )}
      </HomeSectionPageContainer>
    );
  }
}

export default connect(
  state => {
    return {
      account: state.account,
      history: state.history
    };
  },
  {
    loadWaitingHistory
  }
)(MemberHistoryScreen);

const Styles = StyleSheet.create({
  commonText: {
    fontSize: 16
  },
  clickable: {
    fontWeight: 'bold',
    color: Colors.PRIMARY
  },
  itemID: {
    fontSize: 10,
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    position: 'absolute',
    backgroundColor: Colors.PRIMARY,
    right: 0,
    top: 0,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomLeftRadius: 5
  },
  container: {
    paddingLeft: 30,
    paddingRight: 30
  },
  avatarWrapper: {},
  avatar: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 35
  },
  accountInfo: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30
  },
  accountInfoName: {
    fontSize: 30,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold'
  },
  accountInfoNameWrapper: {
    flex: 1
  },
  accountInfoLink: {},
  accountInfoLinkText: {
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME
  },
  headerTitle: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    marginTop: 5
  },
  item: {
    borderRadius: 3,
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderRightWidth: 1,
    borderRightColor: Colors.SILVER_LIGHT,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.DARK,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowRadius: 5,
    backgroundColor: Colors.LIGHT,
    shadowOpacity: 0.1
  },
  itemDateTime: {
    paddingRight: 15
  },
  itemTime: {
    color: Colors.PRIMARY,
    fontSize: 24,
    fontFamily: GlobalStyles.FONT_NAME
  },
  itemTimeWrapper: {
    borderBottomColor: Colors.PRIMARY,
    borderBottomWidth: 1,
    marginBottom: 5
  },
  itemDate: {
    fontSize: 12,
    borderBottomColor: Colors.DARK,
    fontFamily: GlobalStyles.FONT_NAME
  },
  itemInfo: {
    borderLeftColor: Colors.SILVER_LIGHT,
    borderLeftWidth: 1,
    paddingLeft: 15,
    flex: 1
  },
  itemTitle: {
    color: Colors.TEXT_DARK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME
  },
  itemMinuteSalon: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemDot: {
    color: Colors.SILVER,
    fontSize: 4,
    marginLeft: 3,
    marginRight: 3
  },
  itemMinute: {
    color: Colors.SILVER,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME
  },
  itemSalon: {
    color: Colors.TEXT_DARK,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    overflow: 'hidden',
    flex: 1
  },
  itemAddress: {
    color: Colors.SILVER,
    fontSize: 8,
    fontFamily: GlobalStyles.FONT_NAME,
    marginBottom: 5
  },
  itemStatus: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemStatusLabel: {
    color: Colors.SILVER,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    marginRight: 10
  },
  itemIcon: {
    fontSize: 13,
    marginRight: 3
  },
  itemStatusText: {
    color: Colors.TEXT_LINK,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME
  }
});

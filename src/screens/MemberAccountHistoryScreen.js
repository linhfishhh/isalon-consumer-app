import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import HomeSectionPageContainer from '../components/HomeSectionPageContainer';
import ImageSources from '../styles/ImageSources';
import Colors from '../styles/Colors';
import GlobalStyles from '../styles/GlobalStyles';
import PageContainer from '../components/PageContainer';
import WAAlert from '../components/WAAlert';
import Image from 'react-native-svg/elements/Image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WALoading from '../components/WALoading';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator
} from 'react-native-indicators';
import WAEmptyPage from '../components/WAEmptyPage';

import Utils from '../configs';
import { connect } from 'react-redux';

class MemberAccountHistoryScreen extends PureComponent {
  static defaultProps = {
    perPage: 10
  };
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      scrollY: 0,
      isLastPage: false,
      currentPage: 0,
      loadingItems: false,
      items: [],
      selected: [],
      deleteAlert: false
    };
  }
  _loadItem(refresh = false) {
    if (this.state.isLastPage && !refresh) {
      return;
    }
    if (this.state.loadingItems) {
      return;
    }
    this.setState(
      {
        loadingItems: true
      },
      async () => {
        try {
          let items = refresh ? [] : this.state.items;
          let rq = await Utils.getAxios(this.props.account.token).post(
            'booking/history',
            {
              page: this.state.currentPage + 1
            }
          );
          this.setState({
            items: items.concat(rq.data.items),
            loadingItems: false,
            currentPage: rq.data.currentPage,
            isLastPage: rq.data.isLastPage
          });
        } catch (e) {
          this.setState({
            loadingItems: false
          });
        }
      }
    );
  }
  _showLoadingItems() {
    let rs = [];
    for (var i = 1; i <= this.props.perPage; i++) {
      rs.push(
        <View
          key={'loading-item-' + i}
          style={[Styles.item, Styles.loadingItem]}
        >
          <View style={Styles.itemTitleWrapper}>
            <View style={Styles.itemTitlePhd} />
          </View>
          <View style={Styles.itemId}>
            <View style={Styles.itemIdPhd} />
          </View>
          <View style={Styles.itemDatePhd} />
          <View style={Styles.itemStatus}>
            <View style={Styles.itemStatusLabel}>
              <View style={Styles.itemStatusLabelPhd} />
            </View>
            <View style={Styles.itemStatusInfo}>
              <View style={Styles.itemStatusInfoPhd} />
            </View>
          </View>
        </View>
      );
    }
    return rs;
  }
  componentDidMount() {
    this._loadItem(true);
  }
  render() {
    return (
      <PageContainer
        darkTheme={true}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationClose={true}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={this.state.scrollY > 0 ? 'Lịch sử đặt chỗ' : undefined}
        layoutPadding={30}
        rightComponent={
          this.state.loadingItems ? (
            <DotIndicator size={6} count={3} color={Colors.PRIMARY} />
          ) : (
            <View />
          )
        }
        keyboardAvoid={false}
      >
        <FlatList
          style={this.state.scrollY > 0 ? Styles.scrollActived : Styles.scroll}
          onScroll={event => {
            this.setState({
              scrollY: event.nativeEvent.contentOffset.y
            });
          }}
          ListFooterComponent={() => {
            return this.state.loadingItems ? (
              this._showLoadingItems()
            ) : (
              <View />
            );
          }}
          ListHeaderComponent={
            <View style={Styles.pageHeader}>
              <Text style={Styles.pageHeaderTitle}>Lịch sử đặt chỗ</Text>
            </View>
          }
          onEndReached={() => {
            this._loadItem();
          }}
          onEndReachedThreshold={0.1}
          //extraData={this.state}
          keyExtractor={(item, index) => {
            return '' + index;
          }}
          data={this.state.items}
          ListEmptyComponent={
            !this.state.loadingItems ? (
              <WAEmptyPage
                title={'Không tìm thấy mẫu tin nào'}
                subTitle={
                  'Bạn chưa có đơn đặt chỗ nào, khi bạn tạo một đơn đặt chỗ, nó sẽ xuất hiện tại đây'
                }
                style={Styles.emptyPage}
              />
            ) : (
              undefined
            )
          }
          renderItem={({ item }) => {
            return <Item navigation={this.props.navigation} data={item} />;
          }}
        />
      </PageContainer>
    );
  }
}

export default connect(state => {
  return {
    account: state.account
  };
})(MemberAccountHistoryScreen);

class Item extends React.PureComponent {
  render() {
    let item = this.props.data;
    let itemStatus = Utils.getBookingStatus(item.status);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('home_order_detail', {
            id: item.id
          });
        }}
        style={Styles.item}
      >
        <View style={Styles.itemTitleWrapper}>
          <Text
            style={Styles.itemService}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {item.service}
          </Text>
          <Text
            style={Styles.itemSalon}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            <Text style={Styles.itemAt}>Tại</Text>
            {'  ' + item.salon}
          </Text>
        </View>
        <View style={Styles.itemId}>
          <Text style={Styles.itemIdTitle}>Mã đơn hàng:</Text>
          <Text style={Styles.itemIdText}>{item.id}</Text>
        </View>
        <Text style={Styles.itemDate}>Ngày đặt chỗ: {item.date}</Text>
        <View style={Styles.itemStatus}>
          <Text style={Styles.itemStatusLabel}>Trạng thái:</Text>
          <View style={Styles.itemStatusInfo}>
            <Text style={Styles.itemStatusText}>{itemStatus.text}</Text>
            <Icon
              style={[Styles.itemStatusIcon, { color: itemStatus.color }]}
              name={itemStatus.name}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const Styles = StyleSheet.create({
  pageWrapper: {
    justifyContent: 'flex-start',
    //backgroundColor: Colors.LIGHT,
    paddingLeft: 0,
    paddingRight: 0
  },
  closeButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME
  },
  pageHeaderTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 30
  },
  pageHeader: {
    paddingBottom: 0
  },
  items: {},
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingLeft: 30,
    paddingRight: 30
  },
  itemTitleWrapper: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 2
  },
  itemTitlePhd: {
    height: 12,
    backgroundColor: Colors.SILVER_LIGHT,
    width: 200,
    marginBottom: 5
  },
  itemIdPhd: {
    height: 10,
    backgroundColor: Colors.SILVER_LIGHT,
    width: 180,
    marginBottom: 5
  },
  itemDatePhd: {
    height: 10,
    backgroundColor: Colors.SILVER_LIGHT,
    width: 190,
    marginBottom: 10
  },
  itemStatusLabelPhd: {
    height: 10,
    backgroundColor: Colors.SILVER_LIGHT,
    width: 50,
    flex: 1
  },
  itemStatusInfoPhd: {
    height: 10,
    backgroundColor: Colors.SILVER_LIGHT,
    width: 50
  },
  itemService: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5
  },
  itemAt: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5
  },
  itemSalon: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    fontSize: 15,
    fontWeight: 'bold'
  },

  itemId: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },

  itemIdTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
    fontSize: 13,
    marginRight: 5
  },
  itemIdText: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_LINK,
    fontSize: 15,
    fontWeight: 'bold'
  },
  itemDate: {
    marginBottom: 10,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
    fontSize: 13
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemStatusLabel: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
    fontSize: 13,
    flex: 1
  },
  itemStatusText: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
    fontSize: 13
  },
  itemStatusIcon: {
    marginLeft: 5,
    fontSize: 15
  },

  scroll: {
    flex: 1,
    paddingLeft: 0
  },
  scrollActived: {
    flex: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    paddingLeft: 0
  },
  emptyPage: {
    paddingRight: 30,
    paddingLeft: 30
  }
});

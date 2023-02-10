import React, { Component, PureComponent } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl
} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import WAStars from "../components/WAStars";
import Icon from 'react-native-vector-icons/FontAwesome';
import WAAlert from "../components/WAAlert";
import { connect } from 'react-redux';
import { DotIndicator } from 'react-native-indicators';
import { deleteSalon, deleteShowcase, loadFavData } from "../redux/fav/actions";
import WAEmptyPage from "../components/WAEmptyPage";
import WALightBox from "../components/WALightBox";

class EmptyFavoritedSalon extends PureComponent {
  render() {
    return (
      <View style={Styles.emptyPage}>
        <View style={[Styles.pageHeader]}>
          <Text style={Styles.pageHeaderTitle}>Yêu thích</Text>
          <Text style={Styles.pageHeaderDesc}>
            Nơi lưu lại các salon và các tác phẩm{"\n"}bạn yêu thích.
                                                    {
              !this.props.account.token ?
                <Text> <Text onPress={() => {
                  this.props.navigation.navigate('new_login', { hasBack: true });
                }} style={Styles.clickable}>Đăng nhập</Text> để quản lý các salon và tác phẩm yêu thích nhé!</Text>
                : undefined
            }
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/images/fav_empty.png')}
          />
        </View>
      </View>
    )
  }
}

class MemberFAVScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleteAlert: false,
      editingSalon: false,
      editingGallery: false,
      showLightBox: false,
      lightBoxItems: [],
    };
  }

  _renderItemSalon = ({ item }) => {
    return <SalonItem
      navigation={this.props.navigation}
      onDelete={(item) => {
        this.setState({
          deleteAlert: true
        })
      }}
      editing={this.state.editingSalon} data={item} />
  };
  _renderItemGallery = ({ item }) => {
    return item.id !== -1 ? <GalleryItem
      onDelete={(item) => {
        this.setState({
          deleteAlert: true
        })
      }}
      showLightBox={(items) => {
        this.setState({ showLightBox: true, lightBoxItems: items }
        )
      }}
      editing={this.state.editingGallery}
      data={item} /> : <View style={Styles.gallery} />
  };
  _keyExtractorSalon = (item, index) => {
    return '' + item.id;
  };
  _keyExtractorGallery = (item, index) => {
    return '' + item.id;
  };

  _onRefresh = () => {
    this.setState({ refreshing: false }, () => {
      if (!this.props.account.token) {
        return false;
      }
      this.props.loadFavData(true);
    });
  };

  _loadFavorite = () => {
    this.props.loadFavData(true);
  }

  componentDidMount() {
    this._loadFavorite();
  }

  render() {
    let showcases = this.props.fav.data.showcases.slice(0);
    if (showcases.length % 2 !== 0) {
      if (showcases.length > 0) {
        showcases.push({
          id: -1
        });
      }
    }
    return (
      <View style={Styles.pageWrapperInner}>
        {
          this.props.fav.fetching ?
            <DotIndicator count={3} size={10} color={Colors.PRIMARY} />
            :
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              {
                this.props.fav.data.salons.length > 0 || showcases.length > 0 ?
                  <View>
                    <View style={[Styles.pageHeader]}>
                      <Text style={Styles.pageHeaderDesc}>
                        Nơi lưu lại các salon và các tác phẩm{"\n"}bạn yêu thích.
                                                    {
                          !this.props.account.token ?
                            <Text> <Text onPress={() => {
                              this.props.navigation.navigate('new_login', { hasBack: true });
                            }} style={Styles.clickable}>Đăng nhập</Text> để quản lý các salon và tác phẩm yêu thích nhé!</Text>
                            : undefined
                        }
                      </Text>
                    </View>
                    {
                      this.props.fav.data.salons.length > 0 ?
                        <View>
                          <View style={Styles.listHeader}>
                            <View style={Styles.listHeaderLeft}>
                              <Text style={Styles.listHeaderText}>Salon</Text>
                            </View>
                            <View style={Styles.listHeaderRight}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    editingSalon: !this.state.editingSalon
                                  })
                                }}
                                hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
                              >
                                <Text style={Styles.listHeaderButtonText}>{this.state.editingSalon ? 'Xong' : 'Xóa'}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <FlatList
                            data={this.props.fav.data.salons}
                            renderItem={this._renderItemSalon}
                            keyExtractor={this._keyExtractorSalon}
                            style={Styles.items}
                            extraData={this.state}
                          />
                        </View>
                        : undefined
                    }
                    {
                      showcases.length > 0 ?
                        <View>
                          <View style={[Styles.listHeader, { borderBottomWidth: 0 }]}>
                            <View style={Styles.listHeaderLeft}>
                              <Text style={Styles.listHeaderText}>Tác phẩm</Text>
                            </View>
                            <View style={Styles.listHeaderRight}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    editingGallery: !this.state.editingGallery
                                  })
                                }}
                                hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
                              >
                                <Text style={Styles.listHeaderButtonText}>{this.editingGallery ? 'Xong' : 'Xóa'}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <FlatList
                            data={showcases}
                            renderItem={this._renderItemGallery}
                            keyExtractor={this._keyExtractorGallery}
                            extraData={this.state}
                            style={[Styles.items, Styles.itemsGallery]}
                            numColumns={2}
                          />
                        </View>
                        : undefined
                    }
                  </View>
                  :
                  <EmptyFavoritedSalon
                    account={this.props.account}
                    navigation={this.props.navigation}
                  />
              }
            </ScrollView>
        }
        <WAAlert
          yes={() => { this.setState({ deleteAlert: false }) }}
          no={() => { this.setState({ deleteAlert: false }) }}
          title={'Xóa yêu thích'}
          question={'Bạn muốn xóa yêu thích này khỏi danh sách yêu thích?'}
          show={this.state.deleteAlert} />
        <WALightBox navigation={this.props.navigation} onClose={() => { this.setState({ showLightBox: false }) }} show={this.state.showLightBox}
          items={this.state.lightBoxItems} />
      </View>
    );
  }
}

class IGalleryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false
    };
  }

  render() {
    let item = this.props.data;
    return (
      <View style={Styles.gallery}>
        {
          this.state.deleting ?
            <View style={Styles.deletingOverlay} />
            : undefined
        }
        <TouchableOpacity
          onPress={() => {
            this.props.showLightBox(item.showcase.items.map((slide) => {
              return {
                url: slide.image,
                freeHeight: true
              }
            }))
          }}
        >
          <ImageBackground style={Styles.galleryCoverImage} source={{ uri: item.showcase.cover }} />
        </TouchableOpacity>
        <Text style={Styles.galleryTitle}>{item.showcase.name} của {item.showcase.salon.name}</Text>
        {
          this.props.editing ?
            <TouchableOpacity
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              onPress={() => {
                this.setState({
                  deleting: true
                }, () => {
                  this.props.deleteShowcase(item.id, () => {
                    this.setState({
                      deleting: false
                    });
                  });
                });
              }}
              style={[Styles.salonButtonWrapper, Styles.salonButtonWrapperGallery]}>
              <View style={[Styles.salonButton, Styles.salonButtonGallery]}>
                <Icon style={Styles.salonButtonIcon} name={'minus'} />
              </View>
            </TouchableOpacity>
            : undefined
        }
      </View>
    );
  }
}

const GalleryItem = connect(
  state => {
    return {

    }
  },
  {
    deleteShowcase
  }
)(IGalleryItem);

class ISalonItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
    };
  }
  render() {
    let item = this.props.data;
    return (
      <View style={[Styles.salon]}>
        {
          this.state.deleting ?
            <View style={Styles.deletingOverlay} />
            : undefined
        }
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('home_salon', {
              id: item.salon.id
            })
          }}
          style={Styles.salonCover}>
          <Image style={Styles.salonCoverImage} source={{ uri: item.salon.avatar }} />
        </TouchableOpacity>
        <View style={Styles.salonInfo}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('home_salon', {
                id: item.salon.id
              })
            }}
          >
            <Text style={Styles.salonName} numberOfLines={1} >{item.salon.name}</Text>
          </TouchableOpacity>
          <Text numberOfLines={1} style={Styles.salonAddress}>{item.salon.address}</Text>
          <View style={Styles.salonRating}>
            <WAStars starInfo={item.salon.ratingCount + ' nhận xét & đánh giá'} rating={item.salon.rating} />
          </View>
        </View>
        {
          this.props.editing ?
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  deleting: true
                }, () => {
                  this.props.deleteSalon(item.id, () => {
                    this.setState({
                      deleting: false
                    });
                  });
                });
              }}
              style={Styles.salonButtonWrapper}>
              <View style={Styles.salonButton}>
                <Icon style={Styles.salonButtonIcon} name={'minus'} />
              </View>
            </TouchableOpacity>
            : undefined
        }
      </View>
    )
  }
}

const SalonItem = connect(
  state => {
    return {

    }
  },
  {
    deleteSalon
  }
)(ISalonItem);

export default connect(
  state => {
    return {
      account: state.account,
      fav: state.fav
    }
  },
  {
    loadFavData
  }
)(
  MemberFAVScreen
);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 0,
    alignItems: 'flex-start',
  },
  closeButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME
  },
  pageWrapperInner: {
    flex: 1,
    width: '100%',
    paddingLeft: 40,
    paddingRight: 0,
  },
  clickable: {
    fontWeight: 'bold',
    color: Colors.PRIMARY
  },
  deletingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.LIGHT,
    zIndex: 1,
    opacity: 0.8
  },
  emptyPage: {
    paddingRight: 0
  },
  container: {
    paddingRight: 0,
    paddingLeft: 30
  },
  pageHeaderTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10
  },
  pageHeaderDesc: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
    fontSize: 16
  },
  pageHeader: {
    marginTop: 30,
    marginBottom: 30,
    paddingRight: 30
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingBottom: 20
  },
  listHeaderLeft: {
    flex: 1
  },
  listHeaderRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  listHeaderButtonText: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    fontSize: 14,
  },
  listHeaderText: {
    fontSize: 25,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: 'bold'
  },
  items: {
    marginBottom: 30
  },
  salon: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingRight: 30
  },
  salonName: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
  },
  salonInfo: {
    flex: 1
  },
  salonAddress: {
    fontSize: 12,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
  },
  salonCover: {
    marginRight: 15
  },
  salonCoverImage: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  salonButtonWrapper: {
    justifyContent: 'center',
    paddingLeft: 15
  },
  salonButton: {
    height: 24,
    width: 24,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  salonButtonIcon: {
    color: Colors.PRIMARY,
  },
  itemsGallery: {
    paddingRight: 15
  },
  gallery: {
    flex: 1,
    marginRight: 15,
    marginTop: 15,
    position: 'relative',
    marginBottom: 15
  },
  galleryCoverImage: {
    flex: 1,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden'
  },
  salonButtonWrapperGallery: {
    position: 'absolute',
    right: -12,
    top: -12
  },
  salonButtonGallery: {
    backgroundColor: Colors.LIGHT
  },
  galleryTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontSize: 16,
    marginTop: 10
  },
});

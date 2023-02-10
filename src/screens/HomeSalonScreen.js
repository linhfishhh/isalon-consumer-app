import React, { Component, PureComponent } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AutoHeightWebView from 'react-native-webview-autoheight';
import AutoHeightWebViewNew from 'react-native-autoheight-webview'
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import WAStars from "../components/WAStars";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import WAMapBlock from "../components/WAMapBlock";
import WAReviews from "../components/WAReviews";
import WALightBox from "../components/WALightBox";
import { connect } from 'react-redux';
import { DotIndicator } from 'react-native-indicators';
import {
  getSalonDetail,
  updateCurrentSalonDetailLike,
  updateCurrentSalonDetailShowcaseLike,
  updateInfo as updateSearchInfo
} from "../redux/search/actions";
import {updateSalonNewLike} from "../redux/search_tab_latest/actions";
import {updateSalonNearMeLike} from "../redux/search_tab_near_me/actions";
import {updateTopSalonNam} from "../redux/search_custom_salon/actions";
import { NavigationEvents } from "react-navigation";
import numeral from 'numeral';
import { loadSalonReviews } from "../redux/reviews/actions";
import { likeSalon, likeShowcase } from "../redux/likes/actions";
import { addRemoveCartItem, addBooking, updateInfo as updateCartInfo } from "../redux/cart/actions";
import WAAlert from "../components/WAAlert";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import WAServiceOptions from "../components/WAServiceOptions";

type Props = {};
class HomeSalonScreen extends Component<Props> {
  static defaultProps = {
    lightBoxItems: [],
    indexselected: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollY: 0,
      activeTab: 2,
      cartAmount: 0,
      cartSum: 0,
      showLightBox: false,
      lightBoxItems: [],
      alert: false,
      alertTitle: '',
      alertMessage: '',
      loginAlert: false
    }
  }

  //Render navigation bar
  _renderNavBar = () => {
    return <Navbar requireLogin={this.requireLogin} navigation={this.props.navigation}
      hideHeaderTitle={this.state.scrollY < 310} />
  };

  //Render banner
  _renderToolBar = () => {
    return <Toolbar navigation={this.props.navigation}
      showLightBox={(index, items) => {
        this.setState({
          showLightBox: true,
          lightBoxItems: items,
          indexselected: index
        });
      }} />
  };

  //Render content layout
  _renderContent = () => {
    return <Content
      requireLogin={this.requireLogin}
      navigation={this.props.navigation}
      onServiceDetail={this._onServiceDetail}
      showLightBox={(index, items) => {
        this.setState({
          showLightBox: true,
          lightBoxItems: items,
          indexselected: index
        });
      }}
      onCartChange={(add, sum) => {
        let amount = add ? 1 : -1;
        this.setState({
          cartAmount: this.state.cartAmount + amount,
          cartSum: this.state.cartSum + (sum * amount)
        });
      }} changeTab={(index) => {
        this.setState({ activeTab: index })
      }} activeTab={this.state.activeTab} scrollY={this.state.scrollY} />
  };

  _onServiceDetail = () => {
    this.props.navigation.navigate('home_service')
  };

  requireLogin = () => {
    this.setState({
      loginAlert: true
    });
  };

  componentWillUnmount() {
    this.props.updateSearchInfo({
      currentSalon: undefined
    })
  };

  componentDidMount() {
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.LIGHT }}>
        <WAAlert
          title={'Đăng nhập'}
          question={'Vui lòng đăng nhập để sử dụng chức năng này'}
          titleFirst={true}
          show={this.state.loginAlert} yesTitle={'Đăng nhập'} noTitle={'Lần sau'} yes={() => {
            this.setState({ loginAlert: false }, () => {
              this.props.navigation.navigate('accountChecking', { hasBack: true });
            });
          }} no={() => {
            this.setState({ loginAlert: false });
          }} />
        <WAAlert
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onBack={() => {
            this.setState({
              alert: false
            })
          }} show={this.state.alert} title={this.state.alertTitle} question={this.state.alertMessage} titleFirst={true}
          yes={() => {
            this.setState({
              alert: false
            })
          }} no={false} yesTitle={'Đã hiểu'}
        />
        <NavigationEvents
          onDidFocus={payload => {
            if (this.props.search.currentSalon === undefined) {
              this.props.getSalonDetail(this.props.navigation.getParam('id'), (currentSalon) => {
                if (!currentSalon.open) {
                  this.setState({
                    alert: true,
                    alertTitle: 'Salon ngoại tuyến',
                    alertMessage: 'Salon tạm thời ngoại tuyến không tiếp nhận đơn đặt chỗ mới, nếu bạn muốn đặt chỗ xin vui lòng quay lại sau nhé!'
                  })
                }
              });
            }
          }}
        />
        {
          (this.props.cart.fetching || this.props.search.fetching || this.props.search.currentSalon === undefined)
            ?
            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
            :
            <View style={Styles.page}>
              <WALightBox navigation={this.props.navigation}
                onClose={() => {
                  this.setState({ showLightBox: false })
                }}
                show={this.state.showLightBox}
                items={this.state.lightBoxItems}
                indexselected={this.state.indexselected}
              />
              {
                this.state.scrollY >= 310 ?
                  <Tabs
                    changeTab={(index) => {
                      this.setState({ activeTab: index })
                    }}
                    activeTab={this.state.activeTab} float={true} style={Styles.tabsFloat} />
                  : undefined
              }

              <CollapsibleToolbar
                renderContent={this._renderContent}
                renderNavBar={this._renderNavBar}
                renderToolBar={this._renderToolBar}
                collapsedNavBarBackgroundColor={Colors.DARK}
                translucentStatusBar={true}
                toolBarHeight={365}
                style={Styles.container}
                bounces={false}
                onContentScroll={(e) => {
                  this.setState({
                    scrollY: e.nativeEvent.contentOffset.y
                  })
                }}
              />

              {/* Popup đặt chỗ ngay */
                this.props.cart.items.length > 0 && this.props.cart.salonID === this.props.search.currentSalon.id ?
                  <View style={Styles.cart}>
                    <View style={Styles.cartAmount}>
                      {ImageSources.SVG_ICON_CART}
                      <View style={Styles.cartAmountTextWrapper}>
                        <Text style={Styles.cartAmountText}>
                          {this.props.cart.items.length}
                        </Text>
                      </View>
                    </View>
                    <Text style={Styles.cartSum}>{this.props.cart.getTotal()}K</Text>
                    <View style={Styles.cartButtonWrapper}>
                      <TouchableOpacity
                        style={Styles.cartButton} activeOpacity={0.8}
                        onPress={() => {
                          if (!this.props.account.token) {
                            this.requireLogin();
                            return false;
                          }
                          this.props.addBooking((data) => {
                            this.props.updateCartInfo({
                              screenBeforeCart: 'home_salon'
                            });
                            this.props.navigation.navigate('home_cart_one', { bookingInfo: data });
                          });
                        }}>
                        <Text style={Styles.cartButtonText}>Đặt chỗ ngay</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  : undefined
              }
            </View>
        }
      </View>
    )
  };

}

export default connect(
  state => {
    return {
      account: state.account,
      search: state.search,
      cart: state.cart,
    }
  }, {
    getSalonDetail,
    updateSearchInfo,
    updateCartInfo,
    addBooking,
  }
)(HomeSalonScreen);

//Render banner
class IToolbar extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {}
  }

  _renderPagination = (index, total, context) => {
    return (
      <View style={Styles.sliderPager} pointerEvents={'none'}>
        <Text style={Styles.sliderPagerText}>{index + 1}/{total}</Text>
      </View>
    )
  };

  render() {
    let salon = this.props.search.currentSalon;
    return (
      <View>
        <View style={Styles.sliderWrapper}>
          <Swiper style={Styles.slider}
            showsButtons={false}
            loadMinimal={true}
            loadMinimalSize={1}
            renderPagination={this._renderPagination}
            loop={false}
          >
            {
              salon.slides.map((slide, index) => {

                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.showLightBox(index, salon.slides.map((img) => {
                        return {
                          url: img.link,
                          freeHeight: true
                        }
                      }))
                    }}
                    key={index} style={Styles.slide} activeOpacity={0.9}>
                    <ImageBackground
                      style={Styles.slideImage}
                      source={{ uri: slide.thumb }}
                    >
                      <View style={Styles.sliderOverlay} pointerEvents={'none'} />
                    </ImageBackground>
                  </TouchableOpacity>
                )
              })
            }
          </Swiper>
        </View>
        <View style={Styles.salonInfo}>
          <View style={Styles.salonTopInfo}>
            <View style={Styles.salonTopInfoLeft}>
              <Text numberOfLines={1} style={Styles.salonInfoName}>{salon.name}
                {
                  salon.verified ?
                    <Icon style={Styles.salonVerified} name={'check-circle'} />
                    : undefined
                }
              </Text>
              <Text numberOfLines={1} style={Styles.salonInfoAdress}>{salon.address}</Text>
            </View>
            <View style={Styles.salonTopInfoRight}>

            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('salon_reviews', {
                id: this.props.search.currentSalon.id
              });
            }}
            style={Styles.salonRating}>
            <View style={Styles.salonRatingScore}>
              <Text style={Styles.salonRatingScoreText}>{numeral(salon.rating).format('0,000.0')}</Text>
            </View>
            <WAStars
              style={Styles.salonRatingInfo}
              starInfo={salon.ratingCount > 0 ? salon.ratingCount + ' Nhận xét & đánh giá' : 'Chưa có đánh giá nhận xét'}
              rating={salon.rating}
              set={'2'}
            />
            <View style={Styles.salonRatingViewButton}>
              <Icon name={'keyboard-arrow-right'} style={Styles.salonRatingViewButtonIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const Toolbar = connect(state => {
  return { search: state.search };
})(IToolbar);

//Render navigation bar
class INavbar extends PureComponent {
  render() {
    return (
      <View style={Styles.navBar}>
        <View style={Styles.navBarLeft}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            hitSlop={{ top: 30, bottom: 30, right: 30, left: 30 }}
            style={Styles.navBackButton}>
            <Icon style={Styles.navBackButtonIcon} name={"arrow-back"} />
          </TouchableOpacity>
        </View>
        {
          !this.props.hideHeaderTitle ?
            <View style={Styles.navBarTitle}>
              <Text numberOfLines={1} style={Styles.navBarTitleText}>{this.props.search.currentSalon.name}</Text>
            </View>
            : undefined
        }

        <View style={Styles.navBarRight}>
          <TouchableOpacity
            onPress={() => {
              if (!this.props.account.token) {
                this.props.requireLogin();
                return false;
              }
              this.props.likeSalon(this.props.search.currentSalon.id, (liked) => {
                this.props.updateCurrentSalonDetailLike(
                  this.props.search.currentSalon.id, liked
                )
                this.props.updateSalonNewLike(
                  this.props.search.currentSalon.id, liked
                )
                this.props.updateTopSalonNam(
                  this.props.search.currentSalon.id, liked
                )
                this.props.updateSalonNearMeLike(
                  this.props.search.currentSalon.id, liked
                )
              })
            }}
          >
            <Icon
              style={[Styles.navBarButtonIcon, this.props.search.currentSalon.liked && Styles.navBarButtonIconActive]}
              name={this.props.search.currentSalon.liked ? "favorite" : "favorite-border"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const Navbar = connect(state => {
  return {
    search: state.search,
    account: state.account
  };
}, {
    likeSalon,
    updateCurrentSalonDetailLike,
    updateSalonNearMeLike,
    updateSalonNewLike,
    updateTopSalonNam,
  })(INavbar);

class ITabs extends PureComponent {
  render() {
    return (
      <View style={[Styles.salonTabs, this.props.style]}>
        <TouchableOpacity
          onPress={() => {
            this.props.changeTab(1)
          }}
          style={[Styles.salonTabBegin, Styles.salonTab, this.props.activeTab === 1 && (this.props.float ? Styles.salonTabActiveFloat : Styles.salonTabActive), this.props.float && Styles.salonTabFloat]}>
          <Text style={[Styles.salonTabText, this.props.float && Styles.salonTabTextFloat]}>
            Khuyến mãi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.changeTab(2)
          }}
          style={[Styles.salonTab, this.props.activeTab === 2 && (this.props.float ? Styles.salonTabActiveFloat : Styles.salonTabActive), this.props.float && Styles.salonTabFloat]}>
          <Text style={[Styles.salonTabText, this.props.float && Styles.salonTabTextFloat]}>
            Dịch vụ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.changeTab(3)
          }}
          style={[Styles.salonTabEnd, Styles.salonTab, this.props.activeTab === 3 && (this.props.float ? Styles.salonTabActiveFloat : Styles.salonTabActive), this.props.float && Styles.salonTabFloat]}>
          <Text style={[Styles.salonTabText, this.props.float && Styles.salonTabTextFloat]}>
            Thông tin
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const Tabs = connect(state => {
  return { search: state.search };
})(ITabs);

//Render content layout
class IContent extends PureComponent {
  static defaultProps = {
    saleServices: [],
    cats: [],
    stylists: [],
    brands: [],
  };

  _getAllSevices() {
    var data = []
    if (this.props.search.currentSalon.cats != undefined && this.props.search.currentSalon.cats.length > 0) {
      this.props.search.currentSalon.cats.map(({ image, price, name, count, services }) => {
        if (services != undefined && services.length > 0) {
          services.forEach((obj) => {
            data.push(obj);
          })
        }
      }
      )
    }
    return data;
  }

  constructor(props) {
    super(props);
    {
      if (props.search.currentSalon.inPromotion) {
        var listCats = [];
        listCats.push({
          image: require('../assets/images/promotion.png'),
          price: '',
          name: "Khuyến mãi",
          count: props.search.currentSalon.saleOff.length,
          services: props.search.currentSalon.saleOff
        });
        listCats.push({
          image: require('../assets/images/allsevices.png'),
          price: '',
          name: "Tất cả dịch vụ",
          count: this._getAllSevices().length,
          services: this._getAllSevices()
        });
        props.search.currentSalon.cats.forEach((obj) => {
          listCats.push(obj);
        })

        this.state = {
          catsservice: listCats
        };
      } else {
        var listCats = [];
        listCats.push({
          image: require('../assets/images/allsevices.png'),
          price: "",
          name: "Tất cả dịch vụ",
          count: this._getAllSevices().length,
          services: this._getAllSevices()
        });
        props.search.currentSalon.cats.forEach((obj) => {
          listCats.push(obj);
        })

        this.state = {
          catsservice: listCats
        };
      }
    }
  }

  render() {
    let view = undefined;
    if (this.props.activeTab === 1) { //========== Khuyến mãi 
      view = (
        this.props.search.currentSalon.saleOff.length > 0 ?
          <Services
            navigation={this.props.navigation}
            onServiceDetail={this.props.onServiceDetail}
            onCartChange={this.props.onCartChange}
            items={this.props.search.currentSalon.saleOff}
          />
          :
          <View style={Styles.noService}>
            <Icon style={Styles.noServiceIcon} name={'sentiment-dissatisfied'} />
            <Text style={Styles.noServiceText}>Salon chúng tôi hiện tại chưa có dịch vụ nào đang có khuyến mại</Text>
          </View>
      );
    } else if (this.props.activeTab === 2) { //========== Dịch vụ
      view = (
        <Cats
          navigation={this.props.navigation}
          onServiceDetail={this.props.onServiceDetail}
          showLightBox={this.props.showLightBox}
          onCartChange={this.props.onCartChange}
          items={this.state.catsservice}
        />
      );
    } else { //========== Thông tin 
      view = (
        <View>
          <ContentBlock
            icon={'clock-o'}
            title={'Thời gian làm việc'}
            contentRender={() => {
              return <BlockTime timeFrom={'08:30'} timeTo={'16:45'} />
            }} />

          {
            (this.props.search.currentSalon.info) ?
              <ContentBlock
                icon={'info'}
                title={'Thông tin chung'}
                contentRender={() => {
                  return <BlockText content={this.props.search.currentSalon.info.replace("<p>", "").replace("</p>", "")} />
                }} />
              :
              undefined
          }

          <ContentBlock
            icon={'scissors'}
            title={'Stylist'}
            contentRender={() => {
              return <BlockStylist />
            }} />

          <ContentBlock
            icon={'shopping-bag'}
            title={'Thương hiệu'}
            contentRender={() => {
              return <BlockBrands items={this.props.brands} />
            }} />

          <ContentBlock
            icon={'map-marker'}
            title={'Bản đồ địa điểm'}
            contentRender={() => {
              return (<View>
                <WAMapBlock name={this.props.search.currentSalon.name} address={this.props.search.currentSalon.address}
                  location={{
                    lat: this.props.search.currentSalon.map_lat,
                    lng: this.props.search.currentSalon.map_lng
                  }} />

                <View style={Styles.mapInfo}>
                  <View style={Styles.mapSalon}>
                    <Text style={Styles.mapSalonName}>{this.props.search.currentSalon.name}</Text>
                    <Text
                      style={Styles.mapSalonAddress}>{this.props.search.currentSalon.address}</Text>
                  </View>
                  <View style={Styles.mapDistance}>
                    <IconFA style={Styles.mapDistanceIcon} name={'map-marker'} />
                    <Text style={Styles.mapDistanceText}>{this.props.search.currentSalon.distance}km</Text>
                  </View>
                </View>
              </View>)
            }}
          />

          {
            this.props.search.currentSalon.showcase ?
              <BlockGallery requireLogin={this.props.requireLogin} navigation={this.props.navigation}
                showLightBox={this.props.showLightBox} />
              : undefined
          }

          <WAReviews navigation={this.props.navigation} salon={this.props.search.currentSalon.id} service={false}
            onLoadMore={() => {
              this.props.loadSalonReviews(this.props.search.currentSalon.id)
            }} />
        </View>
      );
    }

    return (
      <View style={Styles.content}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />

        <Tabs changeTab={(index) => {
          this.props.changeTab(index)
        }} activeTab={this.props.activeTab} float={false} />

        {view}
      </View>
    );
  }
}

const Content = connect(state => {
  return { search: state.search };
}, {
    loadSalonReviews
  }
)(IContent);

class Services extends PureComponent {
  static defaultProps = {
    items: [],
    checkFirst: true,
  };

  constructor(props) {
    super(props);
    this.state = {}
  };

  //Show popup đặt dịch vụ 
  _showOptions = (service, onSubmit) => {
    this.options.show(service, onSubmit);
  };

  render() {
    return (
      <View style={Styles.services}>
        <WAServiceOptions ref={(ref) => { this.options = ref }} />
        {
          this.props.items.map((item, index) => {
            return (
              <Service
                selectOptions={this._showOptions}
                navigation={this.props.navigation}
                showLightBox={this.props.showLightBox}
                onCartChange={this.props.onCartChange} checkFirst={this.props.checkFirst} index={index} key={index}
                data={item} />
            )
          })
        }
      </View>
    )
  }
}

class IService extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      added: false,
    }
  };

  render() {
    let item = this.props.data
    return (
      <View style={[Styles.service, this.props.index === 0 && this.props.checkFirst && Styles.serviceFirst]}>
        <View style={[Styles.serviceFramt]}>
          {
            item.cover ?
              <Image source={{ uri: item.cover }} style={Styles.catImageService} />
              : undefined
          }
          <View style={[{ flex: 1, flexDirection: 'column' }]}>
            <TouchableOpacity
              hitSlop={touchSize}
              onPress={() => {
                this.props.navigation.navigate('home_service', {
                  id: item.id,
                  fromSalon: true
                })
              }}>
              <Text numberOfLines={1} style={Styles.serviceName}>{item.name}</Text>
            </TouchableOpacity>
            <View style={Styles.serviceInfo}>
              <Text style={Styles.serviceTime}>
                {item.time}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('home_service', {
                    id: item.id,
                    fromSalon: true
                  })
                }}
                hitSlop={touchSize}
                style={Styles.serviceDetailLink}>
                <Text style={Styles.serviceDetailLinkText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
            <View>

            </View>
          </View>
          <View style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", }]}>
            {
              item.sale_percent ?
                <Text style={[Styles.serviceTextOldPrice]} >{item.oldPrice}</Text>
                : undefined
            }
            <View style={Styles.servicePriceSale}>
              <View style={Styles.servicePriceMain}>
                <Text style={Styles.servicePrice}>
                  {/* {item.ranged ? 'Từ' : ''} */}
                  {item.price}
                </Text>
                {/* {
                      item.oldPrice !== item.price ?
                        <Text style={Styles.serviceOldPrice}>
                          {item.ranged ? 'Từ' : ''} {item.oldPrice}
                        </Text> : undefined
                    } */}
              </View>
              {
                item.sale_percent ?
                  <View style={Styles.servicePriceSalePercent}>
                    <Text style={Styles.servicePriceSalePercentText}>- {item.sale_percent}%</Text>
                  </View>
                  : undefined
              }
            </View>

            { /* Button thêm vào giỏ hàng */
              this.props.search.currentSalon.open ?
                <TouchableOpacity
                  onPress={() => {
                    if (this.props.cart.inCart(item.id) || item.options.length === 0) {
                      this.props.addRemoveCartItem(item.salonID, item);
                    } else {
                      this.props.selectOptions(item, (option, included_items) => {
                        //"included_items" là list "listChecked" trong WAServiceOptions
                        this.props.addRemoveCartItem(item.salonID, item, option, included_items);
                      });
                    }
                  }}
                  hitSlop={touchSize}
                  style={Styles.serviceAddCart}>
                  {
                    !this.props.cart.inCart(item.id) ?
                      <Icon style={Styles.serviceAddCartIcon} name={'add-circle-outline'} />
                      :
                      <Icon style={Styles.serviceAddCartIcon} name={'check-circle'} />
                  }
                </TouchableOpacity>
                : undefined
            }
          </View>
        </View>

        {
          item.logos.length > 0 ?
            <ScrollView
              horizontal={true}
              style={Styles.serviceLogos}>
              {
                item.logos.map((logo, index) => {
                  return (
                    <ImageBackground style={Styles.serviceLogo} key={'logo-' + index} source={{ uri: logo }} />
                  );
                })
              }
            </ScrollView>
            : undefined
        }
        {
          item.images.length > 0 ?
            <ScrollView
              horizontal={true}
              style={Styles.serviceImage}>
              {
                item.images.map((img, index) => {
                  if (index <= 2) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.showLightBox(index, item.images.map((img) => {
                            return {
                              url: img.image,
                              freeHeight: true
                            }
                          }))
                        }}
                        key={'service-' + index}
                        style={Styles.slide} activeOpacity={0.9}>
                        <Image source={{ uri: img.thumb }} style={Styles.ImageServices} />
                      </TouchableOpacity>
                    );
                  } else if (index === 3) {
                    if (item.images.length > 4) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.showLightBox(index, item.images.map((img) => {
                              return {
                                url: img.image,
                                freeHeight: true
                              }
                            }))
                          }}
                          key={'service-' + index}
                          style={Styles.slide} activeOpacity={0.9}>
                          <View style={Styles.itemTextOverride}>
                            <Text style={Styles.itemText} >+{item.images.length - 4}</Text>
                          </View>
                          <Image source={{ uri: img.thumb }} style={Styles.ImageServices} />
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.showLightBox(index, item.images.map((img) => {
                              return {
                                url: img.image,
                                freeHeight: true
                              }
                            }))
                          }}
                          key={'service-' + index}
                          style={Styles.slide} activeOpacity={0.9}>
                          <Image source={{ uri: img.thumb }} style={Styles.ImageServices} />
                        </TouchableOpacity>
                      );
                    }
                  } else {
                    return undefined;
                  }
                })
              }
            </ScrollView>
            : undefined
        }
      </View>
    )
  }
}

const Service = connect(state => {
  return {
    search: state.search,
    service: state.service,
    cart: state.cart
  };
}, {
    addRemoveCartItem
  }
)(IService);

//Render danh sách dịch vụ 
class ICats extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      selectedCat: 0
    }
  };

  render() {
    return (
      <View>
        <View style={Styles.catBar}>
          <ScrollView
            style={Styles.catBarSV}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {
              this.props.items.map((item, index) => {
                return (
                  <TouchableOpacity
                    hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
                    onPress={() => {
                      this.setState({ selectedCat: index })
                    }}
                    key={'cat-' + index}
                    style={Styles.cat}>
                    {
                      index === this.state.selectedCat ?
                        <View style={Styles.catIcon}>
                          <Icon style={Styles.catIconText} name={'check'} />
                        </View>
                        : undefined
                    }
                    {
                      (item.name === 'Khuyến mãi' || item.name === 'Tất cả dịch vụ') ?
                        <Image source={item.image} style={Styles.catImage2} />
                        :
                        <Image source={{ uri: item.image }} style={Styles.catImage} />
                    }
                    <Text style={[Styles.catName, index === this.state.selectedCat ? Styles.catNameActive : undefined]} numberOfLines={1}>{item.name.toUpperCase()}</Text>
                  </TouchableOpacity>

                  // <Cat
                  // navigation={this.props.navigation}
                  // onServiceDetail={this.props.onServiceDetail}
                  // onCartChange={this.props.onCartChange} key={index} data={item} index={index}
                  // selectedCat = {(value) =>
                  //   this.setState({
                  //     selectedCat : value
                  //   })
                  // }
                  // />
                );
              })
            }
          </ScrollView>
        </View>

        { /* Danh sách dịch vụ  */
          this.props.items.map((item, index) => {
            if (index === this.state.selectedCat) {
              return (
                <Services
                  navigation={this.props.navigation}
                  onServiceDetail={this.props.onServiceDetail}
                  showLightBox={this.props.showLightBox}
                  onCartChange={this.props.onCartChange} key={index} data={item} index={index}
                  checkFirst={false}
                  items={item.services} />
              )
            }
          })
        }
      </View>
    )
  }
}

const Cats = connect(state => {
  return { search: state.search };
})(ICats);

class Cat extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      toggle: this.props.index === 0
    }
  };

  render() {
    let item = this.props.data;
    return (
      <View>
        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
          onPress={() => {
            this.setState({ toggle: this.props.index })
            this.props.selectedCat(this.props.index)
          }}
          style={Styles.cat}>
          {
            this.state.toggle ?
              <View style={Styles.catIcon}>
                <Icon style={Styles.catIconText} name={'check'} />
              </View>
              : undefined
          }
          <Image source={{ uri: item.image }} style={Styles.catImage} />
          <Text style={[Styles.catName, this.state.toggle == this.props.index ? Styles.catNameActive : undefined]}>{item.name.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class ContentBlock extends PureComponent {
  static defaultProps = {
    title: 'Content Block Title',
    icon: 'star',
    contentRender: undefined
  };

  constructor(props) {
    super(props);
    this.state = {
      toggle: true
    }
  };

  render() {
    return (
      <View style={Styles.block}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ toggle: !this.state.toggle })
          }}
          hitSlop={touchSize}
          style={Styles.blockHead}>
          <View style={Styles.blockHeadIconWrapper}>
            <IconFA style={Styles.blockHeadIcon} name={this.props.icon} />
          </View>
          <View style={Styles.blockHeadTitlteWrapper}>
            <Text style={Styles.blockHeadTitlte}>{this.props.title}</Text>
          </View>
          <Icon style={Styles.blockHeadToggle} name={this.state.toggle ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} />
        </TouchableOpacity>
        {
          this.state.toggle ?
            <View style={Styles.blockContent}>
              {this.props.contentRender()}
            </View>
            : undefined
        }
      </View>
    )
  }
}

class BlockText extends PureComponent {
  static defaultProps = {
    content: ''
  };

  render() {
    return (
      <AutoHeightWebViewNew
        style={Styles.blockTextContent}
        customScript={`document.body.style.background = 'white';`}
        zoomable={false}
        source={
          {
            baseUrl: '',
            html: this.props.content
          }
        }
      />

      // <AutoHeightWebView
      //   style={Styles.blockTextContent}
      //   originWhitelist={['*']}
      //   startInLoadingState={true}
      //   source={
      //     {
      //       baseUrl: '',
      //       html: this.props.content
      //     }
      //   }
      // />
    )
  }
}

class IBlockTime extends PureComponent {
  static defaultProps = {
    timeFrom: '',
    timeTo: ''
  };

  render() {
    return (
      <View>
        <Text style={Styles.blockTimeContent}>
          {this.props.search.currentSalon.workTimes}
        </Text>
        <Text style={[Styles.blockTimeContent, { fontSize: 15, marginTop: 10 }]}>
          {this.props.search.currentSalon.workDays}
        </Text>
      </View>
    )
  }
}

const BlockTime = connect(state => {
  return { search: state.search };
})(IBlockTime);

class IBlockStylist extends PureComponent {
  static defaultProps = {
    items: []
  };

  render() {
    return (
      <FlatList style={Styles.stylists}
        numColumns={3}
        keyExtractor={(item, index) => {
          return '' + index
        }}
        data={this.props.search.currentSalon.stylists}
        renderItem={({ item }) => {
          return (
            <View style={Styles.stylist}>
              <Image style={Styles.stylistImage} source={{ uri: item.image }} />
              <Text style={Styles.stylistName}>{item.name}</Text>
            </View>
          )
        }}
      />
    )
  }
}

const BlockStylist = connect(state => {
  return { search: state.search };
})(IBlockStylist);

class IBlockBrands extends PureComponent {
  static defaultProps = {
    items: []
  };

  render() {
    return (
      <FlatList style={Styles.brands}
        numColumns={2}
        keyExtractor={(item, index) => {
          return '' + index
        }}
        data={this.props.search.currentSalon.brands}
        renderItem={({ item }) => {
          return (
            <View style={Styles.brand}>
              <Image style={Styles.brandImage} source={{ uri: item.image }} />
            </View>
          )
        }}
      />
    )
  }
}

const BlockBrands = connect(state => {
  return { search: state.search };
})(IBlockBrands);

class IBlockGallery extends PureComponent {
  static defaultProps = {
    position: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={Styles.galleryWrapper}>
        <TouchableOpacity
          onPress={() => {
            if (!this.props.account.token) {
              this.props.requireLogin();
              return false;
            }
            this.props.likeShowcase(item.id, (data) => {
              this.props.updateCurrentSalonDetailShowcaseLike(item.id, data);
            });
          }}
          hitSlop={{
            top: 30,
            left: 30,
            right: 30,
            bottom: 0
          }}
          style={Styles.showcaseLike}>
          <Icon style={[Styles.showcaseLikeIcon, item.liked && { color: Colors.PRIMARY }]}
            name={item.liked ? 'favorite' : "favorite-border"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.showLightBox(0, item.items.map((slide) => {
              return {
                url: slide.image,
                freeHeight: true
              }
            }))
          }}
          style={Styles.gallery} activeOpacity={1}>
          <Text style={Styles.galleyStats}>{item.items.length} ảnh</Text>
          <Image source={{ uri: item.thumb_sq }} style={Styles.galleryBG}>
          </Image>
          <Text style={Styles.galleryTitle}>{item.name}</Text>
        </TouchableOpacity>
        <View style={[Styles.galleryLine, Styles.galleryLine1]} />
        <View style={[Styles.galleryLine, Styles.galleryLine2]} />
      </View>
    );
  };

  render() {
    return (
      <View style={[Styles.block, Styles.blockAlt]}>
        <View
          style={[Styles.blockHead, Styles.blockHeadAlt]}>
          <View style={Styles.blockHeadIconWrapper}>
            <IconFA style={Styles.blockHeadIcon} name={'star'} />
          </View>
          <View style={Styles.blockHeadTitlteWrapper}>
            <Text style={Styles.blockHeadTitlte}>Tác phẩm</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('home_salon_galleries');
            }}
          >
            <Text style={Styles.galleryViewAll}>Xem nhiều hơn</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.blockContent}>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={this.props.search.currentSalon.showcase}
            renderItem={this._renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width - 110}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            enableMomentum={true}
            activeSlideAlignment={'start'}
            activeAnimationType={'spring'}
          />
        </View>
      </View>
    )
  }
}

const BlockGallery = connect(state => {
  return {
    search: state.search,
    account: state.account
  };
}, {
    likeShowcase,
    updateCurrentSalonDetailShowcaseLike
  })(IBlockGallery);


const touchSize = {
  top: 15,
  bottom: 15,
  left: 15,
  right: 15
};

const Styles = StyleSheet.create({
  noService: {
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noServiceText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SILVER_DARK,
    flex: 1
  },
  noServiceIcon: {
    color: Colors.SILVER_DARK,
    fontSize: 50,
    marginRight: 15
  },
  page: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.LIGHT,
    flex: 1,
  },
  navBar: {
    //height: 20,
    flexDirection: 'row',
    //backgroundColor: 'red',
    alignItems: 'center',
    marginTop: 20
  },
  navBarLeft: {
    flex: 1,
    paddingLeft: 20
  },
  navBarRight: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
    flexDirection: 'row'
  },
  navBackButtonIcon: {
    color: Colors.LIGHT,
    fontSize: 22
  },
  navBarButtonShare: {
    marginRight: 15
  },
  navBarButtonIcon: {
    color: Colors.LIGHT,
    fontSize: 22
  },
  navBarButtonIconActive: {
    color: Colors.ERROR
  },
  navBarTitle: {},
  navBarTitleText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15
  },
  sliderWrapper: {
    height: 250,
    backgroundColor: Colors.SILVER
  },
  slider: {},
  slide: {
    flex: 1
  },
  sliderOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1
  },
  slideImage: {
    flex: 1
  },
  content: {
    backgroundColor: Colors.LIGHT,
    //height: 1000
  },
  sliderPager: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    zIndex: 2
  },
  sliderPagerText: {
    textAlign: 'center',
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15
  },
  salonInfo: {
    height: 115,
    //borderBottomWidth: 1,
    //borderBottomColor: Colors.SILVER_DARK,
    paddingLeft: 20,
    paddingRight: 20
  },
  salonTopInfo: {
    paddingTop: 15,
    flexDirection: 'row',
    //marginRight: 20,
    alignItems: 'center'
  },
  salonTopInfoRight: {},
  salonVerified: {
    fontSize: 18,
    color: 'green'
  },
  salonTopInfoLeft: {
    flex: 1,
  },
  salonInfoName: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 25,
    fontWeight: 'bold'
  },
  salonInfoAdress: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13
  },
  salonRating: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'yellow'
  },
  salonRatingScoreText: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 40,
  },
  salonRatingInfo: {
    flexDirection: undefined,
    alignItems: 'flex-start',
    marginLeft: 15,
    flex: 1
  },
  salonRatingViewButtonIcon: {
    fontSize: 30,
    color: Colors.SILVER
  },
  tabsFloat: {
    position: 'absolute',
    zIndex: 99,
    //top: Platform.OS === 'ios'? 54 : 70,
    top: getStatusBarHeight() + (Platform.OS === 'ios' ? 30 : 45),
    backgroundColor: Colors.PRIMARY,
    left: 0,
    right: 0
  },
  salonTabs: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 5
  },
  salonTab: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.TRANSPARENT
  },
  salonTabActive: {
    borderBottomColor: Colors.PRIMARY
  },
  salonTabActiveFloat: {
    borderBottomColor: Colors.LIGHT
  },
  salonTabText: {
    fontSize: 17,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  salonTabTextFloat: {
    color: Colors.LIGHT,
  },
  service: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    marginLeft: 20,
    marginRight: 20
  },
  serviceFirst: {
    borderTopWidth: 0,
  },
  serviceName: {
    fontSize: 17,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    marginBottom: 5
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  serviceFramt: {
    flexDirection: 'row',
  },
  servicePriceSale: {
    marginRight: 3,
  },
  servicePriceMain: {
    flexDirection: 'column-reverse',
    alignItems: 'center'
  },
  servicePriceSalePercent: {},
  servicePriceSalePercentText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  servicePrice: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold'
  },
  serviceOldPrice: {
    fontSize: 14,
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME,
    textDecorationLine: 'line-through',
    marginLeft: 10
  },
  serviceTime: {
    flex: 1,
    textAlign: 'left',
    marginRight: 10,
    fontSize: 12,
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  serviceDetailLink: {
    flex: 1,
    textAlign: 'left',
  },
  serviceDetailLinkText: {
    color: Colors.TEXT_LINK,
    fontSize: 12,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  serviceAddCartIcon: {
    color: Colors.PRIMARY,
    fontSize: 25
  },
  catHead: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  catInfo: {
    flex: 1
  },
  catNameActive: {
    color: Colors.PRIMARY
  },
  catCount: {
    color: Colors.SILVER_DARK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  catPrice: {
    color: Colors.PRIMARY,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: GlobalStyles.FONT_NAME,
  },
  catIconText: {
    fontSize: 8,
    color: Colors.LIGHT
  },
  catImage: {
    height: 36,
    width: 36,
    borderRadius: 36/2,
    overflow: 'hidden'
  },
  catImage2: {
    height: 36,
    marginTop: 5,
    width: 36,
    resizeMode: 'contain',
    borderRadius: 2,
    overflow: 'hidden'
  },
  catImageService: {
    height: 40,
    width: 40,
    marginRight: 5,
    borderRadius: 40/2,
    overflow: 'hidden'
  },
  catIcon: {
    position: 'absolute',
    left: 40,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.DARK,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  block: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1
  },
  blockAlt: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  blockHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockContent: {
    marginTop: 20
  },
  blockHeadAlt: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  blockHeadIconWrapper: {
    width: 30
  },
  blockHeadIcon: {
    fontSize: 20,
    color: Colors.TEXT_DARK,
  },
  blockHeadTitlteWrapper: {
    flex: 1
  },
  blockHeadTitlte: {
    color: Colors.TEXT_DARK,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: GlobalStyles.FONT_NAME,

  },
  blockHeadToggle: {
    fontSize: 25,
    color: Colors.SILVER_DARK,
  },
  blockTimeContent: {
    color: Colors.TEXT_DARK,
    fontSize: 20,
    fontFamily: GlobalStyles.FONT_NAME,
    paddingLeft: 30,
  },
  blockTextContent: {
    // color: Colors.TEXT_DARK,
    // fontSize: 14,
    // fontFamily: GlobalStyles.FONT_NAME,
    width: Dimensions.get('window').width - 35,
    justifyContent: 'center',
    marginTop: 0,
  },
  stylists: {},
  stylist: {
    //flex: 1,
    width: (Dimensions.get('window').width / 3) - 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  stylistImage: {
    height: 68,
    width: 68,
    resizeMode: 'cover',
    borderRadius: 68/2,
    marginBottom: 10
  },
  stylistName: {
    textAlign: 'center',
    color: Colors.TEXT_DARK,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  brand: {
    //flex: 1,
    width: Dimensions.get('window').width / 2 - 34,
    height: 100,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    //backgroundColor: Colors.SILVER_LIGHT
  },
  brandImage: {
    flex: 1,
    height: 100,
    resizeMode: 'contain'
  },

  galleryWrapper: {
    marginLeft: 20,
  },
  gallery: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.SILVER_LIGHT,
    borderRadius: 5,
    backgroundColor: Colors.LIGHT,
  },
  galleryViewAll: {
    color: Colors.TEXT_LINK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  galleryBG: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').width - 110,
    resizeMode: 'stretch',
  },
  galleryTitle: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 30,
    color: Colors.TEXT_DARK,
    fontSize: 18,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  galleryLine: {
    height: 2,
    backgroundColor: Colors.SILVER_LIGHT,
    marginTop: 2
  },
  galleryLine1: {
    marginLeft: 5,
    marginRight: 5
  },
  galleryLine2: {
    marginLeft: 10,
    marginRight: 10
  },
  galleyStats: {
    color: Colors.LIGHT,
    fontSize: 12,
    fontFamily: GlobalStyles.FONT_NAME,
    backgroundColor: Colors.PRIMARY,
    position: 'absolute',
    top: Dimensions.get('window').width - 125,
    // left: 0,
    width: 50,
    // paddingTop: 4,
    // paddingBottom: 4,
    // paddingRight: 5,
    zIndex: 1,
    textAlign: 'center',
  },
  cart: {
    backgroundColor: Colors.PRIMARY,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cartAmount: {
    position: 'relative',
    marginRight: 15
  },
  cartAmountTextWrapper: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 20,
    height: 20,
    backgroundColor: Colors.DARK,
    borderRadius: 10
  },
  cartAmountText: {
    color: Colors.LIGHT,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12
  },
  cartSum: {
    color: Colors.LIGHT,
    fontSize: 20,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold',
  },
  cartButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  cartButton: {
    backgroundColor: Colors.LIGHT,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
    width: 120,
  },
  cartButtonText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold',
    color: Colors.TEXT_DARK,
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    borderLeftWidth: 1,
    borderLeftColor: Colors.SILVER_LIGHT,
    borderRightWidth: 1,
    borderRightColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 3,
    borderBottomColor: Colors.PRIMARY,
    borderRadius: 5,
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20
  },
  mapDistanceText: {
    color: Colors.SILVER_DARK,
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  mapDistance: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mapDistanceIcon: {
    fontSize: 20,
    marginRight: 5,
    color: Colors.SILVER_DARK,
  },
  mapSalonName: {
    color: Colors.TEXT_DARK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold'
  },

  mapSalon: {
    flex: 1
  },
  mapSalonAddress: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
  },
  showcaseLike: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
    top: 15
  },
  showcaseLikeIcon: {
    fontSize: 30,
    color: Colors.LIGHT
  },
  serviceLogos: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 10
  },
  serviceTextOldPrice: {
    fontSize: 12,
    marginBottom: 21,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#000"
  },
  serviceLogo: {
    width: 50,
    height: 30,
    //resizeMode: 'contain',
    marginRight: 10
  },
  catBar: {
    backgroundColor: '#F2F2F2',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    paddingRight: 10
  },
  cat: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    flexDirection: 'column',
    backgroundColor: Colors.LIGHT,
    //borderColor: Colors.SILVER_LIGHT,
    // borderWidth: 1,
    borderRadius: 2,
    paddingTop: 10,
    paddingBottom: 10
  },
  catImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 25,
    resizeMode: 'cover',
    // marginRight: 10
  },
  catName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 8,
    marginTop: 5,
    color: Colors.TEXT_DARK,
    textAlign: 'center',
  },
  ImageServices: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    flex: 1,
    borderRadius: 5,
    resizeMode: 'cover',
    marginRight: 10,
  },
  itemTextOverride: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    color: Colors.LIGHT
  },
  serviceImage: {
    flexDirection: 'row',
    marginTop: 10,
  }
});


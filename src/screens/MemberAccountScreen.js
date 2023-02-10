import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  StatusBar,
  Share,
  ScrollView,
  Platform
} from "react-native";
import HomeSectionPageContainer from "../components/HomeSectionPageContainer";
import ImageSources from "../styles/ImageSources";
import Colors from "../styles/Colors";
import GlobalStyles from "../styles/GlobalStyles";
import { connect } from "react-redux";
import WAAvatar from "../components/WAAvatar";
import { logout } from "../redux/account/actions";
import firebase from 'react-native-firebase';

class MemberAccountScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      logoutModal: false,
      accountName: "Minh Trang",
      accountAvatar: ImageSources.IMG_AVATAR_2
    };
  }

  render() {
    return (
      <HomeSectionPageContainer style={Styles.container}>
        <ScrollView style={{ flex: 1 }}>
          {!this.props.account.token ? (
            <View style={Styles.accountNologin}>
              <Text style={Styles.accountNoLoginHello}>Chào bạn!</Text>
              <Text style={Styles.accountNoLoginText}>
                Vui lòng{" "}
                <Text
                  onPress={() => {
                    this.props.route.navigation.navigate("new_login", {
                      hasBack: true
                    }); //access
                  }}
                  style={Styles.textBold2}
                >
                  đăng nhập
                </Text>{" "}
                để quản lý thông báo và lịch sử đặt chỗ cũng như các thông tin
                cá nhân của mình bạn nhé!
              </Text>
            </View>
          ) : (
            <View style={Styles.accountInfo}>
              <View style={Styles.accountInfoNameWrapper}>
                <Text numberOfLines={1} style={Styles.accountInfoName}>
                  {this.props.account.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.route.navigation.navigate(
                      "home_account_profile"
                    );
                  }}
                  style={Styles.accountInfoLink}
                >
                  <Text style={Styles.accountInfoLinkText}>
                    Xem & chỉnh sửa hồ sơ
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.route.navigation.navigate("home_account_profile");
                }}
                style={Styles.avatarWrapper}
              >
                <WAAvatar style={Styles.avatar} />
              </TouchableOpacity>
            </View>
          )}
          <View style={Styles.menu}>{this._renderMenu()}</View>
          <Modal
            animationType="fade"
            transparent={true}
            onRequestClose={() => {}}
            visible={this.state.logoutModal}
          >
            <StatusBar
              translucent={true}
              backgroundColor={"rgba(0, 0, 0, 0.82)"}
              barStyle={"light-content"}
            />
            <View style={Styles.modal}>
              <View style={Styles.modalInner}>
                <Text style={Styles.modalQuestion}>
                  Bạn có chắc chắn muốn thoát khỏi ứng dụng không?
                </Text>
                <Text style={Styles.modalTitle}>Bạn đồng ý đăng xuất?</Text>
                <View style={Styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ logoutModal: false });
                    }}
                    style={Styles.modalButton}
                  >
                    <Text style={Styles.modalButtonText}>Không</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          logoutModal: false
                        },
                        () => {
                          firebase.auth().signOut().then(() => {
                            
                          }).catch(err => {

                          }).finally(() => {
                            this.props.logout();
                            this.props.route.navigation.replace("new_login"); //access
                          })
                        }
                      );
                    }}
                    style={[Styles.modalButton, Styles.modalButtonAgree]}
                  >
                    <Text
                      style={[
                        Styles.modalButtonText,
                        Styles.modalButtonAgreeText
                      ]}
                    >
                      Đồng ý
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </HomeSectionPageContainer>
    );
  }

  _renderMenu = () => {
    let items = [
      {
        icon: ImageSources.SVG_ICON_NOTIFICATION,
        label: "Thông báo",
        number: this.props.notify.count,
        action: () => {
          this.props.route.navigation.navigate("home_account_notification");
        },
        requireLogin: true
      },
      {
        icon: ImageSources.SVG_ICON_HISTORY_BOOKING,
        label: "Lịch sử đặt chỗ",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_history");
        },
        requireLogin: true
      },
      {
        icon: ImageSources.SVG_ICON_HISTORY_ALT,
        label: "Lịch sử mua hàng",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_history_order");
        },
        requireLogin: true
      },
      {
        icon: ImageSources.SVG_ICON_FAV,
        label: "Yêu thích",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_favorite");
        },
        requireLogin: true
      },
      {
        icon: ImageSources.SVG_ICON_SHARE,
        label: "Mời bạn bè",
        number: 0,
        action: () => {
          let url = "";
          if (Platform.OS === "ios") {
            url = "https://itunes.apple.com/us/app/id1439284821?mt=8";
          } else {
            url =
              "https://play.google.com/store/apps/details?id=com.isalonbooking";
          }
          Share.share({
            title: "Ứng dụng booking salon hay",
            message: "Ứng dụng booking salon hay: " + url
          });
        },
        requireLogin: false
      },
      {
        icon: ImageSources.SVG_ICON_INFO,
        label: "Trợ giúp",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_faq");
        },
        requireLogin: false
      },
      {
        icon: ImageSources.SVG_ICON_SETTINGS,
        label: "Cài đặt",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_setting");
        },
        requireLogin: false
      },
      {
        icon: !this.props.account.token
          ? ImageSources.SVG_ICON_LOGIN
          : ImageSources.SVG_ICON_LOGOUT,
        label: !this.props.account.token ? "Đăng nhập" : "Đăng xuất",
        number: 0,
        action: () => {
          if (!this.props.account.token) {
            this.props.route.navigation.navigate("new_login", {
              hasBack: true
            }); //access
          } else {
            this.setState({
              logoutModal: true
            });
          }
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
          onPress={() => {
            return item.action ? item.action() : undefined;
          }}
          style={Styles.menuItem}
          key={index}
          activeOpacity={0.5}
        >
          <View style={Styles.menuItemIcon}>{item.icon}</View>
          <View style={Styles.menuLabelWrapper}>
            <Text style={Styles.menuLabel}>{item.label}</Text>
            {item.number ? (
              <View style={Styles.number}>
                <Text style={Styles.numberText}>{item.number}</Text>
              </View>
            ) : (
              undefined
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };
}

export default connect(
  state => {
    return {
      account: state.account,
      notify: state.notify
    };
  },
  { logout }
)(MemberAccountScreen);

const Styles = StyleSheet.create({
  accountNologin: {
    marginTop: 30,
    marginBottom: 15
  },
  accountNoLoginText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SILVER_DARK,
    marginRight: 30
  },
  accountNoLoginHello: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.TEXT_DARK,
    marginBottom: 10
  },
  textBold2: {
    fontWeight: "bold",
    color: Colors.PRIMARY
  },
  container: {
    paddingLeft: 30,
    paddingRight: 0
  },
  avatarWrapper: {},
  avatar: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 35,
    marginLeft: 30
  },
  accountInfo: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 15,
    marginRight: 30
  },
  accountInfoName: {
    fontSize: 30,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: "bold"
  },
  accountInfoNameWrapper: {
    flex: 1
  },
  accountInfoLink: {},
  accountInfoLinkText: {
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME
  },
  menu: {
    //backgroundColor: Colors.PRIMARY,
    flex: 1
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 70
  },
  menuItemIcon: {
    marginRight: 15
  },
  menuLabelWrapper: {
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    flex: 1,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  menuLabel: {
    color: Colors.TEXT_DARK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    flex: 1
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.82)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  modalInner: {
    backgroundColor: Colors.LIGHT,
    marginRight: 30,
    marginLeft: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50,
    paddingBottom: 50,
    borderRadius: 5
  },
  modalQuestion: {
    color: Colors.TEXT_DARK,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: GlobalStyles.FONT_NAME
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.TEXT_DARK,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: GlobalStyles.FONT_NAME
  },
  modalButtons: {
    flexDirection: "row"
  },
  modalButton: {
    borderColor: Colors.SILVER,
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    marginRight: 5,
    marginLeft: 5
  },
  modalButtonText: {
    textAlign: "center",
    lineHeight: 40,
    fontSize: 14,
    fontFamily: GlobalStyles.FONT_NAME
  },
  modalButtonAgree: {
    backgroundColor: Colors.PRIMARY,
    borderWidth: 0
  },
  modalButtonAgreeText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME
  },
  number: {
    width: 24,
    height: 24,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginRight: 50
  },
  numberText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12
  }
});

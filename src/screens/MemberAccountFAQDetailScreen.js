import React, { Component } from "react";
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    RefreshControl,
    Modal, WebView, Platform
} from "react-native";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

type Props = {};
export default class MemberAccountFAQDetailScreen extends Component<Props> {
  constructor(props) {
    super(props);
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
        layoutPadding={30}
      >
        <View style={Styles.pageWrapperInner}>
          <View style={Styles.content}>
            <View style={Styles.title}>
              <Text style={Styles.titleText}>
                {this.props.navigation.state.params.title}
              </Text>
            </View>
              <WebView
                  style={Styles.contentWeb}
                  originWhitelist={['*']}
                  startInLoadingState={true}
                  source={
                      {
                          baseUrl: '',
                          html: this.props.navigation.state.params.content
                      }
                  }
                  scalesPageToFit={Platform.OS !== 'ios'}
              />
            {/*<Text style={Styles.contentText}>*/}
              {/*{this.props.navigation.state.params.content}*/}
            {/*</Text>*/}
          </View>
        </View>
      </PageContainer>
    );
  }
}

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: "flex-start"
  },
  pageWrapperInner: {
    flex: 1,
    width: "100%",
    marginBottom: 30
  },
  closeButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME
  },
  title: {
    marginBottom: 30
  },
  titleText: {
    fontSize: 20,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME
  },
  content: {
    flex: 1
  },
  contentText: {
    fontSize: 14,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME
  }
});

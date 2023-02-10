import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import CodeInput from 'react-native-code-input';
import PageContainer from "../../components/PageContainer";
import { connect } from 'react-redux';
import GlobalStyles from '../../styles/GlobalStyles';
import Colors from '../../styles/Colors';

type Props = {};

class BuyStpOneScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      saveInfo: false
    }
  }

  _toggleSaveInfo = () => {
    this.setState({
      saveInfo: !this.state.saveInfo
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        <PageContainer
          darkTheme={true}
          navigation={this.props.navigation}
          navigationClose={false}
          layoutPadding={15}
          headerTitle={'Bước 1/3'}
        >
          <ScrollView style={Styles.wrapper}>
            <View style={Styles.fieldLabelWrapper}>
              <Text style={Styles.pageTitle}>Thông tin cá nhân</Text>
            </View>
            <View style={Styles.pageDesc}>
              <Image source={require('../../assets/images/icon_buy_warning.png')}/>
              <Text style={Styles.pageDescText}>Vui lòng nhập tất cả các thôn tin của bạn
                vào khung bên dưới.</Text>
            </View>
            <View style={Styles.field}>
              <View style={Styles.fieldLabelWrapper}>
                <Text style={Styles.fieldLabel}>Tên của bạn <Text style={Styles.req}>*</Text></Text>
              </View>
              <TextInput
                style={Styles.fieldInput}
                underlineColorAndroid={Colors.TRANSPARENT}
                selectionColor={Colors.PRIMARY}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                placeholder={'Bạn tên gì?'}
                placeholderTextColor={Colors.SILVER_DARK}
              />
            </View>
            <View style={Styles.field}>
              <View style={Styles.fieldLabelWrapper}>
                <Text style={Styles.fieldLabel}>Số điện thoại <Text style={Styles.req}>*</Text></Text>
              </View>
              <TextInput
                style={Styles.fieldInput}
                underlineColorAndroid={Colors.TRANSPARENT}
                selectionColor={Colors.PRIMARY}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                placeholder={'Bạn đang thiếu số điện thoại?'}
                placeholderTextColor={Colors.SILVER_DARK}
              />
            </View>
            <View style={Styles.field}>
              <View style={Styles.fieldLabelWrapper}>
                <Text style={Styles.fieldLabel}>Email của bạn</Text>
              </View>
              <TextInput
                style={Styles.fieldInput}
                underlineColorAndroid={Colors.TRANSPARENT}
                selectionColor={Colors.PRIMARY}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                placeholder={'Chúng tôi có thể gửi khuyến mãi qua email'}
                placeholderTextColor={Colors.SILVER_DARK}
              />
            </View>
            <View style={Styles.field}>
              <View style={Styles.fieldLabelWrapper}>
                <Text style={Styles.fieldLabel}>Địa chỉ liên hệ</Text>
              </View>
              <TextInput
                style={Styles.fieldInput}
                underlineColorAndroid={Colors.TRANSPARENT}
                selectionColor={Colors.PRIMARY}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                placeholder={'Chúng tôi có thể gửi khuyến mãi qua email'}
                placeholderTextColor={Colors.SILVER_DARK}
              />
            </View>
            <TouchableOpacity
              onPress={this._toggleSaveInfo}
              style={Styles.saveInfo}>
              <View style={[Styles.saveInfoCheck, this.state.saveInfo && Styles.saveInfoCheckActive]}>
                {
                  Styles.saveInfoCheckActive?
                    <View style={Styles.saveInfoCheckInner}/>
                    :undefined
                }
              </View>
              <Text style={Styles.saveInfoText}>Lưu thông tin</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity style={Styles.submit}>
            <Text style={Styles.submitText}>Bước tiếp theo</Text>
          </TouchableOpacity>
        </PageContainer>
      </KeyboardAvoidingView>
    )
  }
}

export default connect(
  state => {
    return {}
  }, {}
)(BuyStpOneScreen);

const Styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    flex:1
  },
  pageTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: 'bold',
    fontSize: 30,
    color: Colors.DARK,
    marginBottom: 15
  },
  submit: {
    height: 60,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: 'white'
  },
  pageDesc: {
    flexDirection: 'row',
    marginBottom: 30
  },
  pageDescText: {
    flex: 1,
    marginLeft: 10,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.SILVER_DARK
  },
  field: {
    marginBottom: 30
  },
  fieldLabelWrapper: {
    marginBottom: 10,
    flexDirection: 'row'
  },
  fieldLabel: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.DARK,
  },
  fieldInput: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    height: 30,
    color: Colors.DARK,
    borderBottomColor: Colors.SILVER_DARK,
    borderBottomWidth: 1
  },
  req: {
    color: 'red'
  },
  saveInfo: {
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  saveInfoCheck: {
    height: 22,
    width: 22,
    borderWidth: 1,
    borderColor: Colors.SILVER_DARK,
    borderRadius: 11,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveInfoCheckActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  saveInfoText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    color: Colors.DARK
  },
  saveInfoCheckInner: {
    height: 10,
    width: 10,
    backgroundColor: 'white',
    borderRadius: 5
  }
});

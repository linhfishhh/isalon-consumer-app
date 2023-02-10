import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import WASelect from "../components/WASelect";
import {connect} from 'react-redux';
import {clearError, registerStepFinal} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";
import WALocation from "../components/WALocation";
import {loadLv1 as loadLocationLv1} from "../redux/location/actions";

type Props = {};
class NewUserInfoStepTwoScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            address: ''
        }
    }

    onSubmit = () => {
        this.refs.address.blur();
        this.props.registerStepFinal(this.state.address, this.props.location.lv1Value, this.props.location.lv2Value, this.props.location.lv3Value, this.props.navigation);

    };
    componentWillMount() {
        this.props.loadLocationLv1();
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios'?'padding':undefined}
                style={{flex: 1}}>
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
            >
                <NavigationEvents
                    onWillFocus={this.props.clearError}
                />
                <ScrollView style={{flex: 1}}>
                    <Text key={1} style={[GlobalStyles.pageTitle, NewUserFormStyles.pageTitle, Styles.pageTitle]}>
                        Thông tin{"\n"}Cá nhân mới
                    </Text>
                    <Text key={2} style={NewUserFormStyles.step}>Bước 2/2</Text>
                    <Text key={4} style={Styles.message}>
                        {
                            [
                                this.props.location.error?<Text key={0}>{this.props.location.errorMessage}</Text>:undefined,
                                this.props.account.error?<Text key={1}>{this.props.account.errorMessage}</Text>:undefined,
                            ]
                        }
                    </Text>
                    <View>
                        <Text style={[GlobalStyles.textFieldLabel]}>Địa chỉ liên hệ</Text>
                        <View style={[ GlobalStyles.textField, Styles.textField]}>
                            <TextInput
                                ref={'address'}
                                style={[GlobalStyles.textFieldInput]}
                                placeholder={'Địa chỉ liên hệ của bạn'}
                                placeholderTextColor={Colors.SILVER}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                selectionColor={Colors.PRIMARY}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                spellCheck={false}
                                onFocus={()=>{this.setState({editing: true})}}
                                onBlur={()=>{this.setState({editing: false})}}
                                onChangeText={(text) => this.setState({address: text})}
                            />
                        </View>
                        <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                            <View style={NewUserFormStyles.selectPickerLabel}>
                                <Text style={NewUserFormStyles.selectPickerLabelText}>Tỉnh/Thành phố</Text>
                            </View>
                            <View style={NewUserFormStyles.selectPickerField}>
                                <WALocation level={1} placeholder={'Chọn tỉnh/thành phố'}/>
                            </View>
                        </View>
                        <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                            <View style={NewUserFormStyles.selectPickerLabel}>
                                <Text style={NewUserFormStyles.selectPickerLabelText}>Quận/huyện</Text>
                            </View>
                            <View style={NewUserFormStyles.selectPickerField}>
                                <WALocation placeholder={'Chọn quận/huyện'} level={2} />
                            </View>
                        </View>
                        <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                            <View style={NewUserFormStyles.selectPickerLabel}>
                                <Text style={NewUserFormStyles.selectPickerLabelText}>Phường/xã</Text>
                            </View>
                            <View style={NewUserFormStyles.selectPickerField}>
                                <WALocation placeholder={'Chọn phường/xã'} level={3} />
                            </View>
                        </View>
                        <WAButton
                            text={"Hoàn tất"}
                            style={[Styles.button]}
                            onPress={this.onSubmit}
                        />
                    </View>
                </ScrollView>
                <WALoading show={this.props.location.fetching || this.props.account.fetching}/>
            </PageContainer>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            location: state.location
        }
    },
    {
        clearError,
        loadLocationLv1,
        registerStepFinal
    }
)(NewUserInfoStepTwoScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {
        fontFamily: GlobalStyles.FONT_NAME
    },
    button: {
        marginTop: 15,
        marginBottom: 0,
    },
    avatarPickerText: {
        color: Colors.SILVER,
        marginLeft: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    avatarImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 80
    },
    textField: {
        marginBottom: 30
    },
    message: {
        color: Colors.ERROR,
        fontSize: 15,
        marginBottom: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    selectPickerWrapper: {
        marginBottom: 15
    }
});
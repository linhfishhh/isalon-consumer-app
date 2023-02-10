import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';
import {clearError, registerStepThree} from "../redux/account/actions";
import {NavigationEvents} from "react-navigation";

type Props = {};
class NewUserInfoStepOneScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            avatar: ImageSources.IMG_AVATAR,
            avatarData: undefined,
            editing: false
        }
    }

    onSubmit = () => {
        this.refs.email.blur();
        this.refs.name.blur();
        this.props.registerStepThree(this.state.name, this.state.email, this.state.avatarData?{
            uri: this.state.avatarData.path,
            type: this.state.avatarData.mime,
            name: this.state.avatarData.filename
        }:undefined, this.props.navigation);
    };
    pickAvatar = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            mediaType: 'photo'
        }).then(image => {
            this.setState({
                avatar: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                avatarData: image
            });
        });
    };

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
                {
                    !this.state.editing?
                        <Text key={1} style={[GlobalStyles.pageTitle, NewUserFormStyles.pageTitle, Styles.pageTitle]}>
                            Thông tin{"\n"}Cá nhân mới
                        </Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text key={2} style={NewUserFormStyles.step}>Bước 1/2</Text>
                        :undefined
                }
                {
                    !this.state.editing?
                        <TouchableOpacity key={3} style={Styles.avatarPickerWrapper} onPress={this.pickAvatar}>
                            <Image style={Styles.avatarImage} source={this.state.avatar}/>
                            <Text style={Styles.avatarPickerText}>Tải ảnh đại diện của bạn</Text>
                        </TouchableOpacity>
                        :undefined
                }
                {
                    !this.state.editing?
                        <Text key={4} style={Styles.message}>{this.props.account.errorMessage}</Text>
                        :undefined
                }
                <View>
                    <View style={[GlobalStyles.textField, Styles.textField]}>
                        <Text style={[GlobalStyles.textFieldLabel]}>Họ và tên</Text>
                        <TextInput
                            ref={'name'}
                            style={[GlobalStyles.textFieldInput]}
                            placeholder={'Họ tên của bạn'}
                            placeholderTextColor={Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.PRIMARY}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            onFocus={() => {
                                this.setState({editing: true})
                            }}
                            onBlur={() => {
                                this.setState({editing: false})
                            }}
                            onChangeText={(text) => this.setState({name: text})}
                        />
                    </View>
                    <View style={[GlobalStyles.textField, GlobalStyles.textField, Styles.textField]}>
                        <Text style={[GlobalStyles.textFieldLabel]}>Email liên hệ</Text>
                        <TextInput
                            ref={'email'}
                            style={[GlobalStyles.textFieldInput]}
                            placeholder={'Nhập địa chỉ email cá nhân'}
                            placeholderTextColor={Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.PRIMARY}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            onFocus={() => {
                                this.setState({editing: true})
                            }}
                            onBlur={() => {
                                this.setState({editing: false})
                            }}
                            onChangeText={(text) => this.setState({email: text})}
                        />
                    </View>
                    <WAButton
                        text={"Tiếp theo"}
                        style={[Styles.button]}
                        iconLeft={false}
                        icon={'angle-right'}
                        onPress={this.onSubmit}
                    />
                </View>
                <WALoading show={this.state.loading}/>
            </PageContainer>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    state=> {
        return {
            account: state.account
        }
    },
    {
        clearError,
        registerStepThree
    }
)(NewUserInfoStepOneScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {},
    button: {
        marginTop: 0,
        marginBottom: 0,
    },
    avatarPickerWrapper: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
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
        borderRadius: 40
    },
    textField: {
        marginBottom: 30
    },
    message: {
        color: Colors.ERROR,
        fontSize: 15,
        marginBottom: 15,
        fontFamily: GlobalStyles.FONT_NAME
    }
});
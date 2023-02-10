import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import {facebookLogin} from  '../auth';
import {updateInfo as updateAccountInfo} from "../redux/account/actions";
import {connect} from "react-redux";

type Props = {};
class AccessScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            hasBack: this.props.navigation.getParam('hasBack')?this.props.navigation.getParam('hasBack'):false
        };
    }
    render() {
        return (
            <PageContainer
                backgroundImage={ImageSources.BG_ACCESS}
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
            >

                {
                    Platform.OS !== 'ios' ?
                        <WAButton
                            onPress={()=>{
                                facebookLogin((data)=>{
                                    this.props.navigation.navigate('social_checking', {
                                        data: data
                                    });
                                })
                            }}
                            text={"Tiếp tục với Facebook"}
                            style={[Styles.button, Styles.buttonFacebook]}
                            textStyle={Styles.buttonFacebookText}
                            iconStyle={Styles.buttonFacebookIcon}
                            icon={'facebook-f'}
                        />
                        :
                        <WAButton
                            text={"Đăng nhập"}
                            style={[Styles.button, Styles.buttonLogin, Styles.buttonLoginAlt]}
                            onPress={()=>{this.props.navigation.push('login')}}
                        />
                }
                <WAButton
                    text={"Đăng ký tài khoản"}
                    style={[Styles.button, Styles.buttonLogin]}
                    onPress={()=>{this.props.navigation.push('register')}}
                />
                {
                    Platform.OS !== 'ios'?
                        <TouchableOpacity style={Styles.link} onPress={()=>{this.props.navigation.push('login_methods')}}>
                            <Text style={Styles.linkText}>Thêm lựa chọn</Text>
                        </TouchableOpacity>
                        :
                        undefined
                }
                <Text style={Styles.tosText}>Click đăng ký nghĩa là bạn đồng ý với</Text>
                <TouchableOpacity style={Styles.tosLink} onPress={()=>{this.props.navigation.navigate('home_account_tos')}}>
                    <Text style={Styles.tosLinkText}>Các quy định sử dụng và chính sách bảo mật</Text>
                </TouchableOpacity>
                <View style={Styles.skipToHome}>
                    <TouchableOpacity style={[Styles.link, Styles.linkSkip]} onPress={async ()=>{
                        if(this.state.hasBack){
                            this.props.navigation.goBack();
                        }
                        let index = 2;
                        try {
                            index = await AsyncStorage.getItem('@iSalon:tabIndex');
                            index = index * 1;
                            this.props.updateAccountInfo({
                                tabIndex: index
                            });
                        }
                        catch (e) {
                        }
                        this.props.navigation.replace('home');
                    }}>
                        <Text style={Styles.linkText}>{this.state.hasBack?'Để lần sau đăng nhập':'Bỏ qua đăng nhập'} ></Text>
                    </TouchableOpacity>
                </View>
            </PageContainer>
        )
    }
}

export default connect(
    state=>{
        return {
            account: state.account,
        }
    },
    {updateAccountInfo}
)(AccessScreen);


const Styles = StyleSheet.create({
    skipToHome:{
        position: 'absolute',
        bottom: 30,
    },
    pageWrapper: {
        alignItems: 'center'
    },
    button: {
        marginTop: 15,
        marginBottom: 15
    },
    buttonFacebook: {
        backgroundColor: Colors.LIGHT
    },
    buttonFacebookText: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    buttonFacebookIcon: {
        color: Colors.PRIMARY,
    },
    buttonLogin: {
        backgroundColor: Colors.GRAY,
    },
    buttonLoginAlt: {
        backgroundColor: Colors.PRIMARY
    },
    link: {
        marginTop: 15,
        marginBottom: 15
    },
    linkText: {
        color: Colors.LIGHT,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    linkSkip: {

    },
    tosText: {
        marginTop: 15,
        fontSize: 14,
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME
    },
    tosLink: {

    },
    tosLinkText:{
        fontSize: 14,
        color: Colors.LIGHT,
        textDecorationLine: 'underline',
        fontFamily: GlobalStyles.FONT_NAME
    }
});


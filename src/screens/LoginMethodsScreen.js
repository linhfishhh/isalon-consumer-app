import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import {facebookLogin, googleLogin} from "../auth";
import WALoading from "../components/WALoading";

type Props = {};
export default class LoginMethodsScreen extends Component<Props> {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <PageContainer
                backgroundImage={ImageSources.BG_ACCESS}
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
            >
                <WAButton
                    text={"Facebook"}
                    style={[Styles.button]}
                    textStyle={Styles.buttonText}
                    iconStyle={Styles.buttonIcon}
                    iconFloat={true}
                    icon={'facebook-f'}
                    onPress={()=>{
                        facebookLogin((data)=>{
                            this.props.navigation.navigate('social_checking', {
                                data: data
                            });
                        });
                    }}
                />
                <WAButton
                    text={"Google"}
                    style={[Styles.button]}
                    textStyle={Styles.buttonText}
                    iconStyle={Styles.buttonIcon}
                    iconFloat={true}
                    icon={'google'}
                    onPress={()=>{
                        googleLogin((data)=>{
                            this.props.navigation.navigate('social_checking', {
                                data: data
                            });
                        });
                    }}
                />
                <WAButton
                    text={"Đăng nhập"}
                    style={[Styles.button, Styles.buttonLogin]}
                    onPress={()=>{this.props.navigation.push('new_login')}}
                />
            </PageContainer>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center'
    },
    button: {
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: Colors.LIGHT,
    },
    buttonIcon: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    buttonText: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    buttonLogin: {
        backgroundColor: Colors.GRAY
    },
});
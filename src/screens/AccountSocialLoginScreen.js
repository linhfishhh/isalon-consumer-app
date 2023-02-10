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
import {BallIndicator, DotIndicator, MaterialIndicator, SkypeIndicator, PulseIndicator, WaveIndicator, BarIndicator,
    PacmanIndicator
} from 'react-native-indicators';
import {connect} from 'react-redux';
import {
    determineAccessRoute,
    loadSettings,
    saveAccountSettings,
    updateInfo as updateAccountInfo
} from '../redux/account/actions';
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import { authService } from '../shop/services';

type Props = {};
class AccountSocialLoginScreen extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            alert: false,
            data: this.props.navigation.getParam('data')
        };
    }

    _checkExist = async () => {
        try {
            let rq = await Utils.getAxios().post(
                'social/login',
                {
                    token: this.state.data.token,
                    provider: this.state.data.provider
                }
            );
            let data = rq.data;
            //return;
            if(data.exist){
                let route = await determineAccessRoute();
                let settings = await loadSettings();
                this.props.updateAccountInfo({
                    ...data.login.user,
                    token: data.login.token,
                    tabIndex: settings.tabIndex
                });
                await saveAccountSettings([
                    [
                        '@iSalon:token',
                        data.login.token
                    ]
                ]);
                await authService.login(data.login.user.user_id);
                this.props.navigation.replace(route);
            }
            else{
                this.props.navigation.replace('social_phone', {
                    data: this.state.data
                })
            }
        }
        catch (e) {
            this.setState({
                alert: true
            });
        }
    };

    componentDidMount(){
        this._checkExist();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.DARK
                }}
            >
                <WAAlert show={this.state.alert} title={'Lỗi đăng nhập'} question={'Lỗi khi xác nhận tài khoản mạng xã hội của hội với hệ thống của iSalon'}
                    yes={()=>{
                        this.setState({
                            alert: false
                        }, ()=>{
                            this.props.navigation.goBack()
                        });
                    }} no={false} yesTitle={'Quay lại'}
                         titleFirst={true}
                />
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'light-content'}
                />
                {
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({

});

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
        updateAccountInfo
    }
) (AccountSocialLoginScreen)
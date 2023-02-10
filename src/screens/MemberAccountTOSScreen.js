import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, WebView} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import Utils from '../configs';

type Props = {};
class MemberAccountTOSScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            content: ''
        }
    }

    _loadContent = () => {
        this.setState({
            loading: true
        }, async() => {
            try {
                let rq = await Utils.getAxios().post(
                    'get-join-tos'
                );
                this.setState({
                    loading: false,
                    content: rq.data
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
            }
        });
    };

    componentDidMount(){
        this._loadContent();
    }

    render() {
        return (
            <PageContainer
                darkTheme={true}
                navigationButtonStyle={{color: Colors.PRIMARY}}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper, {justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 0}]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
            >
                {
                    this.state.loading?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        :
                        <View style={{paddingLeft: 20, paddingRight: 20, flex: 1}}>
                            <View style={Styles.title}>
                                <Text style={Styles.titleText}>Quy định sử dụng và chính sách bảo mật</Text>
                            </View>
                            <WebView
                                style={Styles.contentWeb}
                                originWhitelist={['*']}
                                startInLoadingState={true}
                                source={
                                    {
                                        baseUrl: '',
                                        html: this.state.content
                                    }
                                }
                                scalesPageToFit={Platform.OS !== 'ios'}
                            />
                        </View>
                }
            </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
    }
)(MemberAccountTOSScreen);

const Styles = StyleSheet.create({
    title: {
        marginBottom: 30,
        paddingRight: 20
    },
    titleText: {
        fontSize: 34,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME
    },
    contentWeb: {
        flex: 1,
    }
});
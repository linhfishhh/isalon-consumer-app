import React,  { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, StatusBar, View
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../styles/GlobalStyles";

export default class WAAlert extends Component<Props> {
    static defaultProps = {
        show: false,
        title: '',
        question: '',
        yes: () => {},
        no: () => {},
        yesTitle: 'Đồng ý',
        noTitle: 'Không',
        titleFirst: false,
        onBack: ()=>{},
        onDismiss: ()=>{},
        style: {}
    };


    constructor(props) {
        super(props)
    };

    render() {
        return (
            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                hasBackdrop={false}
                onBackButtonPress={()=>{
                    if(this.props.no !== false){
                        this.props.no();
                    }
                    else{
                        this.props.onBack()
                    }
                }}
                isVisible={this.props.show}
                style={{ marginHorizontal:0, marginVertical: 0 }}
                onModalHide={this.props.onDismiss}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0.7)'}
                    barStyle={'light-content'}
                />
                <View  style={[Styles.modal, this.props.style]}>
                    <View style={Styles.modalInner}>
                        {
                            this.props.titleFirst?
                                <Text style={Styles.modalTitle}>{this.props.title}</Text>:undefined
                        }
                        <Text style={Styles.modalQuestion}>{this.props.question}</Text>
                        {
                            !this.props.titleFirst?
                                <Text style={Styles.modalTitle}>{this.props.title}</Text>:undefined
                        }
                        <View style={Styles.modalButtons}>
                            {
                                this.props.no !==false?
                                    <TouchableOpacity onPress={()=>{this.props.no()}} style={Styles.modalButton}>
                                        <Text style={Styles.modalButtonText}>{this.props.noTitle}</Text>
                                    </TouchableOpacity>
                                    :undefined
                            }
                            {
                                this.props.yes !== false?
                                    <TouchableOpacity
                                        onPress={()=>{this.props.yes()}}
                                        style={[Styles.modalButton, Styles.modalButtonAgree]}>
                                        <Text style={[Styles.modalButtonText, Styles.modalButtonAgreeText]}>{this.props.yesTitle}</Text>
                                    </TouchableOpacity>
                                    :undefined
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
}

const Styles = StyleSheet.create({
    modal:{
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    modalInner:{
        backgroundColor: Colors.LIGHT,
        marginRight: 30,
        marginLeft: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 50,
        paddingBottom: 50,
        borderRadius: 5,
        width: '100%'
    },
    modalQuestion:{
        color: Colors.TEXT_DARK,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalButtons: {
        flexDirection: 'row'
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
        textAlign: 'center',
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
    }
});

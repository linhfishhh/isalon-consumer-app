import React,  { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    StyleSheet,
    ViewPropTypes,
    Picker,
    StatusBar,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../styles/GlobalStyles";
import ModalSelector from 'react-native-modal-selector'


export default class WASelect extends Component<Props> {
    static defaultProps = {
        placeholder: 'Chọn một lựa chọn',
        onChanged: undefined,
        value: null,
        items: [],
        wrapperStyle: undefined,
        selectStyle: undefined,
        iconStyle: undefined
    };
    static propTypes = {
        onChanged: PropTypes.func,
        placeholder: PropTypes.string,
        items: PropTypes.array,
    };
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            valueTitle: '',
            items: this.props.items,
            modalOpened: false,
            placeholder: this.props.placeholder
        };
    };
    componentDidMount(){
        this.state.items.every((item)=>{
            if(item.value === this.state.value){
                this.setState({
                    valueTitle: item.label,
                });
            }
            else{
                return item
            }
        });
    }
    onChanged = (option) => {
        this.setState({
            valueTitle: option.label,
            value: option.value
        });
        if(this.props.onChanged){
            this.props.onChanged(option);
        }
    };
    onModalOpen = () => {
        this.setState({modalOpened: true})
    };
    onModalClose = () => {
        this.setState({modalOpened: false})
    };
    render() {
        return (
            <View style={[Styles.wrapper, this.props.wrapperStyle]}>
                {
                    this.state.modalOpened?
                        <StatusBar
                            backgroundColor = 'rgba(33,35,44, 0.95)'
                            barStyle={'light-content'}
                        />:
                        undefined
                }
                <ModalSelector
                    data={this.state.items}
                    animationType={'none'}
                    onModalOpen={()=>{this.onModalOpen()}}
                    onModalClose={()=>{this.onModalClose()}}
                    overlayStyle={Styles.overlayStyle}
                    cancelText={'Đóng lại'}
                    cancelStyle={Styles.cancelStyle}
                    onChange={(option)=>{this.onChanged(option)}}
                    keyExtractor={(item)=>{return item.value+'-'+Date.now()+'-'+Math.random()}}
                    cancelTextStyle={Styles.cancelTextStyle}
                    optionContainerStyle={Styles.optionContainerStyle}
                    optionTextStyle={Styles.optionTextStyle}
                >
                    <TextInput style={[Styles.select, this.props.selectStyle]}
                               editable={false}
                               placeholder={this.state.placeholder}
                               placeholderStyle={Styles.selectPlaceholder}
                               ellipsizeMod={'tail'}
                               numberOfLines={1}
                               value={this.state.valueTitle}
                    />
                </ModalSelector>
                <Icon name={'caret-down'} style={[Styles.icon, this.props.iconStyle]} />
            </View>
        );
    };
}

const Styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        borderColor: Colors.PRIMARY,
        borderWidth: 1,
        borderRadius: 5,
    },
    icon: {
        position: 'absolute',
        fontSize: 15,
        color: Colors.TEXT_DARK,
        height: 45,
        lineHeight: 45,
        right: 10,
        top: 0
    },
    overlayStyle: {
        backgroundColor : 'rgba(33,35,44, 0.95)'
    },
    select: {
        height: 45,
        justifyContent: 'center',
        paddingLeft: 10,
        marginRight: 20,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    selectPlaceholder: {
        color: Colors.SILVER_LIGHT
    },
    cancelStyle:{
        backgroundColor: Colors.PRIMARY
    },
    cancelTextStyle: {
        color: Colors.LIGHT
    },
    optionContainerStyle: {
        backgroundColor: Colors.LIGHT
    },
    optionTextStyle: {
        color: Colors.TEXT_DARK,
        fontSize: 12
    }
});

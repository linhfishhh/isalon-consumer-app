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
import {connect} from 'react-redux';
import {setLv1, setLv2, setLv3} from "../redux/location/actions";


class WALocation extends Component<Props> {
    static defaultProps = {
        placeholder: 'Chọn một lựa chọn',
        onChanged: undefined,
        value: null,
        items: [],
        wrapperStyle: undefined,
        selectStyle: undefined,
        iconStyle: undefined,
        level: undefined
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
        if (this.props.level === 1){
            this.props.setLv1(option.value);
            if(this.props.onChanged){
                this.props.onChanged(option.value, option.label);
            }
        }
        else if (this.props.level === 2){
            this.props.setLv2(option.value);
            if(this.props.onChanged){
                this.props.onChanged(option.value, option.label);
            }
        }
        else{
            this.props.setLv3(option.value);
            if(this.props.onChanged){
                this.props.onChanged(option.value, option.label);
            }
        }
    };
    onModalOpen = () => {
        this.setState({modalOpened: true})
    };
    onModalClose = () => {
        this.setState({modalOpened: false})
    };
    render() {
        let items, value, title;
        if (this.props.level === 1){
            items = this.props.location.lv1;
            value = this.props.location.lv1Value;
            title = this.props.location.lv1Title;
        }
        else if (this.props.level === 2){
            items = this.props.location.lv2;
            value = this.props.location.lv2Value;
            title = this.props.location.lv2Title;
        }
        else{
            items = this.props.location.lv3;
            value = this.props.location.lv3Value;
            title = this.props.location.lv3Title;
        }
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
                    data={items}
                    animationType={'none'}
                    onModalOpen={()=>{this.onModalOpen()}}
                    onModalClose={()=>{this.onModalClose()}}
                    overlayStyle={Styles.overlayStyle}
                    cancelText={'Đóng lại'}
                    cancelStyle={Styles.cancelStyle}
                    onChange={this.onChanged}
                    keyExtractor={(item)=>{return item.value+'-'+Date.now()+'-'+Math.random()}}
                    cancelTextStyle={Styles.cancelTextStyle}
                    optionContainerStyle={Styles.optionContainerStyle}
                    optionTextStyle={Styles.optionTextStyle}
                    disabled={
                        this.props.level === 2 ? this.props.location.lv1Value === undefined :
                            this.props.level === 3 ?
                                this.props.location.lv2Value === undefined
                                :false
                    }
                >
                    <TextInput style={[Styles.select, this.props.selectStyle]}
                               editable={false}
                               placeholder={this.state.placeholder}
                               placeholderStyle={Styles.selectPlaceholder}
                               ellipsizeMod={'tail'}
                               numberOfLines={1}
                               value={title}
                    />
                </ModalSelector>
                <Icon name={'caret-down'} style={[Styles.icon, this.props.iconStyle]} />
            </View>
        );
    };
}

export default connect(
    state => {
        return {
            location: state.location
        }
    },
    {
        setLv1,
        setLv2,
        setLv3
    }
)(WALocation);

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

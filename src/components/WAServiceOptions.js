import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet, StatusBar, Modal, View
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons'
import GlobalStyles from "../styles/GlobalStyles";
import numeral from 'numeral';
import ImageSources from "../styles/ImageSources";

export default class WAServiceOptions extends Component<Props> {
    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            onSubmit: undefined,
            selected: undefined,
            service: undefined,
            price: undefined,
            priceIncluded: undefined,
            listChecked: [] //this.state.service.includedOptions[index]
        };
    };

    show = (service, onSubmit) => {
        this.setState({
            show: true,
            onSubmit: onSubmit,
            selected: service.options ? service.options[0] : undefined,
            service: service,
            price: service.options[0].final_price / 1000,
            priceIncluded: 0,
            listChecked: []
        })
    };

    hide = () => {
        this.setState({
            price: undefined,
            priceIncluded: undefined, 
            show: false,
        });
    };

    _submit = () => {
        this.setState({
            show: false
        }, () => {
            if (this.state.onSubmit) {
                this.state.onSubmit(this.state.selected, this.state.listChecked);
            }
        });
    };
    
    componentWillMount = () => {
        this.setState({
        })
    }

    render() {
        if (!this.state.show) {
            return null;
        }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={this.hide}
                visible={this.props.show}>

                <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0.82)'}
                    barStyle={'light-content'} />

                <TouchableOpacity
                    style={[Styles.modal]}
                    onPress={this.hide}>

                    <View style={Styles.modalInner}>
                        <View style={Styles.header}>
                            <Text style={Styles.title}>{this.state.service.name}</Text>
                            <Icon style={Styles.serviceCloseIcon} name={'clear'} />
                        </View>

                        <View style={Styles.list}>
                            <FlatList
                                style={Styles.options}
                                data={this.state.service.options}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />
                        </View>
                    </View>

                    <View style={Styles.modalInner}>
                        <View style={Styles.header}>
                            <Text style={Styles.title}>{"Dịch vụ kèm theo"}</Text>
                        </View>

                        <View style={Styles.list}>
                            <FlatList
                                style={Styles.options}
                                data={this.state.service.includedOptions}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItemIncludedOptions}
                            />
                        </View>
                    </View>

                    <View style={Styles.cart}>
                        <View style={Styles.cartAmount}>
                            {ImageSources.SVG_ICON_CART}
                            <View style={Styles.cartAmountTextWrapper}>
                                <Text style={Styles.cartAmountText}>
                                    {"1" /* {this.props.cart.items.length} */}
                                </Text>
                            </View>
                        </View>
                        <Text style={Styles.cartSum}>{this.state.price}K</Text>
                        <View style={Styles.cartButtonWrapper}>
                            <TouchableOpacity
                                style={Styles.cartButton} activeOpacity={0.8}
                                onPress={this._submit}>
                                <Text style={Styles.cartButtonText}>Đặt chỗ ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    _keyExtractor = (item, index) => {
        return item.id + '';
    };

    _select = (item) => {
        this.setState({
            selected: item
        })
    };
    
    _selectListChecked = (item) => {
        if (this.state.listChecked.length >= 0) {
            let checkExits = false
            var listCheckedNew = []
            this.state.listChecked.forEach((obj) => {
                if (obj.id === item.id) {
                    checkExits = true
                } else {
                    listCheckedNew.push(obj);
                }
            })
            if (!checkExits) {
                listCheckedNew.push(item);
                //Add Item --- Change Price 
                this.setState(
                    (prevState) => ({
                        priceIncluded: prevState.priceIncluded + item.org_price / 1000,
                        price: prevState.price + item.org_price / 1000
                    })
                )
            } else {
                //Delete Item --- Change Price 
                this.setState(
                    (prevState) => ({
                        priceIncluded: prevState.priceIncluded - item.org_price / 1000,
                        price: prevState.price - item.org_price / 1000
                    })
                )
            }
            this.setState({
                listChecked: listCheckedNew
            });
        }
    };

    _checkListChecked = ({ item }) => {
        var check = false
        if (this.state.listChecked.length >= 0) {
            this.state.listChecked.forEach((obj) => {
                if (obj.id == item.id) {
                    check = true
                }
            })
        }
        return check
    }
    
    _renderItem = ({ item }) => {
        return <TouchableOpacity
            onPress={() => {
                this._select(item)
                this.setState({ price: item.final_price / 1000 + this.state.priceIncluded});
            }}
            style={Styles.option}>
            <Icon style={Styles.optionIcon} name={'radio-button-' + (this.state.selected.id === item.id ? 'checked' : 'unchecked')} />
            <View style={Styles.info}>
                <Text style={Styles.optionText}>{item.name}</Text>
                <View style={Styles.prices}>
                    <Text style={Styles.finalPrice}>{numeral(item.final_price).format('0,0')}đ</Text>
                    {
                        item.final_price !== item.org_price ?
                            <Text style={Styles.orgPrice}>{numeral(item.org_price).format('0,0')}đ</Text>
                            : undefined
                    }
                </View>
            </View>
        </TouchableOpacity>
    };
    
    _renderItemIncludedOptions = ({ item}) => {
        return <TouchableOpacity
            onPress={() => {
                this._selectListChecked(item)
            }}
            style={Styles.option}>
            <Icon style={Styles.optionIcon} name={'check-box' + (this._checkListChecked({ item }) ? '' : '-outline-blank')} />
            <View style={Styles.info}>
                <Text style={Styles.optionText}>{item.name}</Text>
                <View style={Styles.prices}>
                    <Text style={Styles.finalPrice}>+ {numeral(item.org_price).format('0,0')}đ</Text>
                    {
                        item.org_price !== item.org_price ?
                            <Text style={Styles.orgPrice}>+ {numeral(item.org_price).format('0,0')}đ</Text>
                            : undefined
                    }
                </View>
            </View>
        </TouchableOpacity>
    };
}


const Styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0.82)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 0,
        paddingRight: 0,
    },
    header: {
        backgroundColor: "#F1F1F1",
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        width: '100%',
    },
    modalInner: {
        backgroundColor: Colors.LIGHT,
        paddingTop: 0,
        paddingBottom: 20,
        width: '100%',

    },
    title: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 5,
        flex: 1,
        textTransform: 'uppercase',
    },
    list: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    options: {
        maxHeight: 240
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    optionIcon: {
        marginRight: 10,
        fontSize: 25,
        color: Colors.PRIMARY
    },
    info: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },
    optionText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK,
        flex: 1,
    },
    prices: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    orgPrice: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.SILVER,
        textDecorationLine: 'line-through'
    },
    finalPrice: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.PRIMARY,
        marginRight: 5,
    },
    cart: {
        backgroundColor: Colors.PRIMARY,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cartAmount: {
        position: 'relative',
        marginRight: 15
    },
    cartAmountTextWrapper: {
        position: 'absolute',
        right: -5,
        top: -5,
        width: 20,
        height: 20,
        backgroundColor: Colors.DARK,
        borderRadius: 10
    },
    cartAmountText: {
        color: Colors.LIGHT,
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 12
    },
    cartSum: {
        color: Colors.LIGHT,
        fontSize: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
    },
    cartButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cartButton: {
        backgroundColor: Colors.LIGHT,
        height: 40,
        justifyContent: 'center',
        borderRadius: 5,
        width: 120,
    },
    cartButtonText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
    },
    serviceCloseIcon: {
        color: Colors.TEXT_DARK,
        fontSize: 32
    }
});

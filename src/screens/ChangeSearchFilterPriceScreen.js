import React, {Component} from 'react';
import {ScrollView, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import Utils from '../configs';
import numeral from 'numeral';
import  SearchInput, { createFilter } from 'react-native-search-filter';
import slugify from 'slugify';

type Props = {};
export default class ChangeSearchFilterPriceScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            price: this.props.navigation.getParam('price')/1000,
        };
    }

    componentDidMount(){
    }

    _apply = () =>{
        let f = this.state.price;
        if(isNaN(f)){
            Alert.alert('iSalon', 'Khoảng giá bạn nhập không hợp lệ');
            return 0;
        }
        if(f<0){
            Alert.alert('iSalon', 'Khoảng giá bạn nhập không hợp lệ');
            return 0;
        }
        let fn = this.props.navigation.getParam('apply');
        fn(this.state.price*1000);
        this.props.navigation.goBack();
    };

    _priceText = () => {
        let f = this.state.price;
        if(!f){
            return 'Giá bất kỳ'
        }
        if(f<0){
            return 'Giá không hợp lệ'
        }
        return 'Lọc giá từ: '+numeral(f).format('0,000')+'K';
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                headerTitle={'LỌC GIÁ'}
                headerTitleStyle={{fontSize: 16, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>:
                        <View style={{flex: 1}}>
                            <View style={Styles.selectCats}>
                                <Text style={Styles.selectCatsText}>{this._priceText()}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        let fn = this.props.navigation.getParam('apply');
                                        fn(0);
                                        this.props.navigation.goBack();
                                    }}
                                    style={Styles.selectCatsTextReset}>
                                    <Text style={Styles.selectCatsTextResetText}>
                                        Lọc giá bất kỳ
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={Styles.form}>
                                <View style={Styles.inputGroup}>
                                    <Text style={Styles.inputLabel}>Giá từ (Nghìn đồng)</Text>
                                    <TextInput
                                        value={this.state.price+''}
                                        keyboardType={'numeric'}
                                        placeholder={'Giá từ...'}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        returnKeyType={'done'}
                                        style={Styles.input}
                                        onChangeText={(v) => {
                                            this.setState({
                                                price: v*1
                                            });
                                        }}
                                    />
                                </View>
                            </ScrollView>
                            <View style={Styles.saveBar}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.props.navigation.goBack();
                                    }}
                                    style={[Styles.saveBarBtn, Styles.saveBarBtnClose]}>
                                    <Text style={Styles.saveBarbtnText}>HUỶ BỎ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this._apply}
                                    style={[Styles.saveBarBtn]}>
                                    <Text style={Styles.saveBarbtnText}>LƯU LẠI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </PageContainer>
        )
    }
}


const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },

    form: {
      flex: 1,
      padding: 15,
    },

    inputGroup: {
        marginBottom: 15
    },

    inputLabel: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14,
        marginBottom: 10
    },

    input: {
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 3,
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 20
    },

    selectCats: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.PRIMARY
    },

    selectCatsTextReset: {
        backgroundColor: Colors.TEXT_DARK,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 2
    },
    selectCatsTextResetText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 12,
    },

    selectCatsText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 14,
        flex: 1
    },

    item: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    itemText: {
        textTransform: 'uppercase',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 12,
        flex: 1
    },

    itemIcon: {
        color: Colors.PRIMARY,
        fontSize: 25,
    },

    itemImage: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },

    saveBar: {
        backgroundColor: Colors.DARK,
        flexDirection: 'row'
    },
    saveBarBtn: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        margin: 15,
        borderRadius: 2
    },
    saveBarbtnText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontSize: 14
    },
    saveBarBtnClose: {
        backgroundColor: Colors.SILVER_DARK
    }
});
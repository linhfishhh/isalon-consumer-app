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
const RadiusList = Utils.getRadiusList();
export default class ChangeSearchRadiusScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            selectIndex: this.props.navigation.getParam('selectIndex'),
        };
    }

    componentDidMount(){
    }

    _apply = () =>{
        let fn = this.props.navigation.getParam('apply');
        fn(this.state.selectIndex);
        this.props.navigation.goBack();
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
                headerTitle={'BÁN KÍNH'}
                headerTitleStyle={{fontSize: 16, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
            >
                <View style={{flex: 1}}>
                            <ScrollView style={{flex: 1}}>
                                {
                                    RadiusList.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={()=>{
                                                    this.setState({
                                                        selectIndex: index
                                                    });
                                                }}
                                                style={Styles.item}>
                                                <Icon style={Styles.itemIcon} name={'radio-button-'+(this.state.selectIndex===index?'checked':'unchecked')}/>
                                                <Text style={Styles.itemText}>{numeral(item).format('0,0')} mét</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
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
                                    <Text style={Styles.saveBarbtnText}>ÁP DỤNG</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
            </PageContainer>
        )
    }
}


const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },

    item: {
      flexDirection: 'row',
      padding: 15,
        alignItems: 'center',
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },

    itemIcon: {
      fontSize: 26,
        marginRight: 10,
        color: Colors.PRIMARY
    },

    itemText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 16
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
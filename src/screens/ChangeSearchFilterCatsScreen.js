import React, {Component} from 'react';
import {ScrollView, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
export default class ChangeSearchFilterCatsScreen extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            cats: [],
            selected_cats: this.props.navigation.getParam('selected_cats')
        };
    }
    _loadData = () => {
        this.setState({
            loading: true
        }, async ()=>{
            try{
                let rq = await Utils.getAxios().post('search/filter-cats');
                this.setState({
                    loading: false,
                    cats: rq.data,
                });
            }
            catch (e) {
            }
        });
    };

    componentDidMount(){
        this._loadData();
    }

    _selectCat = (id) => {
        if(this.state.selected_cats.indexOf(id) === -1){
            this.setState({
                selected_cats: [
                    ...this.state.selected_cats,
                    id
                ]
            });
        }
        else{
            this.setState({
                selected_cats: this.state.selected_cats.filter((item, index)=>{
                    return item !== id;
                })
            });
        }
    };

    _apply = () =>{
        let fn = this.props.navigation.getParam('apply');
        fn(this.state.selected_cats);
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
                headerTitle={'LỌC DANH MỤC'}
                headerTitleStyle={{fontSize: 16, fontFamily: GlobalStyles.FONT_NAME, color: Colors.LIGHT}}
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>:
                        <View style={{flex: 1}}>
                            <View style={Styles.selectCats}>
                                <Text style={Styles.selectCatsText}>{this.state.selected_cats.length} Danh mục đã được chọn</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            selected_cats: []
                                        });
                                    }}
                                    style={Styles.selectCatsTextReset}>
                                    <Text style={Styles.selectCatsTextResetText}>
                                        Bỏ chọn hết
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{flex: 1}}>
                                {
                                    this.state.cats.map((item, index) => {
                                        return <TouchableOpacity
                                            key={index}
                                            style={Styles.item}
                                            onPress={()=>{
                                                this._selectCat(item.id);
                                            }}
                                        >
                                            <Image style={Styles.itemImage} source={{uri: item.cover}}/>
                                            <Text style={Styles.itemText}>{item.name}</Text>
                                                {
                                                    this.state.selected_cats.indexOf(item.id)>-1?
                                                        <Icon style={Styles.itemIcon} name={'check-circle'}/>
                                                        :undefined
                                                }
                                        </TouchableOpacity>
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
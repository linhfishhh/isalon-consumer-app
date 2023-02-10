import React, {PureComponent} from 'react';
import {Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DotIndicator} from 'react-native-indicators';
import ImageViewer from "react-native-image-zoom-viewer";

export default class WALightBox extends PureComponent{
    render(){
        return(
            <Modal visible={this.props.show} transparent={true}
                onRequestClose={() => {this.props.onClose()}}>
                <StatusBar
                    translucent={true}
                    backgroundColor= 'black'
                    barStyle={'light-content'}/>
                <View style={Styles.lightbox}>
                    <ImageViewer
                        renderHeader={()=>{
                            return <View style={Styles.headerContainer}>
                                <View style={Styles.headerWrapper}>
                                    <View style={[Styles.HeaderLeft]}>
                                        <TouchableOpacity
                                            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                                            onPress={()=>{
                                                this.props.onClose()
                                            }}>
                                            <Icon style={[Styles.backIcon]} name={"close"}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[Styles.HeaderRight]}>
                                        <Text style={Styles.total}>Có {this.props.items.length} ảnh</Text>
                                    </View>
                                </View>
                            </View>
                        }}
                        renderIndicator={()=>{}}
                        loadingRender={()=>{
                            return  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                                    </View>
                        }}
                        imageUrls={this.props.items}
                        index={this.props.indexselected}/>
                </View>
            </Modal>
        )
    }
}

const Styles = StyleSheet.create({
    lightbox:{
        backgroundColor: 'black',
        flex: 1
    },
    headerContainer:{
        height: Platform.OS === 'ios' ? 50 + getStatusBarHeight(): undefined,
        paddingTop: Platform.OS === 'ios' ? getStatusBarHeight(): undefined,
        position: 'absolute',
        zIndex: 99,
        left: 0,
        top: 0,
        right: 0

    },
    headerWrapper:{
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: 'row',
    },
    HeaderLeft:{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',

    },
    HeaderRight:{
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleText: {
        color: Colors.TEXT_DARK,
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME
    },
    backButton:{
        width: 30
    },
    backIcon:{
        color: Colors.LIGHT,
        fontSize: 30
    },
    total: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    backIconDark: {
        color: Colors.TEXT_DARK,
        fontSize: 30
    }
});
import React, {Component, PureComponent} from "react";
import {
    View,
    Text,
    ImageBackground,
    FlatList,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    TouchableOpacity, TextInput, KeyboardAvoidingView, Platform
} from "react-native";
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import WALightBox from "../components/WALightBox";
import {Svg, Path, G, Rect} from 'react-native-svg';
import {connect} from 'react-redux';
import Utils from '../configs';
import {DotIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialIcons'
import WAButton from "../components/WAButton";
import WAAlert from "../components/WAAlert";
import ImagePicker from "react-native-image-crop-picker";

class HomeWriteReviewScreen extends Component {
    static defaultProps = {
        pageTitle: 'Những tác phẩm đẹp',
    };

    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            editing: false,
            crits: [
            ],
            title: '',
            content: '',
            id: this.props.navigation.getParam('orderID'),
            serviceID: this.props.navigation.getParam('serviceID'),
            onSuccess: this.props.navigation.getParam('onSuccess'),
            error: false,
            errorMessage: '',
            badges: [],
            images: [],
            showBadgeSelector: false,
            badge: undefined,
            showAlert: false,
            alertTitle: '',
            alertMessage: '',
            alertAfter: ()=>{},
        };
    }

    _checkAndGetCrits = () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        }, async () => {
            try{
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'booking/crits',
                    {
                        id: this.state.id,
                        service_id: this.state.serviceID
                    }
                );
                this.setState({
                    fetching: false,
                    crits: rq.data.crits.map((item) => {
                        return {
                            ...item,
                            rating: 3
                        }
                    }),
                    badges: rq.data.badges
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    error: true,
                    errorMessage: e.response.status === 400? e.response.data.message: 'Lỗi xảy ra khi kiểm tra đơn hàng'
                });
            }
        });
    };

    _showBadgeSelector = () => {
        this.title.blur();
        this.content.blur();
        if(this.state.title.trim().length === 0 || this.state.content.trim().length === 0){
            this.setState({
                showAlert: true,
                alertTitle: 'Lỗi thông tin',
                alertMessage: 'Vui lòng nhập đầy đủ tiêu đề và nội dung nhận xét đánh giá',
                alertAfter: ()=>{}
            });
            return;
        }
        this.setState({
            badge: undefined,
            showBadgeSelector: true
        });
    };

    _submit = () => {
        this.setState({
            fetching: true
        }, async() => {
            let form = new FormData();
            form.append('title', this.state.title);
            form.append('content', this.state.content);
            form.append('order_id', this.state.id);
            form.append('service_id', this.state.serviceID);
            if(this.state.badge){
                form.append('badge_id', this.state.badge);
            }
            if(this.state.images.length>0){
                this.state.images.every((image, index) => {
                    form.append('images['+index+']', {
                        uri: image.path,
                        type: image.mime,
                        name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                    });
                    return image;
                });
            }
            this.state.crits.every((item, index) => {
                form.append('crits['+index+'][id]', item.id);
                form.append('crits['+index+'][rating]', item.rating);
                return item;
            });
            try {
                let rq = await Utils.getAxios(this.props.account.token,
                    {
                        'Content-Type': 'multipart/form-data',
                    }
                    ).post(
                    'review/new',
                    form
                );
                this.setState({
                    fetching: false,
                    showAlert: true,
                    alertTitle: 'Nhận xét đánh giá',
                    alertMessage: 'Bạn đã gửi nhận xét đánh giá thành công',
                    alertAfter: ()=>{
                        this.state.onSuccess();
                    }
                });
            }
            catch (e) {
                this.setState({
                    fetching: false,
                    showAlert: true,
                    alertTitle: 'lỗi xảy ra',
                    alertMessage: e.response.status === 400? e.response.data.message: 'Lỗi xảy ra khi lưu nhận xét đánh giá',
                    alertAfter: ()=>{}
                });
            }
        });
    };

    componentDidMount(){
        this._checkAndGetCrits();
    }

    _ratingChanged = (id, value) => {
        this.setState({
            crits: this.state.crits.map((item) => {
                if(item.id === id){
                    return {
                        ...item,
                        rating: value
                    }
                }
                return item;
            })
        });
    };

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={()=>{
                    this.setState({
                        badge: item.id,
                        showBadgeSelector: false
                    }, this._submit);
                }}
                style={Styles.item}>
                <ImageBackground
                    source={item.image?{uri: item.image}:undefined}
                    style={Styles.coverWrapper}>
                </ImageBackground>
                <Text style={Styles.itemTitle}>{item.name}</Text>
            </TouchableOpacity>
        )
    };
    _keyExtractor = ({item}, index) => {
        return 'review-'+index;
    };

    _pickImages = () => {
        ImagePicker.openPicker({
            cropping: false,
            mediaType: 'photo',
            multiple: true
        }).then(async images => {
            let ls = [];
            for(let index in images){
                await ImagePicker.openCropper({
                    path: images[index].path,
                    width: 1024,
                    height: 768,
                    forceJpg: true
                }).then(image => {
                    ls.push(image);
                }).catch(e=>{});
            }
            this.setState({
                images: ls
            });
        });
    };

    render() {
        return (
            this.state.fetching?
                <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                    <DotIndicator count={3} size={10} color={Colors.PRIMARY} />
                </View>
                :
                <View style={{flex: 1}}>
                    {
                        this.state.showAlert?
                            <WAAlert
                                show={true}
                                title={this.state.alertTitle}
                                question={this.state.alertMessage}
                                titleFirst={true}
                                no={false}
                                yes={()=>{this.setState({showAlert: false}, this.state.alertAfter)}}
                                yesTitle={'Đã hiểu'}
                            />
                            :undefined
                    }
                    {
                        this.state.showBadgeSelector?
                            <View style={Styles.badgeSelector}>
                                <View style={Styles.badgeSelectorInner}>
                                    <Text style={Styles.badgeSelectorTitle}>Bạn có hài lòng?</Text>
                                    <Text style={Styles.badgeSelectorDesc}>Hãy một trong những thông điệp sau{'\n'}
                                        coi như một lời cảm ơn tới Salon</Text>
                                    <FlatList
                                        style={Styles.list}
                                        renderItem={this._renderItem}
                                        keyExtractor={this._keyExtractor}
                                        data={this.state.badges}
                                        numColumns={3}
                                    />
                                    <View style={{paddingLeft: 30, paddingRight: 30, marginTop: 15}}>
                                        <WAButton
                                            onPress={()=>{
                                                this.setState({
                                                    badge: undefined,
                                                    showBadgeSelector: false
                                                }, this._submit);
                                            }}
                                            style={{borderRadius: 5, height: 50}} text={'Không quan tâm'}/>
                                    </View>
                                </View>
                            </View>
                            :undefined
                    }
                    <PageContainer
                        navigationClose={true}
                        navigation={this.props.navigation} layoutPadding={20}
                        headerTitle={'Viết bài đánh giá'}
                        headerContainerStyle={Styles.headerContainerStyle}
                        contentWrapperStyle={Styles.contentWrapperStyle}
                    >
                    {
                        this.state.error?
                            <View style={Styles.error}>
                                <Icon name={'sentiment-very-dissatisfied'} style={Styles.errorIcon} />
                                <Text style={Styles.errorMessage}>{this.state.errorMessage}</Text>
                            </View>
                            :
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios'?'padding':undefined}
                                style={{flex: 1}}>
                                <ScrollView style={{flex: 1}}>
                                    {
                                        !this.state.editing?
                                            <View>
                                                <Text style={Styles.blockTitle}>Chạm vào để chọn sếp hạng:</Text>
                                                <View style={Styles.blockRatingStars}>
                                                    {
                                                        this.state.crits.map((item, index) => {
                                                            return <Rating
                                                                onChange={this._ratingChanged}
                                                                value={item.rating} id={item.id} name={item.name} key={index}/>
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            :undefined
                                    }
                                    <Text style={Styles.blockTitle}>Nội dung nhận xét:</Text>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            this.title.blur();
                                            this.content.blur();
                                        }}
                                        activeOpacity={1} style={Styles.blockContent}>
                                        <TextInput
                                            ref={ref=>this.title=ref}
                                            placeholder={'Nhập tiêu đề đánh giá'}
                                            underlineColorAndroid={Colors.TRANSPARENT}
                                            style={Styles.reviewTitleInput}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            spellCheck={false}
                                            selectionColor={Colors.PRIMARY}
                                            onChangeText={text=>this.setState({title: text})}
                                            onFocus={()=>this.setState({editing: false})}
                                            onBlur={()=>this.setState({editing: false})}
                                        />
                                        <TextInput
                                            ref={ref=>this.content=ref}
                                            multiline={true}
                                            placeholder={'Nhập tiêu đề đánh giá'}
                                            underlineColorAndroid={Colors.TRANSPARENT}
                                            style={[Styles.reviewContentnput, this.state.editing && {height: 150}]}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            spellCheck={false}
                                            selectionColor={Colors.PRIMARY}
                                            onChangeText={text=>this.setState({content: text})}
                                            onFocus={()=>this.setState({editing: false})}
                                            onBlur={()=>this.setState({editing: false})}
                                        >

                                        </TextInput>
                                        {
                                            !this.state.editing?
                                                <View style={Styles.images}>
                                                    {
                                                        this.state.images.length>0?
                                                            <View style={Styles.imageList}>
                                                                {this.state.images.map((item, index) => {
                                                                    return (
                                                                        <ImageBackground
                                                                            key={'image'+index}
                                                                            style={Styles.imageItem}
                                                                            source={{
                                                                                uri: item.path,
                                                                                width: item.width,
                                                                                height: item.height,
                                                                                mime: item.mime
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </View>
                                                            :
                                                            <TouchableOpacity
                                                                onPress={this._pickImages}
                                                                style={Styles.addImageButton}>
                                                                <Svg
                                                                    width={84}
                                                                    height={84}
                                                                >
                                                                    <G>
                                                                        <Rect width="83.68" height="83.68" rx="2" ry="2" fill="#f2f2f2"/>
                                                                        <G>
                                                                            <Path d="M57.48,29H26.2a.56.56,0,0,0-.56.56V54.13a.56.56,0,0,0,.56.56H57.48a.56.56,0,0,0,.56-.56V29.55a.56.56,0,0,0-.56-.56Zm-.56,24.57H26.76V30.11H56.92Zm0,0" fill="#b3b3b3"/>
                                                                            <Path d="M34.58,41.36a3.11,3.11,0,1,0-3.11-3.11,3.11,3.11,0,0,0,3.11,3.11Zm0-5.11a2,2,0,1,1-2,2,2,2,0,0,1,2-2Zm0,0" fill="#b3b3b3"/>
                                                                            <Path d="M29.56,51.33a.56.56,0,0,0,.37-.14l9.11-8,5.75,5.75a.56.56,0,1,0,.79-.79l-2.68-2.69L48,39.84l6.29,5.76a.56.56,0,1,0,.76-.82l-6.7-6.14a.58.58,0,0,0-.4-.14.55.55,0,0,0-.39.18l-5.47,6L39.45,42a.56.56,0,0,0-.76,0l-9.5,8.37a.56.56,0,0,0,0,.79.55.55,0,0,0,.42.19Zm0,0" fill="#b3b3b3"/>
                                                                        </G>
                                                                    </G>
                                                                </Svg>
                                                            </TouchableOpacity>
                                                    }
                                                </View>
                                                :undefined
                                        }
                                    </TouchableOpacity>
                                </ScrollView>
                                {
                                    !this.state.editing?
                                        <View style={Styles.footer}>
                                            <View style={Styles.footerButtons}>
                                                <TouchableOpacity
                                                    hitSlop={{
                                                        top: 30,
                                                        bottom: 30,
                                                        right: 30,
                                                        left: 30
                                                    }}
                                                    onPress={this._pickImages}
                                                >
                                                    <Icon style={Styles.iconButton} name={'photo-camera'}/>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                onPress={this._showBadgeSelector}
                                                activeOpacity={0.8}
                                                style={Styles.sendButton}>
                                                <Text style={Styles.sendButtonText}>Gửi đánh giá</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :undefined
                                }
                            </KeyboardAvoidingView>
                    }
                    </PageContainer>
                </View>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
)(HomeWriteReviewScreen);

class Rating extends PureComponent {

    constructor() {
        super();
        this.state = {
        }
    }

    _renderStars = () => {
        let items = [1, 2, 3, 4, 5];
        return (
            <View style={Styles.stars}>
                {
                    items.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={Styles.star}
                                onPress={() => {
                                    this.props.onChange(this.props.id, item);
                                }}
                            >
                                <Svg
                                    width={32}
                                    height={32}
                                >
                                    <Path
                                        d="M15.79,26.64,7.27,31.16a1,1,0,0,1-1.41-1l1.63-9.61a1,1,0,0,0-.28-.86L.29,12.86A1,1,0,0,1,.83,11.2l9.55-1.4a.94.94,0,0,0,.73-.53L15.38.55a1,1,0,0,1,1.75,0l4.26,8.72a.94.94,0,0,0,.73.53l9.55,1.4a1,1,0,0,1,.54,1.66l-6.92,6.81a1,1,0,0,0-.28.86l1.63,9.61a1,1,0,0,1-1.41,1l-8.52-4.52A1,1,0,0,0,15.79,26.64Z"
                                        fill={this.props.value>=index+1?'#FFB600':"#cbcbca"}/>
                                </Svg>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    };

    render() {
        return (
            <View style={Styles.rating}>
                {
                    this._renderStars()
                }
                <Text numberOfLines={1} style={Styles.ratingName}>{this.props.name}</Text>
            </View>

        )
    }
}

const Styles = StyleSheet.create({
    imageList: {
        marginTop: 15,
        flexDirection: 'row'
    },
    imageItem: {
        height: 84,
        width: 84,
        backgroundColor: Colors.SILVER_LIGHT,
        marginRight: 10
    },
    addImageButton: {
      marginTop: 15
    },
    iconButton: {
      fontSize: 30,
        color: Colors.LIGHT
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: 50,
    },
    coverWrapper: {
        width: 50,
        height: 50,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 25,
        marginBottom: 5,
        overflow: 'hidden'
    },
    itemTitle: {
        width: 80,
        textAlign: 'center',
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK
    },
    badgeSelector: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom:  0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    badgeSelectorInner: {
      backgroundColor: Colors.LIGHT,
      minHeight: 100,
        borderRadius: 5,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    badgeSelectorTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    badgeSelectorDesc: {
      fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        marginBottom: 15
    },
    error: {
        flex: 1,
        backgroundColor: Colors.LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50
    },
    errorIcon: {
      color: Colors.PRIMARY,
      fontSize: 50,
        marginBottom: 15
    },
    errorMessage: {
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 15,
    },
    headerContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT
    },
    contentWrapperStyle: {
        paddingLeft: 0,
        paddingRight: 0
    },
    blockTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    stars: {
        flexDirection: 'row'
    },
    star: {
        marginRight: 12
    },
    rating: {
        marginBottom: 5,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingName: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 15,
        flex: 1
    },
    blockRatingStars: {
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    blockContent: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        paddingBottom: 20
    },
    reviewTitleInput: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 13,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        height: 35,
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 15
    },
    reviewContentnput: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 13,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        //flex: 1
        height: 60
    },
    footer: {
        backgroundColor: Colors.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20
    },
    footerButtons: {
      flex: 1
    },
    sendButton: {
        backgroundColor: Colors.LIGHT,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 3
    },
    sendButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 13,
        lineHeight: 40
    }
});

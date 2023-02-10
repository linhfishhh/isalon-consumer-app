import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView, RefreshControl, Modal, KeyboardAvoidingView,
    Platform
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {getVersion} from 'react-native-device-info'
import ImagePicker from 'react-native-image-crop-picker';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import WASelect from "../components/WASelect";
import WAAvatar from "../components/WAAvatar";
import {DotIndicator} from 'react-native-indicators';
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import WALocation from "../components/WALocation";
import {loadLv1 as loadLocationLv1} from "../redux/location/actions";
import {updateInfo as updateAccountInfo} from "../redux/account/actions";

type Props = {};

class MemberProfileScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            saving: false,
            loading: false,

            originInfo: {
                avatar: undefined,
                name: 'Minh Trang',
                phone: '0999999999',
                email: 'tmtrangtv86@gmail.com',
                addresses: [
                    {
                        text: '48A Trần Hưng Đạo, Phường Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ',
                        address: '',
                        lv1: 1,
                        lv2: 1,
                        lv3: 3,
                    }
                ],
            },

            editedInfo: {
                avatar: undefined,
                name: 'Minh Trang',
                phone: '0999999999',
                email: 'tmtrangtv86@gmail.com',
                addresses: [
                    {
                        text: '48A Trần Hưng Đạo, Phường Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ',
                        address: '',
                        lv1: 1,
                        lv2: 1,
                        lv3: 3,
                    }
                ],
            },

            avatar: ImageSources.IMG_AVATAR_2,
            avatarData: undefined,
            editingAddress: false,
            formAddressLV1: 0,
            formAddressLV2: 0,
            formAddressLV3: 0,
            formAddressLV1Text: '',
            formAddressLV2Text: '',
            formAddressLV3Text: '',
            formAddressText: '',
            formAddressError: 'Vui lòng nhập đầy đủ thông tin bên trên',
            showConfirm: false,
            saveError: ''
        }
    }

    _loadInfo = () => {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    let rq = await Utils.getAxios(this.props.account.token).post(
                        'profile/get'
                    );
                    let data = rq.data;
                    this.setState({
                        loading: false,
                        originInfo: data,
                        editedInfo: data,
                        avatar: data.avatar
                    });
                }
                catch (e) {
                    this.setState({
                        loading: false,
                    });
                }
            }
        );
    };

    _removeAddress = (index) => {
        let addresses = this.state.editedInfo.addresses.filter((item, iIndex) => {
            return  index !== iIndex;
        });
        this.setState({
            editedInfo: {
                ...this.state.editedInfo,
                addresses: addresses
            }
        });
    };

    _showAddAddressForm = () => {
        this.setState({
                editingAddress: true,
                formAddressError: '',
                formAddressLV1: 0,
                formAddressLV2: 0,
                formAddressLV3: 0,
                formAddressText: '',
                formAddressLV1Text: '',
                formAddressLV2Text: '',
                formAddressLV3Text: '',
            }
        )
    };

    _addAddress = () => {
        if (
            this.state.formAddressText.trim().length === 0
            || !this.state.formAddressLV1
            || !this.state.formAddressLV2
            || !this.state.formAddressLV3
        ) {
            this.setState({
                formAddressError: 'Vui lòng nhập đầy đủ các thông tin bên trên'
            });
            return false;
        }

        let addresses = this.state.editedInfo.addresses;
        let address = {
            text: this.state.formAddressText+', '+this.state.formAddressLV3Text+', '+this.state.formAddressLV2Text+', '+this.state.formAddressLV3Text,
            address: this.state.formAddressText,
            lv1: this.state.formAddressLV1,
            lv2: this.state.formAddressLV2,
            lv3: this.state.formAddressLV3,
        };
        addresses.push(address);
        this.setState({
            editingAddress: false,
            editedInfo: {
                ...this.state.editedInfo,
                addresses: addresses
            }
        });

    };
    _save = () => {
        this.setState({
            showConfirm: false,
        }, () => {
            this.setState({
                saving: true,
            }, async () => {
                try {
                    let form = new FormData();
                    for(let name in this.state.editedInfo){
                        if(this.state.editedInfo[name] !== undefined){
                            if(name === 'addresses'){
                                let addresses = this.state.editedInfo[name];
                                addresses.every((item, index) => {
                                    form.append('addresses['+index+'][address]', item.address);
                                    form.append('addresses['+index+'][lv1]', item.lv1);
                                    form.append('addresses['+index+'][lv2]', item.lv2);
                                    form.append('addresses['+index+'][lv3]', item.lv3);
                                    return item;
                                });
                            }
                            else if(name === 'avatar'){
                                if(this.state.avatarData){
                                    form.append('avatar', this.state.avatarData);
                                }
                            }
                            else{
                                form.append(name, this.state.editedInfo[name]);
                            }
                        }
                    }
                    let rq = await Utils.getAxios(this.props.account.token, {
                        'Content-Type': 'multipart/form-data',
                    })
                        .post(
                            'profile/update',
                            form
                        );
                    let data = this.state.editedInfo;
                    this.setState({
                        saving: false,
                        originInfo: data,
                        editing: false,
                        avatarData: undefined
                    }, () => {
                        this.props.updateAccountInfo({
                            email: data.email,
                            name: data.name,
                            avatar: rq.data.avatar,
                        });
                    });
                }
                catch (e) {
                    this.setState({
                        saving: false,
                        saveError: e.response.status === 422 ? Utils.getValidationMessage(e.response): 'Cố lỗi xảy ra khi lưu thông tin'

                    });
                }
            });
        });
    };
    _verifyPhone = () => {
        this.setState(
            {
                saving: true
            },
            async() => {
                try {
                    let rq = await Utils.getAxios().post(
                        'verify-phone',
                        {
                            phone: this.state.editedInfo.phone,
                        }
                    );
                    this.setState({
                        saving: false
                    }, ()=>{
                        this.props.navigation.navigate('edit_profile_verify_phone', {
                            phone: this.state.editedInfo.phone,
                            onSuccess: ()=> {
                                this.setState({
                                    originInfo: {
                                        ...this.state.originInfo,
                                        phone: this.state.editedInfo.phone
                                    }
                                });
                            }
                        });
                    });
                }
                catch (e) {
                    this.setState({
                        saving: false,
                        saveError: e.response.status === 400 ? e.response.data.message: 'Cố lỗi xảy ra khi lưu thông tin'
                    });
                }
            }
        );
    };

    componentWillMount() {
        this.props.loadLocationLv1();
    }

    componentDidMount() {
        this._loadInfo();
    }

    render() {
        return (
            this.state.loading ?
                <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                    <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                </View>
                :
                <View style={{flex: 1}}>
                    <WAAlert
                        show={this.state.saveError.length > 0}
                        title={'Lỗi xảy ra'}
                        question={this.state.saveError}
                        yes={() => {
                            this.setState({
                                saveError: ''
                            });
                        }}
                        yesTitle={'Đã hiểu'}
                        no={false}
                        titleFirst={true}
                    />
                    <PageContainer
                        darkTheme={true}
                        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                        navigation={this.props.navigation}
                        backgroundColor={this.state.editing ? '#F1F2F2' : Colors.LIGHT}
                        navigationClose={true}
                        navigationButtonStyle={Styles.closeButton}
                        layoutPadding={30}
                        headerTitle={'Chỉnh sửa hồ sơ'}
                        keyboardAvoid={false}
                        rightComponent={(
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.editing) {
                                        this.setState({
                                            showConfirm: true
                                        });
                                    }
                                    else {
                                        this.setState({
                                            editing: true
                                        })
                                    }
                                }}
                            >
                                <Text style={Styles.saveButton}>{this.state.editing ? 'Lưu' : 'Sửa'}</Text>
                            </TouchableOpacity>
                        )}
                    >
                        <WAAlert
                            show={this.state.showConfirm}
                            title={'Lưu thông tin'}
                            question={'Bạn có muốn chắc muốn cập nhật thông tin không? \n (Số điện thoại thay đổi nếu chưa xác minh sẽ không được lưu)'}
                            yes={() => {
                                this._save();
                            }}
                            no={() => {
                                this.setState({
                                    showConfirm: false,
                                    editing: false,
                                    editedInfo: this.state.originInfo
                                });
                            }}
                            titleFirst={true}
                        />
                        <ScrollView ref={'scroll'} style={{flex: 1, backgroundColor: Colors.LIGHT}}
                                    bounces={false}
                        >
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'position' : undefined}
                                keyboardVerticalOffset={0}
                            >
                                <View style={[Styles.avatarBlock, this.state.editing && {backgroundColor: '#F1F2F2'}]}>
                                    <View style={Styles.avatar}>
                                        <Image
                                            source={this.state.avatar?this.state.avatar:ImageSources.IMG_AVATAR}
                                            style={[Styles.avatarImage, this.state.editing && Styles.avatarImageEditing]}
                                        />
                                        {
                                            this.state.editing ?
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        ImagePicker.openPicker({
                                                            width: 400,
                                                            height: 400,
                                                            cropping: true,
                                                            mediaType: 'photo'
                                                        }).then(image => {
                                                            this.setState({
                                                                avatar: {
                                                                    uri: image.path,
                                                                    width: image.width,
                                                                    height: image.height,
                                                                    mime: image.mime
                                                                },
                                                                avatarData: {
                                                                    uri: image.path,
                                                                    type: image.mime,
                                                                    name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                                }
                                                            });
                                                        });
                                                    }}
                                                    style={Styles.avatarOverlay}>
                                                    <Image style={Styles.avatarOverlayImage}
                                                           source={ImageSources.IMG_AVATAR_OVERLAY}/>
                                                </TouchableOpacity>
                                                : undefined
                                        }
                                    </View>
                                </View>
                                <View style={Styles.formBlock}>
                                    <View style={Styles.field}>
                                        <Text style={Styles.fieldLabel}>Họ & tên</Text>
                                        <View style={Styles.fieldInputWrapper}>
                                            <TextInput style={Styles.fieldInput}
                                                       placeholder={'Nhập họ tên ban'}
                                                       placeholderColor={Colors.SILVER_LIGHT}
                                                       underlineColorAndroid={Colors.TRANSPARENT}
                                                       selectionColor={Colors.PRIMARY}
                                                       autoCapitalize={'none'}
                                                       autoCorrect={false}
                                                       spellCheck={false}
                                                       editable={this.state.editing}
                                                       value={this.state.editedInfo.name}
                                                       onChangeText={(text) => {
                                                           this.setState({
                                                               editedInfo: {
                                                                   ...this.state.editedInfo,
                                                                   name: text
                                                               }
                                                           })
                                                       }}
                                            />
                                            <Icon style={Styles.fieldStatusIcon} name={'circle'}/>
                                        </View>
                                    </View>
                                    <View style={Styles.field}>
                                        <Text style={Styles.fieldLabel}>Số điện thoại</Text>
                                        <View style={Styles.fieldInputWrapper}>
                                            <TextInput style={Styles.fieldInput}
                                                       placeholder={'Số điện thoại'}
                                                       placeholderColor={Colors.SILVER_LIGHT}
                                                       underlineColorAndroid={Colors.TRANSPARENT}
                                                       selectionColor={Colors.PRIMARY}
                                                       autoCapitalize={'none'}
                                                       autoCorrect={false}
                                                       spellCheck={false}
                                                       editable={this.state.editing}
                                                       value={this.state.editedInfo.phone}
                                                       onChangeText={(text) => {
                                                           this.setState({
                                                               editedInfo: {
                                                                   ...this.state.editedInfo,
                                                                   phone: text
                                                               }
                                                           })
                                                       }}
                                            />
                                            {this.state.editing && this.state.editedInfo.phone !== this.state.originInfo.phone ?
                                                <TouchableOpacity
                                                    onPress={this._verifyPhone}
                                                    style={Styles.fieldVerify}>
                                                    <Text style={Styles.fieldVerifyText}>Xác minh</Text>
                                                </TouchableOpacity>
                                                :
                                                <Icon style={Styles.fieldStatusIconPhone} name={'check-circle'}/>
                                            }

                                        </View>
                                    </View>
                                    <View style={Styles.field}>
                                        <Text style={Styles.fieldLabel}>Email</Text>
                                        <View style={Styles.fieldInputWrapper}>
                                            <TextInput style={Styles.fieldInput}
                                                       placeholder={'Email liên hệ'}
                                                       placeholderColor={Colors.SILVER_LIGHT}
                                                       underlineColorAndroid={Colors.TRANSPARENT}
                                                       selectionColor={Colors.PRIMARY}
                                                       autoCapitalize={'none'}
                                                       autoCorrect={false}
                                                       spellCheck={false}
                                                       editable={this.state.editing}
                                                       value={this.state.editedInfo.email}
                                                       onChangeText={(text) => {
                                                           this.setState({
                                                               editedInfo: {
                                                                   ...this.state.editedInfo,
                                                                   email: text
                                                               }
                                                           })
                                                       }}
                                            />
                                            <Icon style={Styles.fieldStatusIcon} name={'circle'}/>
                                        </View>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </ScrollView>
                        <Modal
                            style={Styles.addAddressForm}
                            transparent={true}
                            onRequestClose={() => {
                            }}
                            visible={this.state.editingAddress && this.state.editing}
                        >
                            <StatusBar
                                backgroundColor='rgba(0,0,0, 0.85)'
                                barStyle={'light-content'}
                            />
                            <View style={Styles.addAddressFormWrapper}>
                                <View style={Styles.addAddressFormInner}>
                                    <View style={Styles.addAddressFormHeader}>
                                        <Text style={Styles.addAddressFormHeaderText}>Thêm địa chỉ</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({editingAddress: false})
                                            }}
                                        >
                                            <Icon style={Styles.addAddressFormCloseText} name={'times'}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.field}>
                                        <View style={Styles.fieldInputWrapper}>
                                            <TextInput style={Styles.fieldInput}
                                                       placeholder={'Số nhà, đường...'}
                                                       placeholderColor={Colors.SILVER_LIGHT}
                                                       underlineColorAndroid={Colors.TRANSPARENT}
                                                       selectionColor={Colors.PRIMARY}
                                                       autoCapitalize={'none'}
                                                       autoCorrect={false}
                                                       spellCheck={false}
                                                       value={this.state.formAddressText}
                                                       onChangeText={(text) => {
                                                           this.setState({formAddressText: text})
                                                       }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                        <View style={NewUserFormStyles.selectPickerLabel}>
                                            <Text style={NewUserFormStyles.selectPickerLabelText}>Tỉnh/Thành phố</Text>
                                        </View>
                                        <View style={NewUserFormStyles.selectPickerField}>
                                            <WALocation
                                                onChanged={(value, lbl) => {
                                                    this.setState({
                                                        formAddressLV1: value,
                                                        formAddressLV1Text: lbl,
                                                    });
                                                }}
                                                level={1} placeholder={'Chọn tỉnh/thành phố'}/>
                                        </View>
                                    </View>
                                    <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                        <View style={NewUserFormStyles.selectPickerLabel}>
                                            <Text style={NewUserFormStyles.selectPickerLabelText}>Quận/huyện</Text>
                                        </View>
                                        <View style={NewUserFormStyles.selectPickerField}>
                                            <WALocation
                                                onChanged={(value, lbl) => {
                                                    this.setState({
                                                        formAddressLV2: value,
                                                        formAddressLV2Text: lbl,
                                                    });
                                                }}
                                                placeholder={'Chọn quận/huyện'} level={2}/>
                                        </View>
                                    </View>
                                    <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                        <View style={NewUserFormStyles.selectPickerLabel}>
                                            <Text style={NewUserFormStyles.selectPickerLabelText}>Phường/xã</Text>
                                        </View>
                                        <View style={NewUserFormStyles.selectPickerField}>
                                            <WALocation
                                                onChanged={(value, lbl) => {
                                                    this.setState({
                                                        formAddressLV3: value,
                                                        formAddressLV3Text: lbl,
                                                    });
                                                }}
                                                placeholder={'Chọn phường/xã'} level={3}/>
                                        </View>
                                    </View>
                                    {
                                        this.state.formAddressError ?
                                            <Text style={Styles.locationErrorMessage}>
                                                {this.state.formAddressError}
                                            </Text>
                                            : undefined
                                    }

                                    <WAButton
                                        onPress={this._addAddress}
                                        style={Styles.addAddressSaveButton} text={'Thêm địa chỉ'}/>
                                </View>
                            </View>
                        </Modal>
                    </PageContainer>
                    {
                        this.state.saving ?
                            <View style={Styles.saving}>
                                <DotIndicator size={10} color={Colors.PRIMARY} count={3}/>
                            </View>
                            : undefined
                    }
                </View>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account,
        }
    }, {
        loadLocationLv1,
        updateAccountInfo
    }
)(MemberProfileScreen);

const Styles = StyleSheet.create({
    locationErrorMessage: {
        marginTop: 10,
        width: '100%',
        textAlign: 'center',
        color: Colors.PRIMARY,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    saving: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1
    },
    pageWrapper: {
        justifyContent: 'flex-start',
        //backgroundColor: Colors.LIGHT,
        paddingLeft: 0,
        paddingRight: 0
    },
    closeButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    saveButton: {
        color: Colors.PRIMARY,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    avatarBlock: {
        alignItems: 'center',
        paddingBottom: 30,
        paddingTop: 30
    },
    avatar: {
        position: 'relative'
    },
    avatarImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 75
    },
    avatarImageEditing: {
        borderRadius: 0
    },
    avatarOverlay: {
        position: 'absolute',
    },
    avatarOverlayImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
    },
    formBlock: {
        flex: 1,
        backgroundColor: Colors.LIGHT,
        paddingLeft: 30,
        paddingTop: 30
    },
    field: {
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        marginBottom: 15,
    },
    fieldLabel: {
        fontSize: 18,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    fieldInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    fieldStatusIcon: {
        color: '#5DC4BD',
        fontSize: 8,
        lineHeight: 40,
        paddingLeft: 15,
        paddingRight: 15
    },
    fieldStatusIconEditing: {
        color: '#5DC4BD',
        fontSize: 20,
        lineHeight: 40,
        paddingLeft: 15,
        paddingRight: 15
    },
    fieldStatusIconPhone: {
        color: '#2BB673',
        lineHeight: 40,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 30
    },
    fieldInput: {
        height: 40,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        flex: 1
    },
    fieldVerify: {
        backgroundColor: Colors.PRIMARY,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    fieldVerifyText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        lineHeight: 30,
        fontSize: 14
    },
    address: {
        flex: 1,
        marginTop: 15,
        marginBottom: 15
    },
    addressText: {
        color: Colors.SILVER,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    fieldLabelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    addressRemove: {
        paddingLeft: 0,
        paddingRight: 0
    },
    addressRemoveEditing: {
        paddingLeft: 15,
        paddingRight: 15
    },
    addressRemoveIcon: {
        color: Colors.PRIMARY,
        fontSize: 20,
        lineHeight: 40,

    },
    addAddress: {
        paddingTop: 15,
        paddingBottom: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        marginBottom: 50
    },
    addAddressButtonIcon: {
        color: Colors.PRIMARY,
        marginRight: 10
    },
    addAddressButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 13,
    },
    addAddressForm: {
        flex: 1,
    },
    addAddressFormWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingRight: 15,
        paddingLeft: 15
    },
    addAddressFormInner: {
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30
    },
    addAddressFormHeader: {
        alignItems: 'flex-end',
        marginBottom: 20,
        flexDirection: 'row',

    },
    addAddressFormCloseText: {
        color: Colors.PRIMARY,
        fontSize: 20
    },
    addAddressFormHeaderText: {
        flex: 1,
        fontSize: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    selectWrapperStyle: {
        borderColor: Colors.TEXT_DARK
    },
    selectPickerWrapper: {
        marginTop: 10,
        marginBottom: 10
    },
    addAddressSaveButton: {
        marginTop: 15,
        height: 50
    }
});
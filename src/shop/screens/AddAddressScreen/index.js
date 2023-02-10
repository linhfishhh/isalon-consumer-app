import React from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import { FixedSpace } from '../../components/Space';
import Separator from '../../components/Separator';
import ComboBox from '../../components/ComboBox';
import CheckBox from '../../components/CheckBox';
import TextButton from '../../components/TextButton';
import GradientButton from '../../components/Button/GradientButton';
import WAAlert from '../../../components/WAAlert';
import {
  addMyAddress as addMyAddressAction,
  updateMyAddress as updateMyAddressAction,
  updateErrors as updateErrorsAction,
} from '../../redux/address/actions';
import { CommonStyles, ErrorTypes } from '../../constants';

type Props = {};

function AddAddressScreen(props: Props) {
  const {
    navigation,
    addMyAddress,
    updateMyAddress,
    updateErrors,
    errors,
  } = props;

  const isAddDefault = navigation.getParam('isAddDefault') || false;
  const editingAddress = navigation.getParam('editingAddress');

  const [address, setAddress] = React.useState([
    {
      key: 'province',
      value: {
        provinceId: _.get(editingAddress, 'provinceId') || -1,
        name: _.get(editingAddress, 'provinceName') || 'Tỉnh/Thành phố',
      },
    },
    {
      key: 'district',
      value: {
        districtId: _.get(editingAddress, 'districtId') || -1,
        name: _.get(editingAddress, 'districtName') || 'Quận/Huyện',
      },
    },
    {
      key: 'commune',
      value: {
        communeId: _.get(editingAddress, 'communeId') || -1,
        name: _.get(editingAddress, 'communeName') || 'Phường/Xã',
      },
    },
  ]);

  // private String description;
  // private Long communeId;
  // private String name;
  // private String phone;
  // private Boolean isDefault;
  const [description, setDescription] = React.useState(_.get(editingAddress, 'description') || '');
  const [name, setName] = React.useState(_.get(editingAddress, 'name') || '');
  const [phone, setPhone] = React.useState(_.get(editingAddress, 'phone') || '');
  const [isDefault, setIsDefault] = React.useState(isAddDefault || (_.get(editingAddress, 'isDefault') || false));

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const onPickAddressCallback = (add) => {
    setAddress(add);
  };

  const onSelectProvince = () => {
    navigation.navigate('PickAddressScreen',
      {
        initialAddress: address,
        step: 1,
        callback: onPickAddressCallback
      });
  };

  const onSelectDistrict = () => {
    navigation.navigate('PickAddressScreen',
      {
        initialAddress: address,
        step: 2,
        callback: onPickAddressCallback
      });
  };

  const onSelectCommune = () => {
    navigation.navigate('PickAddressScreen',
      {
        initialAddress: address,
        step: 3,
        callback: onPickAddressCallback
      });
  };

  const validateAddress = (payload) => {
    if (_.isEmpty(payload, 'name') || payload.name.length < 1) {
      updateErrors([{
        type: ErrorTypes.internal,
        message: 'Vui lòng nhập tên của bạn'
      }]);
      return false;
    } if (_.isEmpty(payload, 'phone') || payload.phone.length < 10) {
      updateErrors([{
        type: ErrorTypes.internal,
        message: 'Vui lòng nhập số điện thoại của bạn'
      }]);
      return false;
    } if (_.isEmpty(payload, 'description') || payload.description.length < 1) {
      updateErrors([{
        type: ErrorTypes.internal,
        message: 'Vui lòng nhập địa chỉ của bạn'
      }]);
      return false;
    } if (_.isEmpty(payload, 'communeId') || payload.communeId === -1) {
      const provinceId = _.get(address[0], 'value.provinceId') || -1;
      const districtId = _.get(address[1], 'value.districtId') || -1;
      if (provinceId === -1) {
        updateErrors([{
          type: ErrorTypes.internal,
          message: 'Vui lòng nhập Tỉnh/Thành phố'
        }]);
      } else if (districtId === -1) {
        updateErrors([{
          type: ErrorTypes.internal,
          message: 'Vui lòng nhập Quận/Huyện'
        }]);
      } else {
        updateErrors([{
          type: ErrorTypes.internal,
          message: 'Vui lòng nhập Phường/Xã'
        }]);
      }
      return false;
    }
    return true;
  };

  const onAddAddress = () => {
    let payload = {
      description,
      communeId: _.find(address, (obj) => obj.key === 'commune').value.communeId,
      name,
      phone,
      isDefault,
    };
    if (validateAddress(payload) === true) {
      if (editingAddress) {
        payload = {
          ...payload,
          addressId: editingAddress.addressId,
        };
        updateMyAddress(payload, () => {
          navigation.goBack();
        });
      } else {
        addMyAddress(payload, () => {
          navigation.goBack();
        });
      }
    }
  };

  const onChangeDefault = () => {
    setIsDefault(!isDefault);
  };

  const clearErrors = () => {
    updateErrors(undefined);
  };

  return (
    <MainContainer hasNavigationBackground={false} style={CommonStyles.main_container_white}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title={editingAddress ? 'Chỉnh sửa' : 'Thêm địa chỉ mới'}
        onClose={onBack}
      />
      <View style={styles.list_container}>
        <ScrollView style={styles.list}>
          <TextInput
            autoCapitalize="words"
            style={styles.text_input}
            placeholder="Họ và tên"
            multiline={false}
            onChangeText={setName}
            value={name}
          />
          <Separator height={1} />
          <TextInput
            style={styles.text_input}
            placeholder="Số điện thoại"
            multiline={false}
            keyboardType="phone-pad"
            onChangeText={setPhone}
            value={phone}
          />
          <Separator height={1} />
          <ComboBox title={_.get(address[0], 'value.name')} onPress={onSelectProvince} />
          <ComboBox title={_.get(address[1], 'value.name')} onPress={onSelectDistrict} />
          <ComboBox title={_.get(address[2], 'value.name')} onPress={onSelectCommune} />
          <FixedSpace size={10} />
          <TextInput
            style={styles.text_input}
            placeholder="Địa chỉ"
            multiline
            onChangeText={setDescription}
            value={description}
          />
          <Separator height={1} />
          <CheckBox title="Đặt làm mặc định" selected={isDefault} onChange={onChangeDefault} enabled={!isAddDefault} />
        </ScrollView>
      </View>
      <View style={styles.add_group}>
        <TextButton
          style={styles.cancel_button}
          title="HỦY"
          titleStyle={styles.button_title}
          onPress={onBack}
        />
        <FixedSpace size={10} />
        <GradientButton
          style={styles.ok_button}
          title={editingAddress ? 'ĐỒNG Ý' : 'THÊM'}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#f05a28', '#d91c5c']}
          titleStyle={styles.button_title}
          onPress={onAddAddress}
        />
      </View>
      <WAAlert
        show={!_.isEmpty(errors)}
        title="iSalon"
        question={_.get(_.head(errors), 'message')}
        titleFirst
        yes={clearErrors}
        no={false}
        yesTitle="Đóng"
      />
    </MainContainer>
  );
}

export default connect(
  (state) => ({
    errors: state.shopAddress.errors,
  }),
  {
    addMyAddress: addMyAddressAction,
    updateMyAddress: updateMyAddressAction,
    updateErrors: updateErrorsAction,
  }
)(AddAddressScreen);

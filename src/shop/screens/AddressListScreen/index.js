import React from 'react';
import {
  StatusBar,
  View,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { SwipeListView } from 'react-native-swipe-list-view';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import Separator from '../../components/Separator';
import GradientButton from '../../components/Button/GradientButton';
import WAAlert from '../../../components/WAAlert';
import AddressItem from './AddressItem';
import RowMenu from './RowMenu';
import {
  getMyAddresses as getMyAddressesAction,
  deleteMyAddress as deleteMyAddressAction,
  updateSelectedShippingAddress as updateSelectedShippingAddressAction,
  updateErrors as updateErrorsAction,
} from '../../redux/address/actions';
import { CommonStyles } from '../../constants';

type Props = {};

function AddressListScreen(props: Props) {
  const {
    navigation,
    addresses,
    errors,
    getMyAddresses,
    deleteMyAddress,
    updateSelectedShippingAddress,
    updateErrors,
  } = props;

  React.useEffect(() => {
    getMyAddresses();
  }, []);

  const onBack = () => {
    navigation.goBack();
  };

  const keyExtractor = (item, index) => item + index;

  const onDeleteAddress = React.useCallback((addr) => {
    Alert.alert(
      'iSalon',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            deleteMyAddress(addr.addressId, () => {

            });
          }
        },
      ],
      { cancelable: false },
    );
  }, []);

  const onEditAddress = React.useCallback((addr) => {
    navigation.push('AddAddressScreen', { editingAddress: addr });
  }, []);

  const onSelectAddress = React.useCallback((addr) => {
    updateSelectedShippingAddress(addr);
    navigation.goBack();
  }, []);

  const renderItem = (rowData) => (
    <AddressItem
      address={rowData.item}
      onSelect={onSelectAddress}
    />
  );

  const separator = () => (
    <Separator height={1} />
  );

  const onAddNewAdd = () => {
    navigation.push('AddAddressScreen');
  };

  const footer = (
    <GradientButton
      style={styles.add_new_button}
      title="THÊM ĐỊA CHỈ MỚI"
      titleStyle={styles.button_title}
      onPress={onAddNewAdd}
    />
  );

  const renderHiddenItem = (rowData, rowMap) => (
    <RowMenu
      rowData={rowData}
      rowMap={rowMap}
      onEdit={onEditAddress}
      onDelete={onDeleteAddress}
    />
  );

  const clearErrors = () => {
    updateErrors(undefined);
  };

  return (
    <MainContainer
      hasNavigationBackground={false}
      style={CommonStyles.main_container_white}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title="Sổ địa chỉ"
        onClose={onBack}
      />
      <View style={styles.list_container}>
        <SwipeListView
          style={styles.list}
          data={addresses}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={keyExtractor}
          disableRightSwipe
          leftOpenValue={75}
          rightOpenValue={-110}
          ListFooterComponent={footer}
          ItemSeparatorComponent={separator}
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
    addresses: state.shopAddress.myShippingAddresses,
    errors: state.shopAddress.errors,
  }),
  {
    getMyAddresses: getMyAddressesAction,
    deleteMyAddress: deleteMyAddressAction,
    updateSelectedShippingAddress: updateSelectedShippingAddressAction,
    updateErrors: updateErrorsAction,
  }
)(AddressListScreen);

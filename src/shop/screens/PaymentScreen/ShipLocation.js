import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Layout, Colors } from '../../constants';
import SectionTitle from '../../components/SectionTitle';
import AddressGroup from './AddressGroup';
import {
  getMyAddresses as getMyAddressesAction,
} from '../../redux/address/actions';

type Props = {};

function ShipLocation({
  navigation,
  addresses,
  selectedAddress,
  getMyAddresses,
}: Props) {
  React.useEffect(() => {
    getMyAddresses();
  }, []);

  const onSelectOtherAddress = () => {
    navigation.navigate('AddressListScreen');
  };

  const onAddNewAddress = () => {
    navigation.navigate('AddAddressScreen', { isAddDefault: true });
  };

  const address = selectedAddress || _.find(addresses, (addr) => addr.isDefault === true);

  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Thông tin giao hàng" style={internalStyles.title} />
      {
        address
          ? (
            <View style={internalStyles.selected_addr_container}>
              <AddressGroup address={address} />
              <TouchableOpacity style={internalStyles.add_address} onPress={onSelectOtherAddress}>
                <Icon
                  name="plus-circle-outline"
                  style={internalStyles.plus_icon}
                  color={Colors.tintColor}
                  size={20}
                />
                <Text style={internalStyles.add_address_text}>Giao tới địa chỉ khác</Text>
              </TouchableOpacity>
            </View>
          )
          : (
            <TouchableOpacity
              style={internalStyles.add_new_address_container}
              onPress={onAddNewAddress}
            >
              <Text style={internalStyles.add_new_address_text}>Thêm địa chỉ</Text>
            </TouchableOpacity>
          )
      }
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  title: {
    backgroundColor: 'white',
  },
  add_address: {
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  plus_icon: {
    width: 20, height: 20,
  },
  add_address_text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    marginLeft: 10,
  },
  selected_addr_container: {
    flexDirection: 'column',
  },
  add_new_address_container: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
    height: 80,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.cyanColor,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  add_new_address_text: {
    ...Layout.font.normal,
    color: Colors.cyanColor,
    textAlign: 'center',
  }
});

export default connect(
  (state) => ({
    addresses: state.shopAddress.myShippingAddresses,
    selectedAddress: state.shopAddress.selectedShippingAddress,
  }),
  {
    getMyAddresses: getMyAddressesAction,
  }
)(ShipLocation);

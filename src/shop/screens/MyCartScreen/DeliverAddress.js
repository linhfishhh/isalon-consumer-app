import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TextButton from '../../components/TextButton';
import { FixedSpace } from '../../components/Space';
import {
  getMyAddresses as getMyAddressesAction,
} from '../../redux/address/actions';

type Props = {};

function DeliverAddress({ shippingAddress, navigation, getMyAddresses }: Props) {
  React.useEffect(() => {
    getMyAddresses();
  }, []);

  const onEditPress = () => {
    navigation.navigate('AddressListScreen');
  };

  const province = _.get(shippingAddress, 'provinceName') || '';
  const district = _.get(shippingAddress, 'districtName') || '';
  const commune = _.get(shippingAddress, 'communeName') || '';
  const shipLocation = province.length > 0 ? `${province}, ${district}, ${commune}` : 'Hà nội';
  return (
    <View style={internalStyles.container}>
      <Icon name="location-on" size={20} color={Colors.tintColor} />
      <View style={internalStyles.address_container}>
        <Text style={internalStyles.address_text} numberOfLines={2} ellipsizeMode="tail">{shipLocation}</Text>
      </View>
      <FixedSpace size={4} />
      <TextButton
        style={internalStyles.edit_button}
        titleStyle={internalStyles.edit_button_title}
        title="Thay đổi"
        onPress={onEditPress}
      />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  edit_button: {

  },
  edit_button_title: {
    ...Layout.font.normal,
    color: Colors.tintColor,
  },
  address_text: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor,
    marginLeft: 8,
  },
  address_container: {
    flex: 1,
  }
});

export default connect(
  (state) => ({
    shippingAddress: state.shopAddress.selectedShippingAddress,
  }),
  { getMyAddresses: getMyAddressesAction }
)(DeliverAddress);

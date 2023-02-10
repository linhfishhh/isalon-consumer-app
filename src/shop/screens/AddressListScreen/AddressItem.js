import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

type Props = {};

export default function AddressItem({ address, onSelect }: Props) {
  const onPress = () => {
    if (onSelect) {
      onSelect(address);
    }
  };

  return (
    <View style={internalStyles.container}>
      <TouchableOpacity style={internalStyles.content} onPress={onPress}>
        <Text style={internalStyles.name}>{address.name}</Text>
        <Text style={internalStyles.phone}>{address.phone}</Text>
        <Text style={internalStyles.address}>{address.addressDetail}</Text>
        {
          address.isDefault
            ? (
              <Text style={internalStyles.default_addr}>
                Địa chỉ mặc định
              </Text>
            ) : null
        }
      </TouchableOpacity>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  name: {
    ...Layout.font.bold,
    fontSize: 17,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
  },
  phone: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
  },
  address: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
  },
  default_addr: {
    ...Layout.font.normal,
    color: Colors.tintColor,
    width: Layout.window.width - 50,
  },
  checkbox: {
    width: 20, height: 20,
  },
});

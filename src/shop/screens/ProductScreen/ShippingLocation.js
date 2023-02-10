import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import styles from './styles';
import Img from '../../components/Img';
import SectionTitle from '../../components/SectionTitle';
import ShippingOptionScreen from '../ShippingOptionScreen';
import Separator from '../../components/Separator';
import {
  getMyAddresses as getMyAddressesAction,
} from '../../redux/address/actions';
import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';

import icLocationmark from '../../../assets/images/shop/ic_location_mark.png';
import icRight from '../../../assets/images/shop/ic_right_arrow_accessory.png';

moment.locale('vi');

type Props = {
  style: Object,
  navigation: Object,
  getMyAddresses: Function,
  shippingAddress: Object,
};

function ShippingLocation({
  style,
  navigation,
  getMyAddresses,
  shippingAddress
}: Props) {
  React.useEffect(() => {
    getMyAddresses();
  }, []);

  const shipDate = moment().add(1, 'days').format('dddd, DD MMMM - YYYY');

  const province = _.get(shippingAddress, 'provinceName') || '';
  const district = _.get(shippingAddress, 'districtName') || '';
  const commune = _.get(shippingAddress, 'communeName') || '';
  const shipLocation = province.length > 0 ? `${province}, ${district}, ${commune}` : 'Hà nội';

  const shippingOptionRef = React.useRef(null);

  const [containerStyle] = React.useState({
    ...styles.shipping_location,
    ...style
  });

  const onEditPress = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      navigation.navigate('AddressListScreen');
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const openShippingOption = () => {
    shippingOptionRef.current.show();
  };

  return (
    <View style={containerStyle}>
      <SectionTitle title="Giao hàng" style={internalStyles.title} />
      <TouchableOpacity style={internalStyles.location_container} onPress={onEditPress}>
        <View style={internalStyles.location_mark_container}>
          <Img style={internalStyles.location_mark} source={icLocationmark} />
        </View>
        <View style={internalStyles.location_text_container}>
          <Text style={internalStyles.location_text}>{shipLocation}</Text>
          <Text style={internalStyles.location_subtitle}>Chạm để thay đổi địa chỉ nhận hàng</Text>
        </View>
        <Img style={internalStyles.right_arrow} source={icRight} />
      </TouchableOpacity>
      <TouchableOpacity style={internalStyles.shipping_time_container} onPress={openShippingOption}>
        <View style={internalStyles.shipping_text_container}>
          <Text style={internalStyles.shipping_type}>Giao hàng tiêu chuẩn, 1-3 ngày</Text>
          <Text style={internalStyles.shipping_time}>
            {`Dự kiến giao hàng ${shipDate}`}
          </Text>
        </View>
        <Img style={internalStyles.right_arrow} source={icRight} />
      </TouchableOpacity>
      <ShippingOptionScreen ref={shippingOptionRef} title="Tùy chọn giao hàng" shipDate={shipDate} />
      <Separator />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  title: {
    backgroundColor: 'white'
  },
  location_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
  },
  location_mark_container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 8,
    paddingTop: 4,
    height: '100%'
  },
  location_mark: {
    width: 10, height: 14,
  },
  location_text_container: {
    flexDirection: 'column',
    width: Layout.window.width - 76
  },
  location_text: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.newPriceTextColor,
  },
  location_subtitle: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor
  },
  shipping_time_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 12,
    marginBottom: 15
  },
  shipping_text_container: {
    flexDirection: 'column',
    width: Layout.window.width - 58
  },
  shipping_type: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.itemTextColor,
  },
  shipping_time: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.subSectionTextColor
  },
  right_arrow: {
    width: 8,
    height: 14,
    marginLeft: 8
  }
});

export default connect(
  (state) => ({
    shippingAddress: state.shopAddress.selectedShippingAddress,
  }),
  { getMyAddresses: getMyAddressesAction }
)(ShippingLocation);

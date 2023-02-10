import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/vi';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';
import TagName from '../../components/TagName';

// import checkboxNormal from '../../../assets/images/shop/ic_radio_off.png';
import checkboxSelected from '../../../assets/images/shop/ic_radio_on.png';

moment.locale('vi');

export default function ShipMethodGroup() {
  const shipDate = moment().add(1, 'days').format('dddd, DD MMMM - YYYY');
  return (
    <View style={internalStyles.container}>
      <ImageButton
        style={internalStyles.checkbox}
        source={checkboxSelected}
      />
      <View style={internalStyles.content}>
        <Text style={internalStyles.name}>{`Dự kiến ${shipDate}`}</Text>
        <View style={internalStyles.ship_method}>
          <TagName
            title="Miễn phí"
          />
          <Text style={internalStyles.method_text}>Giao hàng tiêu chuẩn</Text>
        </View>
      </View>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  name: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
  },
  method_text: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    width: Layout.window.width - 50,
    marginLeft: 10,
  },
  ship_method: {
    flexDirection: 'row',
    marginTop: 3,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    width: 20, height: 20,
  },
});

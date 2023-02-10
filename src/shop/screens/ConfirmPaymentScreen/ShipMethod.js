import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import { Layout, Colors } from '../../constants';
import SectionTitle from '../../components/SectionTitle';
import TagName from '../../components/TagName';

export default function ShipMethod() {
  const shipDate = moment().add(1, 'days').format('dddd, DD MMMM - YYYY');
  return (
    <View style={internalStyles.container}>
      <SectionTitle title="Hình thức giao hàng" style={internalStyles.title} />
      <View style={internalStyles.method_container}>
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
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    backgroundColor: 'white'
  },
  method_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
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
});

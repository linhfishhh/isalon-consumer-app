import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import HTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import Img from '../../components/Img';
import SectionTitle from '../../components/SectionTitle';
import { Layout } from '../../constants';
import Separator from '../../components/Separator';
import icRight from '../../../assets/images/shop/ic_right_arrow_accessory.png';

type Props = {
  style: Object,
  onPress: Function
};

export default function ProductDetail({
  style, onPress, desc
}: Props) {
  return (
    <TouchableOpacity
      style={{
        ...styles.product_detail,
        ...style
      }}
      onPress={onPress}
    >
      <SectionTitle
        title="Chi tiết sản phẩm"
        subTitle="Thương hiệu, mẫu mã, công dụng"
        style={internalStyles.title}
      >
        <Img style={styles.right_arrow} source={icRight} />
      </SectionTitle>
      <View style={styles.product_detail_summary}>
        <HTML html={desc || '<p></p>'} imagesMaxWidth={Layout.window.width} />
        <LinearGradient
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 0.0, y: 0.5 }}
          locations={[0, 1]}
          colors={['#ffffff', '#f1f5f800']}
          style={internalStyles.linear_gradient}
        />
      </View>
      <Separator />
    </TouchableOpacity>
  );
}

const internalStyles = StyleSheet.create({
  linear_gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  title: {
    backgroundColor: 'white'
  }
});

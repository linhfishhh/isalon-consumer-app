import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { times } from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import styles from './styles';
import Img from '../../components/Img';
import SectionTitle from '../../components/SectionTitle';
import Separator from '../../components/Separator';
import icRight from '../../../assets/images/shop/ic_right_arrow_accessory.png';
import sampleProduct from '../../../assets/images/shop/sample_product.png';

type Props = {
  style: Object,
  onPress: Function,
  products: Array,
};

export default function ProductCombo(props: Props) {
  const { style, onPress, products } = props;

  // useWhyDidYouUpdate('ProductCombo', props);

  return (
    <TouchableOpacity
      style={{
        ...styles.product_combo,
        ...style
      }}
      onPress={onPress}
    >
      <SectionTitle title="Mua 5 sản phẩm được giảm giá 15% cho toàn bộ nhãn hàng Lakme" style={internalStyles.title}>
        <Img style={styles.right_arrow} source={icRight} />
      </SectionTitle>
      <View style={internalStyles.list_container}>
        {
        times(Math.min(4, products.length), (index) => (
          <View style={internalStyles.thumb_container} key={index}>
            <Img style={internalStyles.image} source={sampleProduct} />
            {
              index === 3 && products.length > 4
                ? (
                  <View style={internalStyles.overlay}>
                    <Text style={internalStyles.remain_amount_text}>
+
                      {products.length - 3}
                    </Text>
                  </View>
                ) : null
            }
          </View>
        ))
      }
      </View>
      <Separator />
    </TouchableOpacity>
  );
}

ProductCombo.defaultProps = {

};

const w = (Layout.window.width - 50 - 3 * 8) / 4;
const h = (w * 4) / 3;

const internalStyles = StyleSheet.create({
  title: {
    width: Layout.window.width,
    backgroundColor: 'white'
  },
  list_container: {
    marginTop: 15,
    marginBottom: 25,
    marginLeft: 17,
    marginRight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  thumb_container: {
    width: w,
    height: h,
    borderRadius: 4,
    borderColor: Colors.imageBorder,
    borderWidth: 1,
    overflow: 'hidden',
    marginLeft: 8,
    backgroundColor: 'white'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: w,
    height: h,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: w,
    height: h,
    backgroundColor: '#231f20BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remain_amount_text: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: 'white',
  }
});

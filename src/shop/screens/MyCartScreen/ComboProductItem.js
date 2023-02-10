import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';
import Img from '../../components/Img';
import DiscountView from '../../components/DiscountView';
import discountHolder from '../../../assets/images/shop/ic_discount_holder_green.png';
import checkboxNormal from '../../../assets/images/shop/ic_radio_off.png';
import checkboxSelected from '../../../assets/images/shop/ic_radio_on.png';

type Props = {};

export default function ComboProductItem({
  combo,
  checked,
  editable,
}: Props) {
  const [selected, setSelected] = React.useState(false);

  React.useEffect(() => {
    setSelected(checked);
  }, [checked]);

  const onCheckBoxClick = () => {
    setSelected(!selected);
  };

  return (
    <View style={internalStyles.container}>
      {editable ? (
        <ImageButton
          style={internalStyles.checkbox}
          source={selected ? checkboxSelected : checkboxNormal}
          onPress={onCheckBoxClick}
        />
      ) : null }
      <View style={internalStyles.content}>
        <Text style={internalStyles.title}>{combo.comboInfo.title}</Text>
        <View style={internalStyles.price_holder}>
          <Text style={internalStyles.new_price}>690K</Text>
          <Text style={internalStyles.old_price}>780K</Text>
          <DiscountView
            style={internalStyles.discount_holder}
            amount={50}
            source={discountHolder}
          />
        </View>
        <View style={internalStyles.thumb_list}>
          {
            combo.products.map((product) => (
              <View style={internalStyles.cover_container} key={product.productId}>
                <Img
                  source={{ uri: product.url }}
                  style={internalStyles.sample_img}
                />
              </View>
            ))
          }
        </View>
      </View>
    </View>
  );
}

ComboProductItem.defaultProps = {
  checked: false,
  editable: true,
};

const internalStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFCBC9',
    minHeight: 130,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  checkbox: {
    width: 20, height: 20,
  },
  thumb_list: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cover_container: {
    backgroundColor: 'white',
    width: 74,
    height: 74,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d0d2d3',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  sample_img: {
    width: 70,
    height: 70,
  },
  content: {
    flexDirection: 'column',
    width: Layout.window.width - 60,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  discount_holder: {
    width: 42,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    fontSize: Layout.smallFontSize,
  },
  price_holder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 10,
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  },
  title: {
    ...Layout.font.bold,
    color: Colors.itemTextColor
  },
});

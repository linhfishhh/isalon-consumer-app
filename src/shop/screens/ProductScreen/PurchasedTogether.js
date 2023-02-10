/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import styles from './styles';
import Img, { WebImage } from '../../components/Img';
import SectionTitle from '../../components/SectionTitle';
import Separator from '../../components/Separator';
import { getThumbImageUrl, getProductPrice, formatCurrency } from '../../utils';
import { isAuthenticated } from '../../utils/auth';
import {
  addProductToCart as addProductToCartAction
} from '../../redux/cart/actions';
import NavigationService from '../../../NavigationService';
import AddToCartDialog from './AddToCartDialog';

type Props = {
  style: Object,
  products: Array
};

type ViewingProps = {
  product: Object,
  checked: Boolean
}

const checkboxNormal = require('../../../assets/images/shop/ic_checkbox.png');
const checkboxSelected = require('../../../assets/images/shop/ic_checkbox_selected.png');

function ViewingProduct({ product, checked, onSelectProduct }: ViewingProps) {
  const didSelectProduct = () => {
    onSelectProduct(product);
  };
  const {
    newPrice
  } = getProductPrice(product);
  return (
    <TouchableOpacity style={viewingProductStyles.container} onPress={didSelectProduct}>
      <Img
        style={viewingProductStyles.checkbox}
        source={checked ? checkboxSelected : checkboxNormal}
      />
      <View style={viewingProductStyles.text_container}>
        <Text style={viewingProductStyles.product_desc} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
        <Text style={viewingProductStyles.product_price}>{formatCurrency(newPrice)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PurchasedTogether({
  navigation,
  style,
  products,
  addProductToCart,
}: Props) {
  const [containerStyle] = React.useState({
    ...styles.purchased_together,
    ...style
  });
  const addToCartDialogRef = React.useRef(null);
  const [checkedProducts, setCheckedProducts] = React.useState(products);
  React.useEffect(() => {
    setCheckedProducts(products);
  }, [products]);
  const totalPrice = React.useMemo(() => {
    let price = 0;
    if (checkedProducts) {
      checkedProducts.forEach((product) => {
        const { newPrice } = getProductPrice(product);
        price += newPrice;
      });
    }
    return price;
  }, [checkedProducts]);

  const onAddToCart = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      const payloads = [];
      if (checkedProducts) {
        checkedProducts.forEach((product) => {
          let payload = {
            productId: product.productId,
            quantity: 1,
          };
          const { defaultProductVariant } = product;
          if (defaultProductVariant) {
            payload = {
              ...payload,
              productVariantId: defaultProductVariant.productVariantId,
            };
          }
          payloads.push(payload);
        });
      }

      addProductToCart(payloads, () => {
        addToCartDialogRef.current.show();
      });
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const onSelectProduct = (product) => {
    const allCheckedProducts = [...checkedProducts];
    const removed = _.remove(allCheckedProducts, (p) => p.productId === product.productId);
    if (_.isEmpty(removed)) {
      allCheckedProducts.push(product);
    }
    setCheckedProducts(allCheckedProducts);
  };

  return (
    <View>
      {!_.isEmpty(products) ? (
        <View style={containerStyle}>
          <SectionTitle title="Thường được mua cùng" style={internalStyles.title} />
          <ScrollView
            style={internalStyles.images_container}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {
            products.map((product, index) => (index === (products.length - 1)
              ? (
                <View style={internalStyles.product_image} key={product.productId}>
                  <WebImage
                    style={internalStyles.image}
                    source={getThumbImageUrl(product.mainImageId)}
                  />
                </View>
              )
              : (
                <View style={internalStyles.product_image_plus} key={product.productId}>
                  <View style={internalStyles.product_image}>
                    <WebImage
                      style={internalStyles.image}
                      source={getThumbImageUrl(product.mainImageId)}
                    />
                  </View>
                  <Icon style={internalStyles.plus_icon} name="add" color="#000" size={8} />
                </View>
              )))
          }
          </ScrollView>
          <Text style={internalStyles.viewing_text}>Bạn đang xem</Text>
          {
            products.map((product) => (
              <ViewingProduct
                product={product}
                key={product.productId}
                checked={_.includes(checkedProducts, product)}
                onSelectProduct={onSelectProduct}
              />
            ))
          }
          <View style={internalStyles.additional_amount_container}>
            <View style={internalStyles.separator} />
            <Text style={internalStyles.additional_amount_text}>
              {`Tổng cộng: ${formatCurrency(totalPrice)}`}
            </Text>
            <TouchableOpacity style={internalStyles.add_to_cart_button} onPress={onAddToCart}>
              <Text style={internalStyles.add_to_cart_button_title}>
                {`THÊM ${checkedProducts.length} SẢN PHẨM VÀO GIỎ HÀNG`}
              </Text>
            </TouchableOpacity>
          </View>
          <Separator />
          <AddToCartDialog
            ref={addToCartDialogRef}
            products={checkedProducts}
            navigation={navigation}
          />
        </View>
      ) : null}
    </View>
  );
}

const imageWidth = (Layout.window.width - 50 - 2 * 36) / 3;
const imageHeight = (imageWidth * 4) / 3;
const internalStyles = StyleSheet.create({
  title: {
    backgroundColor: 'white',
  },
  images_container: {
    marginLeft: 25, marginRight: 25, marginTop: 12, marginBottom: 8,
  },
  image: {
    width: imageWidth - 8,
    height: imageHeight - 8,
  },
  product_image: {
    borderRadius: 3,
    borderColor: Colors.imageBorder,
    borderWidth: 0.5,
    backgroundColor: 'white',
    padding: 4,
  },
  product_image_plus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  plus_icon: {
    marginLeft: 13, marginRight: 13
  },
  viewing_text: {
    ...Layout.font.bold,
    fontSize: 13,
    color: Colors.itemTextColor,
    marginLeft: 50
  },
  additional_amount_container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  separator: {
    width: Layout.window.width - 50,
    height: 1,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: Colors.separatorColor,
  },
  additional_amount_text: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    textAlign: 'center',
    marginTop: 8,
  },
  add_to_cart_button: {
    backgroundColor: '#ff5c39',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 3
  },
  add_to_cart_button_title: {
    ...Layout.font.bold,
    fontSize: 13,
    color: 'white',
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  }
});

const viewingProductStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 25,
    marginRight: 25
  },
  checkbox: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 4
  },
  text_container: {
    flexDirection: 'column',
  },
  product_desc: {
    ...Layout.font.normal,
    fontSize: 15,
    color: Colors.itemTextColor,
    width: Layout.window.width - 75
  },
  product_price: {
    ...Layout.font.medium,
    fontSize: 21,
    color: Colors.newPriceTextColor
  }
});

export default connect(
  null, {
    addProductToCart: addProductToCartAction,
  }
)(PurchasedTogether);

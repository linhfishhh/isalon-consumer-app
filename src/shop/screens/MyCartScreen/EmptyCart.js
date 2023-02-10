import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import SectionTitle from '../../components/SectionTitle';
import Colors from '../../constants/Colors';
import ProductItem from '../../components/ProductItem';
import Img from '../../components/Img';
import TextButton from '../../components/TextButton';
import {
  getSuggestionProducts as getSuggestionProductsAction
} from '../../redux/search/actions';

import emptyCartBg from '../../../assets/images/shop/empty_cart.png';

type Props = {
  navigation: Object,
};

function EmptyCart({
  navigation,
  suggestionProducts,
  getSuggestionProducts,
}: Props) {
  React.useEffect(() => {
    getSuggestionProducts(0);
  }, []);

  const onContinueShopping = React.useCallback(() => {
    navigation.popToTop();
  }, []);

  const keyExtractor = (item, index) => item + index;

  const renderProductItem = ({ item }) => (
    <ProductItem
      product={item}
      style={styles.product_item_style}
      horizontal={false}
      navigation={navigation}
    />
  );

  const header = React.useMemo(() => (
    <View style={styles.header_container}>
      <Img
        source={emptyCartBg}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.info_container}>
        <Text style={styles.empty_info_text}>Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
        <TextButton
          style={styles.continue_shopping_button}
          titleStyle={styles.continue_shopping_button_title}
          title="TIẾP TỤC MUA SẮM"
          onPress={onContinueShopping}
        />
      </View>
      <SectionTitle title="Gợi ý dành riêng cho bạn" style={styles.section_title} />
    </View>
  ), []);

  const onEndReached = () => {
    const page = _.get(suggestionProducts, 'pageable.pageNumber');
    const last = _.get(suggestionProducts, 'last', true);
    if (!last) {
      getSuggestionProducts(page + 1);
    }
  };

  return (
    <FlatList
      style={styles.list}
      data={_.get(suggestionProducts, 'content', [])}
      keyExtractor={keyExtractor}
      renderItem={renderProductItem}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={header}
      numColumns={2}
      columnWrapperStyle={styles.column_wrapper}
      onEndReached={onEndReached}
    />
  );
}

const maxScreenWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const w = maxScreenWidth / 2 - 25;
const h = ((w * 4) / 3) + 90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'column'
  },
  list: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  section_title: {
    alignSelf: 'flex-start',
  },
  column_wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: (Layout.window.width - 2 * w) / 2,
  },
  product_item_style: {
    width: w,
    height: h,
    marginLeft: 0,
  },
  cover: {
    width: Layout.window.width,
    height: 280,
  },
  info_container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 5,
    height: 110,
    marginLeft: 25,
    marginRight: 25,
    marginTop: -30,
    overflow: 'hidden',
  },
  continue_shopping_button: {
    backgroundColor: Colors.tintColor,
    height: 45,
  },
  continue_shopping_button_title: {
    ...Layout.font.bold,
    color: 'white',
  },
  empty_info_text: {
    ...Layout.font.bold,
    color: Colors.tintColor,
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  },
});

export default connect(
  (state) => ({
    suggestionProducts: state.shopSearch.suggestionProducts
  }),
  {
    getSuggestionProducts: getSuggestionProductsAction,
  }
)(EmptyCart);

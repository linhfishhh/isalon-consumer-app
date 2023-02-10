import React from 'react';
import {
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import Colors from '../../shop/constants/Colors';
import styles from './styles';
import Separator from '../../shop/components/Separator';
import DeleteRowMenu from './DeleteRowMenu';
import {
  fetchFavoritedProducts as fetchFavoritedProductsAction,
  updateProductFavorite as updateProductFavoriteAction,
} from '../../shop/redux/product/actions';
import ProductItem from '../../shop/components/ProductItem';

type Props = {};

function ProductFavorites(props: Props) {
  const {
    navigation,
    fetchFavoritedProducts,
    updateProductFavorite,
    allFavoritedProducts,
    fetchingFavoritedProducts
  } = props;
  React.useEffect(() => {
    fetchFavoritedProducts(0);
  }, []);

  const onRemoveFavorite = (product) => {
    updateProductFavorite(product.productId, false);
  };

  const keyExtractor = (item) => `${item.productId}`;

  const renderItem = (rowData) => (
    <View style={styles.product_item_container}>
      <ProductItem
        product={rowData.item}
        horizontal
        style={styles.product_item_style}
        navigation={navigation}
      />
    </View>
  )

  const renderHiddenItem = (rowData, rowMap) => (
    <DeleteRowMenu rowData={rowData} rowMap={rowMap} onDelete={onRemoveFavorite} />
  );

  const renderItemSeparator = () => (
    <Separator height={1} />
  );

  const renderSectionSeparator = () => (
    <Separator height={1} />
  );

  const onEndReached = () => {
    const page = _.get(allFavoritedProducts, 'pageable.pageNumber');
    const last = _.get(allFavoritedProducts, 'last', true);
    if (!last) {
      fetchFavoritedProducts(page + 1);
    }
  }

  const onRefresh = () => {
    fetchFavoritedProducts(0);
  }

  return (
    <View style={styles.container}>
      <Spinner
        visible={fetchingFavoritedProducts}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.tintColor} size={10} count={3} />}
      />
      <SwipeListView
        useSectionList={false}
        data={_.get(allFavoritedProducts, 'content', [])}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={keyExtractor}
        disableRightSwipe
        leftOpenValue={75}
        rightOpenValue={-110}
        ItemSeparatorComponent={renderItemSeparator}
        onRefresh={onRefresh}
        refreshing={fetchingFavoritedProducts}
      />
    </View>
  );
}

export default connect(
  (state) => ({
    allFavoritedProducts: state.shopProduct.allFavoritedProducts,
    fetchingFavoritedProducts: state.shopProduct.fetchingFavoritedProducts,
  }),
  {
    fetchFavoritedProducts: fetchFavoritedProductsAction,
    updateProductFavorite: updateProductFavoriteAction
  }
)(ProductFavorites);

import React from 'react';
import {
  View, FlatList, StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import composeNavigation from '../../helpers/composeNavigation';
import NavigationBar from './NavigationBar';
import Banner from './Banner';
import ProductCategories from './ProductCategories';
import FlashSaleProducts from './FlashSaleProducts';
import TargetedUserProducts from './TargetedUserProducts';
import NewProducts from './NewProducts';
import CommonSection from './CommonSection';
import ProductItem from '../../components/ProductItem';
import SectionTitle from '../../components/SectionTitle';
import styles, { numberOfProductPerColumn } from './styles';
import MyCartButton from './MyCartButton';
import {
  getSpotlightItems as getSpotlightItemsAction,
  getAllProducts as getAllProductsAction,
} from '../../redux/home/actions';
import { getCartQuantity as getCartQuantityAction } from '../../redux/cart/actions';
import HotSaleSection from './HotSaleSection';

type Props = {
  navigation: Object,
  getSpotlightItems: Function,
  spotlightItems: Array,
  allProducts: Object
};

function Header(props) {
  const { spotlightItems, navigation } = props;
  // useWhyDidYouUpdate('Header', props);
  const makeHeaderComponent = (spotlightItem) => {
    switch (spotlightItem.type) {
      case 'banner':
        return (
          <Banner
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      case 'category':
        return (
          <ProductCategories
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      case 'flashsale':
        return (
          <FlashSaleProducts
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      case 'targetedProduct':
        return (
          <TargetedUserProducts
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      case 'group':
        return (
          <NewProducts
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      case 'bestSelling':
        return (
          <HotSaleSection
            navigation={navigation}
            key={spotlightItem.spotlightItemId}
            spotlightItem={spotlightItem}
          />
        );
      default: break;
    }
    return (
      <CommonSection
        navigation={navigation}
        key={spotlightItem.spotlightItemId}
        spotlightItem={spotlightItem}
      />
    );
  };

  return (
    <View style={styles.header_container}>
      {spotlightItems.map((spotlightItem) => makeHeaderComponent(spotlightItem))}
      {spotlightItems.length > 0 ? (
        <SectionTitle
          title="Tất cả sản phẩm"
          style={styles.section_title}
          navigation={navigation}
        />
      ) : null}
    </View>
  );
}

const HeaderWrapper = React.memo(Header);

function ShopHomeScreen(props: Props) {
  const {
    navigation,
    getSpotlightItems,
    getAllProducts,
    getCartQuantity,
    spotlightItems,
    categories,
    allProducts,
    refreshing
  } = props;
  const onRefresh = () => {
    getSpotlightItems();
    getCartQuantity();
  };

  React.useEffect(() => {
    if (spotlightItems && spotlightItems.length > 0) {
      getAllProducts(0);
    }
  }, [spotlightItems]);

  React.useEffect(() => {
    onRefresh();
  }, []);

  const keyExtractor = (item) => `${item.productId}`;

  const renderItem = ({ item }) => (
    <ProductItem
      product={item}
      style={styles.product_item_style}
      navigation={navigation}
    />
  );

  const header = (
    <HeaderWrapper
      spotlightItems={spotlightItems}
      categories={categories}
      navigation={navigation}
    />
  );

  const onEndReached = () => {
    if (!allProducts.pageInfo.last) {
      getAllProducts(allProducts.pageInfo.page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <FlatList
        style={styles.list}
        data={allProducts.contents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={header}
        numColumns={numberOfProductPerColumn}
        columnWrapperStyle={styles.column_wrapper}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        maxToRenderPerBatch={4}
        initialNumToRender={1}
      />
      <MyCartButton style={styles.my_cart_button} navigation={navigation} />
    </View>
  );
}

function ShopHomeScreenWrapper(props) {
  const { route, ...resProps } = props;
  const { navigation } = route;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ShopHomeScreen navigation={navigation} {...resProps} />
  );
}

// export default composeNavigation(NavigationBar)(ShopHomeScreen);
export default connect(
  (state) => ({
    spotlightItems: state.shopHome.spotlightItems,
    categories: state.shopHome.categories,
    allProducts: state.shopHome.allProducts,
    refreshing: state.shopHome.refreshing
  }),
  {
    getSpotlightItems: getSpotlightItemsAction,
    getAllProducts: getAllProductsAction,
    getCartQuantity: getCartQuantityAction,
  }
)(composeNavigation(NavigationBar)(ShopHomeScreenWrapper));

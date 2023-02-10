import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SectionTitle from '../../components/SectionTitle';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import ProductItem from '../../components/ProductItem';
import NewProductItem from '../../components/NewProductItem';
import styles from './styles';
import Separator from '../../components/Separator';
import Space from '../../components/Space';
import ViewAllButton from '../../components/ViewAllButton';
import { SpotlightTypes, SortType, DEFAULT_PAGE_SIZE } from '../../constants';
import {
  getCategoryProducts as getCategoryProductsAction
} from '../../redux/home/actions';

type Props = {
  navigation: Object,
  categories: Object,
  spotlightItem: Object,
  getCategoryProducts: Function,
};

function NewProducts(props: Props) {
  const {
    navigation,
    spotlightItem,
    categories,
    getCategoryProducts,
  } = props;
  React.useEffect(() => {
    const categoryId = _.get(spotlightItem, 'category.categoryId');
    if (categoryId !== undefined) {
      const params = {
        sortType: SortType.NEW_PRODUCT,
        categoryIds: categoryId
      };
      getCategoryProducts(SpotlightTypes.newProduct, params, 0, DEFAULT_PAGE_SIZE);
    }
  }, [spotlightItem]);

  const renderItem = ({ index }) => {
    const group = _.take(_.drop(displayProducts, index * 4), 4);
    return (
      <View style={internalStyles.item} key={index}>
        <ProductItem
          product={group[0]}
          style={styles.product_item_style}
          navigation={navigation}
        />
        <View style={internalStyles.separator} />
        <View style={internalStyles.sub_new_products_container}>
          {
            _.times(group.length - 1, (i) => {
              const product = group[i + 1];
              return (
                <NewProductItem key={product.productId} product={product} navigation={navigation} />
              );
            })
          }
        </View>
      </View>
    );
  };

  const onViewAll = React.useCallback(() => {
    navigation.push('SearchResultScreen', {
      title: spotlightItem.name,
      category: SpotlightTypes.newProduct,
      id: _.get(spotlightItem, 'category.categoryId'),
    });
  }, []);

  const categoryId = _.get(spotlightItem, 'category.categoryId');
  const data = _.get(categories, `${SpotlightTypes.newProduct}_${categoryId}`);
  const displayProducts = _.take(_.get(data, 'contents'), 12);
  const numberOfPages = Math.floor(displayProducts.length / 4);
  const [imageIndex, setImageIndex] = React.useState(0);
  const items = React.useMemo(() => {
    const ret = [];
    for (let i = 0; i < numberOfPages; i += 1) {
      const group = _.take(_.drop(displayProducts, i * 4), 4);
      ret.push(group);
    }
    return ret;
  }, [data]);

  const onSnapToItem = (index) => {
    setImageIndex(index);
  };

  return (
    <View>
      {items && items.length > 0 ? (
        <View style={internalStyles.container}>
          <SectionTitle
            title={spotlightItem.name}
            style={internalStyles.section_title}
          >
            <ViewAllButton onPress={onViewAll} />
          </SectionTitle>
          <View style={internalStyles.carousel_container}>
            <Carousel
              autoplay={false}
              loop={false}
              sliderWidth={ITEM_WIDTH}
              sliderHeight={ITEM_HEIGHT}
              itemWidth={ITEM_WIDTH}
              data={items}
              renderItem={renderItem}
              onSnapToItem={onSnapToItem}
            />
            { numberOfPages > 0 ? (
              <Pagination
                dotsLength={numberOfPages}
                activeDotIndex={imageIndex}
                containerStyle={internalStyles.page_container}
                dotStyle={internalStyles.dot_style}
                inactiveDotColor={Colors.separatorColor}
                dotColor={Colors.tintColor}
                inactiveDotOpacity={1}
                inactiveDotScale={0.7}
              />
            ) : null }
          </View>
          <Space />
          <Separator />
        </View>
      ) : null}
    </View>
  );
}

const ITEM_HEIGHT = 330;
const ITEM_WIDTH = Layout.window.width;

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 400
  },
  section_title: {
    backgroundColor: 'white'
  },
  carousel_container: {
    width: Layout.window.width,
    height: ITEM_HEIGHT,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: Layout.window.width - 50,
    marginLeft: 25,
    marginRight: 25,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sub_new_products_container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: Layout.window.width - 55 - styles.product_item_style.width,
    paddingTop: 5
  },
  separator: {
    width: 1,
    height: ITEM_HEIGHT - 50,
    marginTop: 5,
    marginRight: 5,
    backgroundColor: Colors.separatorColor,
  },
  page_container: {
    position: 'absolute',
    bottom: -20,
  },
  dot_style: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: -3,
  },
});

export default connect(
  (state) => ({
    categories: state.shopHome.categories,
  }),
  {
    getCategoryProducts: getCategoryProductsAction,
  }
)(React.memo(NewProducts));

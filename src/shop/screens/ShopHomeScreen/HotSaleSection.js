import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import SectionTitle from '../../components/SectionTitle';
import Colors from '../../constants/Colors';
import ProductItem from '../../components/ProductItem';
import ViewAllButton from '../../components/ViewAllButton';
import styles from './styles';
import Separator from '../../components/Separator';
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

function HotSaleSection(props: Props) {
  const {
    navigation,
    spotlightItem,
    categories,
    getCategoryProducts,
  } = props;
  // useWhyDidYouUpdate('CommonSection', props);
  React.useEffect(() => {
    const params = { sortType: SortType.HOT_ORDER };
    getCategoryProducts(SpotlightTypes.hotSale, params, 0, DEFAULT_PAGE_SIZE);
  }, [spotlightItem]);

  const keyExtractor = (item) => `${item.productId}`;

  const renderItem = ({ item }) => (
    <ProductItem
      product={item}
      horizontal={false}
      style={styles.product_item_style}
      navigation={navigation}
    />
  );

  const header = (<View style={internalStyles.header_footer} />);

  const onViewAll = () => {
    navigation.push('SearchResultScreen', {
      title: spotlightItem.name,
      category: SpotlightTypes.hotSale,
      id: 0,
    });
  };

  const data = _.get(categories, SpotlightTypes.hotSale);
  const displayProducts = React.useMemo(() => _.take(_.get(data, 'contents'), 12), [data]);
  return (
    <View>
      {displayProducts && displayProducts.length > 0 ? (
        <View style={internalStyles.container}>
          <SectionTitle title={spotlightItem.name}>
            <ViewAllButton onPress={onViewAll} />
          </SectionTitle>
          <FlatList
            style={internalStyles.product_list}
            data={displayProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={header}
            ListFooterComponent={header}
            maxToRenderPerBatch={3}
            initialNumToRender={3}
          />
          <Separator />
        </View>
      ) : null}
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor
  },
  product_list: {
    marginTop: 10,
    marginBottom: 10,
  },
  header_footer: {
    width: 20
  },
});

export default connect(
  (state) => ({
    categories: state.shopHome.categories,
  }),
  {
    getCategoryProducts: getCategoryProductsAction,
  }
)(React.memo(HotSaleSection));

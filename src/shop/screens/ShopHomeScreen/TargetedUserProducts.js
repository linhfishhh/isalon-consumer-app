import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import SectionTitle from '../../components/SectionTitle';
import Colors from '../../constants/Colors';
import TargetedUserProductItem from '../../components/TargetedUserProductItem';
import ViewAllButton from '../../components/ViewAllButton';
import {
  getSuggestionProducts as getSuggestionProductsAction
} from '../../redux/search/actions';
import Separator from '../../components/Separator';
import { SpotlightTypes } from '../../constants';

type Props = {
  navigation: Object,
};

function TargetedUserProducts({
  navigation,
  spotlightItem,
  suggestionProducts,
  getSuggestionProducts,
}: Props) {
  React.useEffect(() => {
    getSuggestionProducts(0);
  }, [spotlightItem]);

  const keyExtractor = (item) => `${item.productId}`;

  const renderItem = ({ item }) => (
    <TargetedUserProductItem product={item} navigation={navigation} />
  );

  const header = () => (
    <View style={styles.header_footer} />
  );

  const onViewAll = () => {
    navigation.push('SearchResultScreen', {
      title: 'Dành riêng cho bạn',
      category: SpotlightTypes.targeted,
      id: 0,
    });
  };

  const displayProducts = _.get(suggestionProducts, 'content');
  return (
    <View>
      {displayProducts && displayProducts.length > 0 ? (
        <View style={styles.container}>
          <SectionTitle title="Dành riêng cho bạn">
            <ViewAllButton onPress={onViewAll} />
          </SectionTitle>
          <FlatList
            style={styles.product_list}
            data={displayProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={header}
            ListFooterComponent={header}
          />
          <Separator />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor
  },
  product_list: {
    marginTop: 10,
    marginBottom: 20,
  },
  header_footer: {
    width: 20
  },
});

export default connect(
  (state) => ({
    suggestionProducts: state.shopSearch.suggestionProducts
  }),
  {
    getSuggestionProducts: getSuggestionProductsAction,
  }
)(TargetedUserProducts);

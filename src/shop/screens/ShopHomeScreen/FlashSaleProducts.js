import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import FlashSaleProductItem from '../../components/FlashSaleProductItem';
import FlashSale from './FlashSale';
import Separator from '../../components/Separator';
import {
  getCurrentFlashSaleInfo as getCurrentFlashSaleInfoAction,
} from '../../redux/home/actions';
import { SpotlightTypes } from '../../constants';

type Props = {
  navigation: Object,
  spotlightItem: Object,
};

function FlashSaleProducts(props: Props) {
  const {
    navigation,
    spotlightItem,
    currentFlashSale,
    getCurrentFlashSaleInfo,
  } = props;
  // useWhyDidYouUpdate('FlashSaleProducts', props);

  React.useEffect(() => {
    getCurrentFlashSaleInfo();
  }, [spotlightItem]);

  const keyExtractor = (item) => `${item.productId}`;

  const renderItem = ({ item }) => (
    <FlashSaleProductItem product={item} navigation={navigation} />
  );

  const header = (<View style={styles.header_footer} />);

  const onViewAll = () => {
    navigation.push('SearchResultScreen', {
      title: spotlightItem.name,
      category: SpotlightTypes.flashSale,
      id: _.get(currentFlashSale, 'flashSale.flashSaleId')
    });
  };
  const displayProducts = _.get(currentFlashSale, 'products') || [];
  return (
    <View>
      {displayProducts && displayProducts.length > 0 ? (
        <View style={styles.container}>
          <FlashSale onViewAll={onViewAll} startAt={_.get(currentFlashSale, 'flashSale.startAt')} expiredAt={_.get(currentFlashSale, 'flashSale.expiredAt')} />
          <FlatList
            // extraData={currentFlashSale}
            style={styles.product_list}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor,
  },
  product_list: {
    marginTop: 15,
    marginBottom: 10
  },
  header_footer: {
    width: 20
  },
});

export default connect(
  (state) => ({
    currentFlashSale: state.shopHome.currentFlashSale,
  }),
  {
    getCurrentFlashSaleInfo: getCurrentFlashSaleInfoAction,
  }
)(FlashSaleProducts);

import React from 'react';
import {
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import internalStyles from './styles';
import Item from './Item';
import {
  getAllProductVariants as getAllProductVariantsAction,
} from '../../../redux/product/actions';

type Props = {};

function VariantList({
  product,
  selectedVariant,
  productDetails,
  getAllProductVariants,
}: Props) {
  React.useEffect(() => {
    getAllProductVariants(product.productId);
  }, []);

  const productVariants = _.get(productDetails, `${product.productId}.allVariants`, {});
  const totalElements = _.get(productVariants, 'totalElements', 0);
  const sortedVariants = React.useMemo(() => {
    const ret = [..._.get(productVariants, 'content', [])];
    ret.sort((a, b) => {
      if (_.get(selectedVariant, 'productVariantId') === a.productVariantId) {
        return -1;
      }
      if (_.get(selectedVariant, 'productVariantId') === b.productVariantId) {
        return 1;
      }
      return 0;
    });
    return ret;
  }, [productDetails]);

  return (
    <View style={internalStyles.list_container}>
      {
        _.times(Math.min(5, totalElements), (index) => {
          const productVariant = sortedVariants[index];
          return (
            <Item
              item={productVariant}
              totalElements={totalElements}
              key={productVariant.productVariantId}
              index={index}
              selected={_.get(selectedVariant, 'productVariantId') === _.get(productVariant, 'productVariantId')}
            />
          );
        })
      }
    </View>
  );
}

const VariantListWrapper = connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
  }),
  {
    getAllProductVariants: getAllProductVariantsAction,
  }
)(VariantList);

export default VariantListWrapper;

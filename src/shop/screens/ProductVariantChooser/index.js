import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import DefaultModal from '../../components/DefaultModal';
import Colors from '../../constants/Colors';
import ColorVariantItem from '../../components/ColorVariantItem';
import Space from '../../components/Space';
import AmountCounter from '../../components/AmountCounter';
import Separator from '../../components/Separator';
import styles from './styles';
import {
  getProductVariants as getProductVariantsAction,
  getProductVariantValues as getProductVariantValuesAction,
  updateSelectedProductVariant as updateSelectedProductVariantAction,
  updateSelectedProductQuantity as updateSelectedProductQuantityAction,
} from '../../redux/product/actions';
import Header from './Header';
import VariantValueGroup from './VariantValueGroup';
import Footer from '../ProductScreen/Footer';

class ProductVariantChooser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      options: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const productId = _.get(props, 'product.productId', -1);
    const defaultVariant = _.get(props, 'product.defaultProductVariant');
    const selectedVariant = _.get(props, `productDetails.${productId}.selectedVariant`, defaultVariant);
    const variantValues = _.get(selectedVariant, 'variantValues', []);
    if (_.isEmpty(state.options) && !_.isEmpty(variantValues)) {
      // const options = [];
      // variantValues.forEach((element) => {
      //   if (!_.isEmpty(element.variantValues)) {
      //     options.push({
      //       variantId: element.variantId,
      //       variantValueId: element.variantValues[0].variantValueId,
      //       variantValueName: element.variantValues[0].name,
      //     });
      //   }
      // });
      const options = [...variantValues];
      if (!_.isEmpty(options) && !_.isEqual(options.sort(), state.options.sort())) {
        props.getProductVariants(props.product.productId, _.map(options, 'variantValueId').join(','));
        return {
          ...state,
          options
        };
      }
    }
    return state;
  }

  componentDidMount() {
    const { getProductVariantValues, product } = this.props;
    getProductVariantValues(product.productId);
  }

  setModalRef = (ref) => {
    this.modalRef = ref;
  }

  show = () => {
    this.setState({
      isModalVisible: true,
    });
  }

  close = (callback) => {
    this.callback = callback;
    this.onClose();
  };

  onClose = () => {
    this.setState({
      isModalVisible: false,
    });
  }

  onModalHide = () => {
    if (this.callback) {
      this.callback();
      this.callback = undefined;
    }
  }

  onCounterChange = ({ count }) => {
    const { updateSelectedProductQuantity } = this.props;
    const productId = _.get(this.props, 'product.productId', -1);
    updateSelectedProductQuantity(productId, count);
  }

  keyExtractor = (item) => `${item.productVariantId}`;

  onSelectProductVariant = (item) => {
    const { updateSelectedProductVariant } = this.props;
    const productId = _.get(this.props, 'product.productId', -1);
    updateSelectedProductVariant(productId, item);
  };

  renderVariantItem = ({ item }) => {
    const productId = _.get(this.props, 'product.productId', -1);
    const selectedVariant = _.get(this.props, `productDetails.${productId}.selectedVariant`);
    return (
      <ColorVariantItem
        item={item}
        selected={_.get(selectedVariant, 'productVariantId') === item.productVariantId}
        onPress={this.onSelectProductVariant}
      />
    );
  }

  onSelectVariantValue = (variant, variantValue) => {
    const { options } = this.state;
    const productId = _.get(this.props, 'product.productId', -1);
    const { getProductVariants, updateSelectedProductVariant } = this.props;
    const newOptions = [...options];
    _.remove(newOptions, (el) => el.variantId === variant.variantId);
    newOptions.push({
      variantId: variant.variantId,
      variantValueId: variantValue.variantValueId,
      // variantValueName: variantValue.name,
    });
    if (!_.isEmpty(newOptions) && !_.isEqual(newOptions.sort(), options.sort())) {
      this.setState({ options: newOptions }, () => {
        getProductVariants(productId, _.map(newOptions, 'variantValueId').join(','), ({ data }) => {
          if (!_.isEmpty(data)) {
            updateSelectedProductVariant(productId, data[0]);
          }
        });
      });
    }
  }

  footer = () => {
    const { options } = this.state;
    const productId = _.get(this.props, 'product.productId', -1);
    const variantValues = _.get(this.props, `productDetails.${productId}.variantValues`);
    const initialQuantity = _.get(this.props, `productDetails.${productId}.quantity`, 1);
    return (
      <View style={styles.tags_container}>
        <Separator color={Colors.backgroundColor} />
        {
          variantValues.map((tag) => (
            <VariantValueGroup
              key={tag.variantId}
              group={tag}
              option={_.find(options, (el) => el.variantId === tag.variantId)}
              onSelect={this.onSelectVariantValue}
            />
          ))
        }
        <View style={styles.amount_container}>
          <Text style={styles.section_title}>Số lượng</Text>
          <Space />
          <AmountCounter initialValue={initialQuantity} align="left" onChange={this.onCounterChange} />
        </View>
      </View>
    );
  }

  render() {
    const { isModalVisible } = this.state;
    const {
      title,
      product,
      navigation,
      onBuyNow,
      onAddToCart,
      onRequestLogin
    } = this.props;
    const { productDetails } = this.props;
    const productId = _.get(this.props, 'product.productId', -1);
    const variantValues = _.get(this.props, `productDetails.${productId}.variantValues`);
    const variants = _.get(productDetails, `${productId}.variants`);
    const selectedVariant = _.get(productDetails, `${productId}.selectedVariant`);
    return (
      <DefaultModal
        ref={this.setModalRef}
        isVisible={isModalVisible}
        onClose={this.onClose}
        title={title}
        onModalHide={this.onModalHide}
      >
        <View style={styles.container}>
          <Header
            product={product}
            selectedVariant={selectedVariant}
          />
          <FlatList
            style={styles.list}
            data={variants}
            extraData={_.get(selectedVariant, 'productVariantId')}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderVariantItem}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={_.isEmpty(variantValues) ? null : (
              <Text style={styles.empty_list}>Không có sản phẩm nào</Text>
            )}
            ListFooterComponent={this.footer}
            numColumns={4}
            columnWrapperStyle={styles.column_wrapper}
            maxToRenderPerBatch={4}
            initialNumToRender={1}
          />
          <Separator color={Colors.backgroundColor} />
          <Footer
            product={product}
            navigation={navigation}
            onBuyNow={onBuyNow}
            onAddToCart={onAddToCart}
            onRequestLogin={onRequestLogin}
          />
        </View>
      </DefaultModal>
    );
  }
}

export default connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
  }),
  {
    getProductVariants: getProductVariantsAction,
    getProductVariantValues: getProductVariantValuesAction,
    updateSelectedProductVariant: updateSelectedProductVariantAction,
    updateSelectedProductQuantity: updateSelectedProductQuantityAction,
  },
  null,
  { withRef: true }
)(ProductVariantChooser);

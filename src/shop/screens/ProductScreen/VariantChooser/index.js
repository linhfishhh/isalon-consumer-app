import React from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import ProductVariantChooser from '../../ProductVariantChooser';
import VariantListWrapper from './VariantList';
import Header from './Header';
import Separator from '../../../components/Separator';
import NavigationService from '../../../../NavigationService';

export default class VariantChooser extends React.PureComponent {
  openProductVariantChooserScreen = () => {
    this.productVariantChooserRef.show();
  };

  setChooserRef = (ref) => {
    if (ref) {
      this.productVariantChooserRef = ref.getWrappedInstance();
    }
  }

  requestLogin = () => {
    this.productVariantChooserRef.close(() => {
      NavigationService.navigate('new_login', { hasBack: true });
    });
  }

  buyNow = (payload) => {
    const { onBuyNow } = this.props;
    this.productVariantChooserRef.close(() => {
      onBuyNow(payload);
    });
  }

  addToCart = (payload) => {
    const { onAddToCart } = this.props;
    this.productVariantChooserRef.close(() => {
      onAddToCart(payload);
    });
  }

  renderVariants = () => {
    const {
      product,
      selectedVariant,
      navigation,
    } = this.props;

    return (
      <TouchableOpacity
        style={styles.variant_chooser}
        onPress={this.openProductVariantChooserScreen}
      >
        <Header selectedVariant={selectedVariant} />
        <VariantListWrapper product={product} selectedVariant={selectedVariant} />
        <ProductVariantChooser
          ref={this.setChooserRef}
          title=""
          product={product}
          navigation={navigation}
          onBuyNow={this.buyNow}
          onAddToCart={this.addToCart}
          onRequestLogin={this.requestLogin}
        />
        <Separator />
      </TouchableOpacity>
    );
  }

  render() {
    return this.renderVariants();
  }
}

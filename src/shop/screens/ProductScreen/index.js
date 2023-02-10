import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  StatusBar,
  Image
} from 'react-native';
import _, { times } from 'lodash';
import { connect } from 'react-redux';
import Shimmer from 'react-native-shimmer-placeholder';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import NavigationBar from './NavigationBar';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TextButton from '../../components/TextButton';
import Separator from '../../components/Separator';
import styles from './styles';
import BannerImages from '../../components/BannerImages';
import ProductSummary from './ProductSummary';
import ProductDetail from './ProductDetail';
import PurchasedTogether from './PurchasedTogether';
import ShippingLocation from './ShippingLocation';
import CustomerRights from './CustomerRights';
import Evaluation from './Evaluation';
import Ask from './Ask';
import VariantChooser from './VariantChooser';
import Footer from './Footer';
import DiscountCode from './DiscountCode';
import WAAlert from '../../../components/WAAlert';
import {
  getProductDetail as getProductDetailAction,
  clearProductInfo as clearCurrentProductInfoAction,
  updateSelectedProductVariant as updateSelectedProductVariantAction,
} from '../../redux/product/actions';
import {
  updateErrors as updateErrorsAction,
  addProductToCart as addProductToCartAction,
} from '../../redux/cart/actions';
import MainContainer from '../../components/MainContainer';
import OverlayNavigationBar from './OverlayNavigationBar';
import { CommonStyles } from '../../constants';
import { getAllReview } from '../../redux/reviewsProduct/actions';
import { getAllFAQ } from '../../redux/FAQProduct/actions';
import ImageSources from '../../../styles/ImageSources';
import AddToCartDialog from './AddToCartDialog';

type Props = {
};

function HeaderTitle({
  title, selected, index, onPress
}: Props) {
  const onClick = () => {
    onPress(index);
  };

  return (
    <View style={internalStyles.header_button_container}>
      <TextButton
        style={internalStyles.header_button}
        titleStyle={internalStyles.header_title}
        title={title}
        onPress={onClick}
      />
      {selected ? <View style={internalStyles.header_indicator} /> : null}
    </View>
  );
}

function ProductScreen(props: Props) {
  const {
    navigation,
    getProductDetail,
    clearProductInfo,
    productDetails,
    updateSelectedProductVariant,
    updateErrors,
    errors,
    getTopReview,
    topReview,
    getTopFAQ,
    topFAQ,
    addProductToCart
  } = props;

  // useWhyDidYouUpdate('ProductScreen', props);

  const product = navigation.getParam('product');
  const productId = _.get(product, 'productId', -1);
  const currentProductInfo = _.get(productDetails, `${productId}.detail`);
  const selectedVariant = _.get(productDetails, `${productId}.selectedVariant`) || product.defaultProductVariant;

  const sectionListRef = React.useRef(null);
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0);
  const [voucher, setVoucher] = React.useState(null);

  const addToCartDialogRef = React.useRef(null);
  const products = React.useMemo(() => (
    [{ ...product, defaultProductVariant: selectedVariant }]
  ), [selectedVariant]);

  React.useEffect(() => {
    updateSelectedProductVariant(productId, product.defaultProductVariant);
    getProductDetail(productId);
    getTopReview(productId);
    getTopFAQ(productId);

    return () => {
      clearProductInfo(productId);
    };
  }, []);

  const [fakeData, setFakeData] = React.useState([]);

  React.useEffect(() => {
    if (!_.isEmpty(currentProductInfo)) {
      const fk = [];
      times(11, (index) => {
        fk.push({
          index,
          title: `${index}`,
          data: [index],
        });
      });
      setFakeData(fk);
    }
  }, [productDetails]);

  const openProductDetail = () => {
    const htmlContent = _.get(currentProductInfo, 'description');
    navigation.navigate('HtmlViewScreen', { title: 'Chi tiết sản phẩm', content: htmlContent });
  };

  const openProductReview = () => {
    navigation.navigate('AddReviewScreen', { product });
  };

  const openProductFAQ = () => {
    navigation.navigate('ProductFAQ', { product });
  };

  // const openProductCombo = () => {
  //   navigation.push('ProductComboScreen');
  // };

  const didSelectVoucher = React.useCallback((v) => {
    setVoucher(v);
  }, []);

  const [reviewLayout, setReviewLayout] = React.useState({
    x: 0, y: 0, width: 0, height: 0
  });
  const [faqLayout, setFAQLayout] = React.useState({
    x: 0, y: 0, width: 0, height: 0
  });

  const onReviewLayout = ({ nativeEvent }) => {
    setReviewLayout(_.get(nativeEvent, 'layout'));
  };

  const onFAQLayout = ({ nativeEvent }) => {
    setFAQLayout(_.get(nativeEvent, 'layout'));
  };

  const renderSection = (section) => {
    switch (section.index) {
      case 0: return (
        <BannerImages
          images={_.get(currentProductInfo, 'collection.images')}
        />
      );
      case 1: return <ProductSummary product={product} />;
      case 2: return <View />;
      // <ProductCombo products={purchasedTogetherProducts} onPress={openProductCombo}/>;
      case 3: return <DiscountCode didSelectVoucher={didSelectVoucher} />;
      case 4: return (
        <VariantChooser
          product={product}
          selectedVariant={selectedVariant}
          navigation={navigation}
          onBuyNow={onBuyNow}
          onAddToCart={onAddToCart}
        />
      );
      case 5: return (
        <ProductDetail
          product={product}
          onPress={openProductDetail}
          desc={_.get(currentProductInfo, 'description')}
        />
      );
      case 6: return (
        <PurchasedTogether
          products={_.get(currentProductInfo, 'relatedProducts', [])}
          navigation={navigation}
        />
      );
      case 7: return <ShippingLocation product={product} navigation={navigation} />;
      case 8: return <CustomerRights />;
      case 9: return (
        <Evaluation
          onPress={openProductReview}
          navigation={navigation}
          product={currentProductInfo}
          topReview={topReview}
        />
      );
      case 10: return (
        <Ask
          product={product}
          onPress={openProductFAQ}
          navigation={navigation}
          topFAQ={topFAQ}
        />
      );
      default: return undefined;
    }
  };

  const onBuyNow = React.useCallback((cartItem) => {
    navigation.push('PaymentScreen', {
      cartItems: [cartItem],
      buyNow: true,
      voucher,
      backScreen: 'ProductScreen'
    });
  }, [voucher]);

  const onAddToCart = React.useCallback((payload) => {
    addProductToCart([payload], () => {
      addToCartDialogRef.current.show();
    });
  }, []);

  const renderFooter = () => (
    <Footer
      product={product}
      onBuyNow={onBuyNow}
      onAddToCart={onAddToCart}
    />
  );

  const onScrollToSection = (index) => {
    const scrollView = _.get(sectionListRef, 'current._component');
    switch (index) {
      case 0: scrollView.scrollTo({ x: 0, y: 0, animated: true }); break;
      case 9: scrollView.scrollTo({ x: 0, y: reviewLayout.y - 130, animated: true }); break;
      case 10: scrollView.scrollTo({ x: 0, y: faqLayout.y - 130, animated: true }); break;
      default: break;
    }
  };

  const scrollOffsetY = React.useRef(new Animated.Value(0)).current;

  const navBarOpacity = scrollOffsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 1]
  });

  const overlayNavBarOpacity = scrollOffsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0]
  });

  const renderOverlayNavBar = () => (
    <Animated.View style={[
      internalStyles.nav_container,
      {
        opacity: overlayNavBarOpacity
      }
    ]}
    >
      <OverlayNavigationBar navigation={navigation} product={currentProductInfo} />
    </Animated.View>
  );

  const clearErrors = () => {
    updateErrors(undefined);
  };

  const renderNavBar = () => (
    <Animated.View style={[
      internalStyles.nav_container,
      {
        opacity: navBarOpacity
      }
    ]}
    >
      <NavigationBar navigation={navigation} productId={productId} />
      <ScrollView
        style={internalStyles.header_bar}
        // opacity={headerBarOpacity}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <HeaderTitle
          title="Tổng quan chung"
          selected={currentSectionIndex === 0}
          index={0}
          onPress={onScrollToSection}
        />
        <HeaderTitle
          title="Đánh giá & Nhận xét"
          selected={currentSectionIndex === 9}
          index={9}
          onPress={onScrollToSection}
        />
        <HeaderTitle
          title="Hỏi đáp"
          selected={currentSectionIndex === 10}
          index={10}
          onPress={onScrollToSection}
        />
      </ScrollView>
      <Separator height={0.5} />
    </Animated.View>
  );

  const onLayout = (sectionIndex) => {
    switch (sectionIndex) {
      case 9: return onReviewLayout;
      case 10: return onFAQLayout;
      default: return undefined;
    }
  };

  const onContentScroll = ({ nativeEvent }) => {
    const y = _.get(nativeEvent, 'contentOffset.y', 0) + 130;
    let sectionIndex = 0;
    if (y >= reviewLayout.y && y < reviewLayout.y + reviewLayout.height) {
      sectionIndex = 9;
    } else if (y >= faqLayout.y && y < faqLayout.y + faqLayout.height) {
      sectionIndex = 10;
    }
    if (sectionIndex !== currentSectionIndex) {
      setCurrentSectionIndex(sectionIndex);
    }
  };

  const placeholderItem = () => (
    <View style={internalStyles.itemPhd}>
      <View style={internalStyles.infoContainerPhd}>
        <View style={internalStyles.imagePhd}>
          <Image source={ImageSources.PICTURE_PLACEHOLDER} style={internalStyles.imgPhd} resizeMode="contain" />
        </View>
        <Shimmer style={internalStyles.titlePhd} autoRun colorShimmer={Colors.shimmerColor} />
        <Shimmer style={internalStyles.pricePhd} autoRun colorShimmer={Colors.shimmerColor} />
        <Shimmer style={internalStyles.ratePhd} autoRun colorShimmer={Colors.shimmerColor} />
      </View>
      <View style={internalStyles.sectionContainerPhd}>
        <Shimmer style={internalStyles.codePhdLeft} autoRun colorShimmer={Colors.shimmerColor} />
        <Shimmer style={internalStyles.codePhdRight} autoRun colorShimmer={Colors.shimmerColor} />
      </View>
      <View style={internalStyles.sectionContainerPhd}>
        <Shimmer style={internalStyles.selectPhdLeft} autoRun colorShimmer={Colors.shimmerColor} />
        <Shimmer style={internalStyles.selectPhdRight} autoRun colorShimmer={Colors.shimmerColor} />
      </View>
      <View style={internalStyles.sectionContainerPhd}>
        <Shimmer style={internalStyles.codePhdLeft} autoRun colorShimmer={Colors.shimmerColor} />
        <Shimmer style={internalStyles.codePhdRight} autoRun colorShimmer={Colors.shimmerColor} />
      </View>
    </View>
  );

  return (
    <MainContainer hasSafeArea={false} style={CommonStyles.main_container_white}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <Animated.ScrollView
        ref={sectionListRef}
        style={styles.container}
        // onScroll={onScroll}
        // renderItem={renderItem}
        // sections={fakeData}
        // keyExtractor={keyExtractor}
        // ListFooterComponent={renderFooter}
        // renderSectionFooter={renderSeparator}
        // onViewableItemsChanged={onViewableItemsChanged}
        // onScrollToIndexFailed={onScrollToIndexFailed}
        // scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: true,
            listener: onContentScroll
          }
        )}
      >
        {
          fakeData.map((section) => (
            <View
              key={section.index}
              onLayout={onLayout(section.index)}
            >
              {renderSection(section)}
            </View>
          ))
        }
      </Animated.ScrollView>
      {_.isEmpty(currentProductInfo) ? placeholderItem() : null}
      {renderOverlayNavBar()}
      {renderNavBar()}
      <Separator height={0.5} />
      {_.isEmpty(currentProductInfo) ? null : renderFooter()}
      <WAAlert
        show={!_.isEmpty(errors)}
        title="iSalon"
        question={_.get(_.head(errors), 'message')}
        titleFirst
        yes={clearErrors}
        no={false}
        yesTitle="Đóng"
      />
      <AddToCartDialog ref={addToCartDialogRef} products={products} navigation={navigation} />
    </MainContainer>
  );
}

const NAV_HEIGHT = 95 + getStatusBarHeight();
const itemWidth = Layout.window.width < 700 ? Layout.window.width : 700;
const itemHeight = itemWidth;

const internalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav_container: {
    flexDirection: 'column',
    width: Layout.window.width,
    height: NAV_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header_bar: {
    height: 40,
    width: Layout.window.width,
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  header_button_container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 40,
    backgroundColor: 'transparent'
  },
  header_indicator: {
    height: 2,
    backgroundColor: Colors.tintColor,
  },
  header_button: {
    height: 38, paddingLeft: 10, paddingRight: 10,
  },
  header_title: {
    ...Layout.font.normal,
    fontSize: 14,
    color: Colors.itemTextColor,
  },

  itemPhd: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
  },
  infoContainerPhd: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  imagePhd: {
    backgroundColor: 'white',
    height: itemHeight,
  },
  imgPhd: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  },
  titlePhd: {
    height: 30,
    marginBottom: 10,
    width: '100%',
  },
  pricePhd: {
    height: 20,
    marginBottom: 10,
    width: '70%',
  },
  ratePhd: {
    height: 20,
    marginBottom: 10,
    width: '50%',
  },
  sectionContainerPhd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    borderTopWidth: 5,
    borderTopColor: '#ccc',
    paddingHorizontal: 20,
  },
  codePhdLeft: {
    height: 40,
    width: '50%',
  },
  codePhdRight: {
    height: 40,
    width: '40%',
  },
  selectPhdLeft: {
    height: 40,
    width: '60%',
  },
  selectPhdRight: {
    height: 40,
    width: '30%',
  },
});

export default connect(
  (state) => ({
    productDetails: state.shopProduct.productDetails,
    errors: state.shopCart.errors,
    topReview: state.shopReviews.reviewList.slice(0, 10),
    topFAQ: state.shopFAQ,
  }),
  {
    getProductDetail: getProductDetailAction,
    clearProductInfo: clearCurrentProductInfoAction,
    updateSelectedProductVariant: updateSelectedProductVariantAction,
    updateErrors: updateErrorsAction,
    getTopReview: getAllReview,
    getTopFAQ: getAllFAQ,
    addProductToCart: addProductToCartAction,
  }
)(ProductScreen);

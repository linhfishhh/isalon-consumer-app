import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  Text
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import NavigationBar from './NavigationBar';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ProductItem from '../../components/ProductItem';
import SortFilterView, { VIEW_TYPE_LIST } from '../../components/SortFilterView';
import FilterMenu from './FilterMenu';
import MainContainer from '../../components/MainContainer';
import {
  findProducts as findProductsAction,
  clearSearchResult as clearSearchResultAction,
} from '../../redux/search/actions';
import { DEFAULT_PAGE_SIZE, SpotlightTypes, SortType } from '../../constants';

class SearchResultScreen extends React.PureComponent {
  numberOfProductPerColumn = 1;

  productItemWidth = maxScreenWidth - 50;

  productItemHeight = 180;

  productItemStyle = StyleSheet.create({
    product_item_style: {
      width: this.productItemWidth,
      height: this.productItemHeight,
      marginLeft: this.numberOfProductPerColumn > 1 ? 0 : paddingLeft
    },
  });

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      viewType: VIEW_TYPE_LIST,
    };
    this.title = navigation.getParam('title');
    this.category = navigation.getParam('category');
    // flashsale => flashsale id
    // common category => category id
    // new product => category id
    // search => keyword
    // hot sale => unused
    // recommend products => unused
    this.id = navigation.getParam('id');
    if (this.category === SpotlightTypes.category) {
      this.filterOptions = {
        categoryIds: [this.id],
      };
    } else if (this.category === SpotlightTypes.hotSale) {
      this.sortOption = {
        sortType: SortType.HOT_ORDER,
      };
    } else if (this.category === SpotlightTypes.newProduct) {
      this.filterOptions = {
        categoryIds: [this.id],
      };
      this.sortOption = {
        sortType: SortType.NEW_PRODUCT,
      };
    }
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount() {
    const { clearSearchResult } = this.props;
    clearSearchResult();
  }

  setFilterMenuRef = (ref) => {
    if (ref) {
      this.filterMenuRef = ref.getWrappedInstance();
    }
  }

  onChangedViewType = (viewType) => {
    if (viewType === VIEW_TYPE_LIST) {
      this.numberOfProductPerColumn = 1;
      this.productItemWidth = maxScreenWidth - 50;
      this.productItemHeight = 180;
      this.productItemStyle = StyleSheet.create({
        product_item_style: {
          width: maxScreenWidth - 50,
          height: 180,
          marginLeft: paddingLeft
        }
      });
    } else {
      const w = maxScreenWidth / 2 - 25;
      const h = ((w * 4) / 3) + 120;
      this.numberOfProductPerColumn = 2;
      this.productItemWidth = w;
      this.productItemHeight = h;
      this.productItemStyle = StyleSheet.create({
        product_item_style: {
          width: w,
          height: h,
          marginLeft: 0
        }
      });
    }
    this.setState({
      viewType
    });
  }

  keyExtractor = (item) => `${item.productId}`;

  renderProductItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <ProductItem
        product={item}
        style={this.productItemStyle.product_item_style}
        horizontal={this.numberOfProductPerColumn === 1}
        navigation={navigation}
      />
    );
  }

  onOpenFilterMenu = () => {
    this.filterMenuRef.show();
  }

  fetchResultAtPage = (page) => {
    const { findProducts } = this.props;
    let params = {};
    if (this.sortOption) {
      params = _.merge(params, this.sortOption);
    }
    if (this.filterOptions) {
      const {
        categoryIds,
        brandIds,
        productTagIds,
        variantValueIds,
        ...resOptions
      } = this.filterOptions;
      params = _.merge(params, resOptions);
      if (!_.isEmpty(categoryIds)) {
        params = _.merge(params, { categoryIds: categoryIds.join(',') });
      }
      if (!_.isEmpty(brandIds)) {
        params = _.merge(params, { brandIds: brandIds.join(',') });
      }
      if (!_.isEmpty(productTagIds)) {
        params = _.merge(params, { productTagIds: productTagIds.join(',') });
      }
      if (!_.isEmpty(variantValueIds)) {
        params = _.merge(params, { variantValueIds: variantValueIds.join(',') });
      }
    }
    if (this.category === SpotlightTypes.search) {
      params = _.merge(params, { keyword: this.id });
    } else if (this.category === SpotlightTypes.flashSale) {
      params = _.merge(params, { flashSaleId: this.id });
    }
    findProducts(this.category, params, page, DEFAULT_PAGE_SIZE);
  }

  onRefresh = () => {
    this.fetchResultAtPage(0);
  }

  onEndReached = () => {
    const { foundProducts } = this.props;
    const page = _.get(foundProducts, 'pageable.pageNumber');
    const last = _.get(foundProducts, 'last', true);
    if (!last) {
      this.fetchResultAtPage(page + 1);
    }
  }

  onSelectSortOption = (sortOption) => {
    this.sortOption = { ...sortOption };
    this.onRefresh();
  }

  onSelectFilterOptions = (filterOptions) => {
    this.filterOptions = filterOptions ? { ...filterOptions } : {};
    this.onRefresh();
  }

  emptyList = () => {
    const { refreshing } = this.props;
    return (
      refreshing ? null : <Text style={styles.empty_list}>Không có sản phẩm nào</Text>
    );
  }

  render() {
    const { foundProducts, navigation, refreshing } = this.props;
    const { viewType } = this.state;
    return (
      <MainContainer hasNavigationBackground={false} style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          hidden={false}
          translucent
        />
        <NavigationBar navigation={navigation} title={this.title} />
        <View style={styles.container}>
          <SortFilterView
            onChangedViewType={this.onChangedViewType}
            onPressFilter={this.onOpenFilterMenu}
            onSelectSortOption={this.onSelectSortOption}
            initialValue={this.sortOption}
            disabledSort={this.category === SpotlightTypes.targeted}
          />
          <FlatList
            key={viewType}
            style={styles.list}
            data={foundProducts.content}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ListEmptyComponent={this.emptyList}
            showsHorizontalScrollIndicator={false}
            numColumns={this.numberOfProductPerColumn}
            columnWrapperStyle={this.numberOfProductPerColumn > 1 ? styles.column_wrapper : null}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
            maxToRenderPerBatch={4}
            initialNumToRender={1}
          />
          <FilterMenu
            ref={this.setFilterMenuRef}
            onSelectFilterOptions={this.onSelectFilterOptions}
            initialOptions={this.filterOptions}
          />
        </View>
      </MainContainer>
    );
  }
}

const paddingLeft = 25;
const maxScreenWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'column'
  },
  list: {
  },
  empty_list: {
    ...Layout.font.normal,
    fontSize: Layout.largeFontSize,
    color: '#dddddd',
    textAlign: 'center',
    width: Math.min(Layout.window.width - 100, 500),
    marginTop: 50,
    alignSelf: 'center',
  },
  header_container: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10
  },
  section_title: {
  },
  column_wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: (Layout.window.width - maxScreenWidth) / 2 + 25,
  },
  tags: {
    marginLeft: 25, marginRight: 25, marginTop: 8, marginBottom: 15,
  },
  clear_history_button: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.tintColor,
  },
  fake_item: {
    width: maxScreenWidth - 50,
    height: 170,
    marginLeft: paddingLeft
  },
  search_row: {
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25
  },
  search_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor
  }
});

export default connect(
  (state) => ({
    foundProducts: state.shopSearch.foundProducts,
    refreshing: state.shopSearch.findingProducts
  }),
  {
    findProducts: findProductsAction,
    clearSearchResult: clearSearchResultAction,
  }
)(SearchResultScreen);

import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';
import NavigationBar from './NavigationBar';
import SectionTitle from '../../components/SectionTitle';
import ProductItem from '../../components/ProductItem';
import TagsView from '../../components/TagsView';
import TextButton from '../../components/TextButton';
import Separator from '../../components/Separator';
import MainContainer from '../../components/MainContainer';
import styles, { paddingLeft, maxScreenWidth } from './styles';
import {
  getSuggestionKeywords as getSuggestionKeywordsAction,
  getSuggestionProducts as getSuggestionProductsAction,
  getSearchHistory as getSearchHistoryAction,
  clearSearchHistory as clearSearchHistoryAction,
  getHotKeywords as getHotKeywordsAction,
} from '../../redux/search/actions';
import { SpotlightTypes } from '../../constants';

type Props = {};

const numberOfProductPerColumn = 1;
const productItemWidth = maxScreenWidth - 50;
const productItemHeight = 170;

function SearchScreen(props: Props) {
  const {
    navigation,
    suggestionKeywords,
    getSuggestionKeywords,
    suggestionProducts,
    getSuggestionProducts,
    searchHistories,
    hotKeywords,
    getSearchHistory,
    clearSearchHistory,
    getHotKeywords,
  } = props;

  const [productItemStyle] = React.useState(
    StyleSheet.create({
      product_item_style: {
        width: productItemWidth,
        height: productItemHeight,
        marginLeft: numberOfProductPerColumn > 1 ? 0 : paddingLeft
      }
    })
  );

  const [isSearching, setIsSearching] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const searchHistoryTags = React.useMemo(() => (
    searchHistories.map((item) => (
      {
        name: item,
        selected: false,
      }
    ))
  ), [searchHistories]);

  const hotKeywordTags = React.useMemo(() => (
    hotKeywords.map((item) => (
      {
        name: item,
        selected: false,
      }
    ))
  ), [hotKeywords]);

  React.useEffect(() => {
    getSuggestionKeywords(keyword);
  }, [keyword]);

  React.useEffect(() => {
    getSuggestionProducts(0);
  }, []);

  const onFocusSearchBox = React.useCallback(() => {
    setIsSearching(true);
  }, []);

  const onBlurSearchBox = React.useCallback(() => {
    setIsSearching(false);
  }, []);

  const onSearch = React.useCallback((text) => {
    setKeyword(text);
  }, []);

  const onSubmitSearch = React.useCallback(({ nativeEvent }) => {
    const k = _.get(nativeEvent, 'text');
    if (k && k.length > 0) {
      navigation.navigate('SearchResultScreen', {
        title: k,
        category: SpotlightTypes.search,
        id: k
      });
    }
    setIsSearching(false);
  }, []);

  const keyExtractor = (item, index) => item + index;

  const renderProductItem = ({ item }) => (
    <ProductItem
      product={item}
      style={productItemStyle.product_item_style}
      horizontal={numberOfProductPerColumn === 1}
      navigation={navigation}
    />
  );

  const renderSearchSuggestItem = ({ item }) => {
    const onClick = () => {
      onSubmitSearch({ nativeEvent: { text: item } });
    };
    return (
      <TouchableOpacity style={styles.search_row} onPress={onClick}>
        <Text style={styles.search_text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const onEndReached = () => {
    const page = _.get(suggestionProducts, 'pageable.pageNumber');
    const totalPages = _.get(suggestionProducts, 'totalPages');
    if (page + 1 === totalPages) {
      getSuggestionProducts(page + 1);
    }
  };

  const onSelectTag = React.useCallback((tag) => {
    navigation.navigate('SearchResultScreen', {
      title: tag.name,
      category: SpotlightTypes.search,
      id: tag.name
    });
  });

  const onScreenFocus = React.useCallback(() => {
    getSearchHistory();
    getHotKeywords();
  }, []);

  const header = () => (
    <View style={styles.header_container}>
      <NavigationEvents
        onWillFocus={onScreenFocus}
      />
      {!_.isEmpty(searchHistoryTags) ? (
        <View>
          <SectionTitle title="Lịch sử tìm kiếm">
            <TextButton title="Xóa" titleStyle={styles.clear_history_button} onPress={clearSearchHistory} />
          </SectionTitle>
          <TagsView tags={searchHistoryTags} style={styles.tags} onSelectTag={onSelectTag} />
        </View>
      ) : null}
      {!_.isEmpty(hotKeywordTags) ? (
        <View>
          <SectionTitle title="Từ khóa hot" />
          <TagsView tags={hotKeywordTags} style={styles.tags} onSelectTag={onSelectTag} />
          <Separator />
        </View>
      ) : null}
      {!_.isEmpty(_.get(suggestionProducts, 'content')) && <SectionTitle title="Đề xuất cho bạn" />}
    </View>
  );

  return (
    <MainContainer hasNavigationBackground={false} style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        navigation={navigation}
        onBlur={onBlurSearchBox}
        onFocus={onFocusSearchBox}
        onSubmitSearch={onSubmitSearch}
        textDidChange={onSearch}
      />
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={_.get(suggestionProducts, 'content') || []}
          keyExtractor={keyExtractor}
          renderItem={renderProductItem}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={header}
          numColumns={numberOfProductPerColumn}
          columnWrapperStyle={
            numberOfProductPerColumn > 1 ? styles.column_wrapper : null
          }
          onEndReached={onEndReached}
          keyboardShouldPersistTaps="always"
        />
        {isSearching && keyword.length > 0 ? (
          <FlatList
            style={styles.list}
            data={suggestionKeywords}
            keyExtractor={keyExtractor}
            renderItem={renderSearchSuggestItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          />
        ) : null}
      </View>
    </MainContainer>
  );
}

export default connect(
  (state) => ({
    suggestionKeywords: state.shopSearch.suggestionKeywords,
    suggestionProducts: state.shopSearch.suggestionProducts,
    searchHistories: state.shopSearch.searchHistories,
    hotKeywords: state.shopSearch.hotKeywords,
  }),
  {
    getSuggestionKeywords: getSuggestionKeywordsAction,
    getSuggestionProducts: getSuggestionProductsAction,
    getSearchHistory: getSearchHistoryAction,
    clearSearchHistory: clearSearchHistoryAction,
    getHotKeywords: getHotKeywordsAction,
  }
)(SearchScreen);

import _ from 'lodash';
import {
  createSideEffectAction, createSingleAction,
} from '../../utils/reduxHelper';
import { shopService, searchService } from '../../services';

import {
  GET_SUGGESTION_KEYWORDS,
  GET_SUGGESTION_PRODUCTS,
  GET_SEARCH_HISTORY_SUCCESS,
  GET_HOT_KEYWORDS_SUCCESS,
  FIND_PRODUCTS_FOR_CATEGORY,
  CLEAR_SEARCH_RESULT,
  FETCH_FILTER_OPTIONS,
  CLEAR_SEARCH_HISTORY,
} from './types';
import { SpotlightTypes, DEFAULT_PAGE_SIZE } from '../../constants';

const [
  getSuggestionKeywordsBegin,
  getSuggestionKeywordsSuccess,
  getSuggestionKeywordsFail,
  getSuggestionKeywordsEnd
] = createSideEffectAction(GET_SUGGESTION_KEYWORDS);

const [
  getSuggestionProductsBegin,
  getSuggestionProductsSuccess,
  getSuggestionProductsFail,
  getSuggestionProductsEnd
] = createSideEffectAction(GET_SUGGESTION_PRODUCTS);

const [
  clearSearchHistoryBegin,
  clearSearchHistorySuccess,
  clearSearchHistoryFail,
  clearSearchHistoryEnd
] = createSideEffectAction(CLEAR_SEARCH_HISTORY);

const getSearchHistorySuccess = createSingleAction(GET_SEARCH_HISTORY_SUCCESS);
const getHotKeywordsSuccess = createSingleAction(GET_HOT_KEYWORDS_SUCCESS);

const [
  findProductsBegin,
  findProductsSuccess,
  findProductsFail,
  findProductsEnd,
] = createSideEffectAction(FIND_PRODUCTS_FOR_CATEGORY);
const clearSearchResultSuccess = createSingleAction(CLEAR_SEARCH_RESULT);

const [
  fetchFilterOptionsBegin,
  fetchFilterOptionsSuccess,
  fetchFilterOptionsFail,
  fetchFilterOptionsEnd
] = createSideEffectAction(FETCH_FILTER_OPTIONS);

export function getSuggestionKeywords(keyword) {
  return async (dispatch) => {
    try {
      dispatch(getSuggestionKeywordsBegin());
      if (keyword && keyword.length > 0) {
        const result = await searchService.getSuggestionKeywords(keyword);
        dispatch(getSuggestionKeywordsSuccess(_.get(result, 'data.data')));
      } else {
        dispatch(getSuggestionKeywordsSuccess([]));
      }
    } catch (e) {
      dispatch(getSuggestionKeywordsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getSuggestionKeywordsEnd());
    }
  };
}

export function getSuggestionProducts(page, limit = DEFAULT_PAGE_SIZE) {
  return async (dispatch) => {
    try {
      dispatch(getSuggestionProductsBegin());
      const result = await searchService.getSuggestionProducts({ page, limit });
      dispatch(getSuggestionProductsSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getSuggestionProductsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getSuggestionProductsEnd());
    }
  };
}

export function getSearchHistory() {
  return async (dispatch) => {
    try {
      const result = await searchService.getSearchHistory();
      dispatch(getSearchHistorySuccess(_.get(result, 'data.data')));
    } catch (e) {
      // TODO
    }
  };
}

export function getHotKeywords() {
  return async (dispatch) => {
    try {
      const result = await searchService.getHotKeywords();
      dispatch(getHotKeywordsSuccess(_.get(result, 'data.data')));
    } catch (e) {
      // TODO
    }
  };
}

// when search, id will be keyword
export function findProducts(category, params, page, limit = DEFAULT_PAGE_SIZE) {
  return async (dispatch) => {
    try {
      dispatch(findProductsBegin());
      let result;
      if (category === SpotlightTypes.flashSale) {
        result = await shopService.getFlashSaleProducts({ ...params, page, limit });
      } else if (category === SpotlightTypes.targeted) {
        result = await searchService.getSuggestionProducts({ ...params, page, limit });
      } else {
        result = await shopService.findAllProducts({ ...params, page, limit });
      }
      const payload = _.get(result, 'data.data');
      dispatch(findProductsSuccess(payload));
    } catch (e) {
      dispatch(findProductsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(findProductsEnd());
    }
  };
}

export function clearSearchResult() {
  return async (dispatch) => dispatch(clearSearchResultSuccess());
}

export function fetchFilterOptions() {
  return async (dispatch) => {
    try {
      dispatch(fetchFilterOptionsBegin());
      const result = await searchService.fetchFilterOptions();
      const payload = _.get(result, 'data.data');
      dispatch(fetchFilterOptionsSuccess(payload));
    } catch (e) {
      dispatch(fetchFilterOptionsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(fetchFilterOptionsEnd());
    }
  };
}

export function clearSearchHistory() {
  return async (dispatch) => {
    try {
      dispatch(clearSearchHistoryBegin());
      const result = await searchService.clearSearchHistory();
      const payload = _.get(result, 'data.data');
      dispatch(clearSearchHistorySuccess(payload));
    } catch (e) {
      dispatch(clearSearchHistoryFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(clearSearchHistoryEnd());
    }
  };
}

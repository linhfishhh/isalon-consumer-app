/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_SUGGESTION_KEYWORDS_SUCCESS,
  GET_SUGGESTION_PRODUCTS_BEGIN,
  GET_SUGGESTION_PRODUCTS_SUCCESS,
  GET_SUGGESTION_PRODUCTS_END,
  GET_SEARCH_HISTORY_SUCCESS,
  GET_HOT_KEYWORDS_SUCCESS,
  FIND_PRODUCTS_FOR_CATEGORY_BEGIN,
  FIND_PRODUCTS_FOR_CATEGORY_SUCCESS,
  FIND_PRODUCTS_FOR_CATEGORY_END,
  CLEAR_SEARCH_RESULT,
  FETCH_FILTER_OPTIONS_SUCCESS,
  CLEAR_SEARCH_HISTORY_SUCCESS
} from './types';

export const initialState = {
  suggestionKeywords: [],
  suggestionProducts: {
    content: [],
    pageable: {
      pageNumber: 0,
    },
    totalPages: 1,
    last: false,
  },
  fetchingKeywords: false,
  fetchingProducts: false,
  searchHistories: [],
  hotKeywords: [],
  foundProducts: {
    content: [],
    pageable: {
      pageNumber: 0,
    },
    totalPages: 1,
    last: false,
  },
  findingProducts: false,
  filterOptions: [],
  errors: undefined,
};

const searchSuggestionReducer = {
  [GET_SUGGESTION_KEYWORDS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const keywords = _.get(action, 'payload', []);
    draft.suggestionKeywords = keywords;
    draft.fetchingKeywords = false;
  }),
  [GET_SEARCH_HISTORY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const keywords = _.get(action, 'payload', []);
    draft.searchHistories = keywords;
  }),
  [CLEAR_SEARCH_HISTORY_SUCCESS]: (state) => produce(state, (draft) => {
    draft.searchHistories = [];
  }),
  [GET_HOT_KEYWORDS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const keywords = _.get(action, 'payload', []);
    draft.hotKeywords = keywords;
  }),
};

const productSuggestionReducer = {
  [GET_SUGGESTION_PRODUCTS_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetchingProducts = true;
  }),
  [GET_SUGGESTION_PRODUCTS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', []);
    const page = _.get(payload, 'pageable.pageNumber', 0);
    const currentPage = _.get(draft.suggestionProducts, 'pageable.pageNumber', 0);
    if (page === 0) {
      draft.suggestionProducts = payload;
    } else if (page !== currentPage) {
      let content = _.get(payload, 'content', []);
      content = _.concat(_.get(draft.suggestionProducts, 'content'), content);
      payload.content = content;
      draft.suggestionProducts = payload;
    }
    draft.fetchingProducts = false;
  }),
  [GET_SUGGESTION_PRODUCTS_END]: (state) => produce(state, (draft) => {
    draft.fetchingProducts = false;
  }),
};

const findProductReducer = {
  [FIND_PRODUCTS_FOR_CATEGORY_BEGIN]: (state) => produce(state, (draft) => {
    draft.findingProducts = true;
  }),
  [FIND_PRODUCTS_FOR_CATEGORY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', []);
    const page = _.get(payload, 'pageable.pageNumber', 0);
    const currentPage = _.get(draft.foundProducts, 'pageable.pageNumber', 0);
    if (page === 0) {
      draft.foundProducts = payload;
    } else if (page !== currentPage) {
      let content = _.get(payload, 'content', []);
      content = _.concat(_.get(draft.foundProducts, 'content'), content);
      // content = _.unionBy(content, (p) => p.productId);
      payload.content = content;
      draft.foundProducts = payload;
    }
    draft.findingProducts = false;
  }),
  [FIND_PRODUCTS_FOR_CATEGORY_END]: (state) => produce(state, (draft) => {
    draft.findingProducts = false;
  }),
  [CLEAR_SEARCH_RESULT]: (state) => produce(state, (draft) => {
    draft.foundProducts = {
      content: [],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      last: false,
    };
    draft.findingProducts = false;
  }),
};

const filterOptionsReducer = {
  [FETCH_FILTER_OPTIONS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const options = _.get(action, 'payload', []);
    // if (options.length >= 2) {
    //   options.splice(2, 0, { filterName: 'price' });
    // } else {
    //   options.push({ filterName: 'price' });
    // }
    // if (options.length >= 3) {
    //   options.splice(3, 0, { filterName: 'rate' });
    // } else {
    //   options.push({ filterName: 'rate' });
    // }
    draft.filterOptions = options;
  }),
};

export default handleActions(
  {
    ...searchSuggestionReducer,
    ...productSuggestionReducer,
    ...findProductReducer,
    ...filterOptionsReducer,
  },
  initialState,
);

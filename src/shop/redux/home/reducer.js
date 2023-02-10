/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_SPOTLIGHT_ITEMS_SUCCESS,
  GET_SPOTLIGHT_ITEMS_END,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FOR_CATEGORY_SUCCESS,
  GET_SPOTLIGHT_ITEMS_BEGIN,
  GET_PRODUCTS_FOR_CATEGORY_BEGIN,
  GET_PRODUCTS_FOR_CATEGORY_END,
  GET_CURRENT_FLASH_SALE_SUCCESS,
  // GET_FLASH_SALE_PRODUCTS_SUCCESS,
} from './types';

export const initialState = {
  refreshing: false,
  spotlightItems: [],
  allProducts: {
    contents: [],
    pageInfo: {
      page: 0,
      last: false,
    }
  },
  categories: {},
  currentFlashSale: {},
  errors: undefined,
};

const spotlightItemsReducer = {
  [GET_SPOTLIGHT_ITEMS_BEGIN]: (state) => produce(state, (draft) => {
    draft.refreshing = true;
  }),
  [GET_SPOTLIGHT_ITEMS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const spotlightItems = _.get(action, 'payload', '');
    draft.spotlightItems = spotlightItems;
    draft.refreshing = false;
  }),
  [GET_SPOTLIGHT_ITEMS_END]: (state) => produce(state, (draft) => {
    draft.refreshing = false;
  }),
};

const allProductsReducer = {
  [GET_ALL_PRODUCTS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', '');
    const page = _.get(payload, 'pageable.pageNumber', 0);
    const currentPage = _.get(draft.allProducts, 'pageInfo.page', 0);
    if (page === 0) {
      draft.allProducts.contents = [...payload.content];
    } else if (page !== currentPage) {
      draft.allProducts.contents = [...draft.allProducts.contents, ...payload.content];
    }
    draft.allProducts.pageInfo = { page, last: payload.last };
  }),
};

const categoryProductsReducer = {
  [GET_PRODUCTS_FOR_CATEGORY_BEGIN]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', '');
    if (draft.categories[payload.key]) {
      draft.categories[payload.key].refreshing = true;
    }
  }),
  [GET_PRODUCTS_FOR_CATEGORY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', '');
    const page = _.get(payload, 'data.pageable.pageNumber');
    const last = _.get(payload, 'data.last');
    const nextContent = _.get(payload, 'data.content', []);
    if (draft.categories[payload.key] === undefined) {
      draft.categories[payload.key] = {
        refreshing: true,
        contents: [],
        pageInfo: {
          page: 0,
          last: false,
        }
      };
    }
    const result = draft.categories[payload.key];
    if (page === 0) {
      result.contents = nextContent;
    } else if (page !== _.get(result, 'pageInfo.page', 0)) {
      const contents = _.concat(result.contents, nextContent);
      result.contents = contents;
    }
    result.pageInfo = { page, last };
    result.refreshing = false;
  }),
  [GET_PRODUCTS_FOR_CATEGORY_END]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', '');
    if (draft.categories[payload.key]) {
      draft.categories[payload.key].refreshing = false;
    }
  }),
};

const flashSaleReducer = {
  [GET_CURRENT_FLASH_SALE_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', {});
    draft.currentFlashSale = payload;
  }),
  // [GET_FLASH_SALE_PRODUCTS_SUCCESS]: (state, action) => produce(state, (draft) => {
  //   const payload = _.get(action, 'payload', '');
  //   const page = _.get(payload, 'data.pageable.pageNumber');
  //   const last = _.get(payload, 'data.last');
  //   if (draft.categories[payload.categoryId] === undefined) {
  //     draft.categories[payload.categoryId] = {
  //       refreshing: true,
  //       contents: [],
  //       pageInfo: {
  //         page: 0,
  //         last: false,
  //       }
  //     };
  //   }
  //   if (page === 0) {
  //     draft.categories[payload.categoryId].contents = [];
  //   }
  //   const contents = _.merge(draft.categories[payload.categoryId].contents,
  // _.get(payload, 'data.content'));
  //   draft.categories[payload.categoryId].contents = contents;
  //   draft.categories[payload.categoryId].pageInfo = { page, last };
  //   draft.categories[payload.categoryId].refreshing = false;
  // }),
};

export default handleActions(
  {
    ...spotlightItemsReducer,
    ...allProductsReducer,
    ...categoryProductsReducer,
    ...flashSaleReducer,
  },
  initialState,
);

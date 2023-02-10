/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  // GET_PRODUCT_DETAIL_BEGIN,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAIL,
  GET_PRODUCT_VARIANTS_SUCCESS,
  GET_PRODUCT_VARIANT_VALUES_SUCCESS,
  UPDATE_SELECTED_PRODUCT_VARIANT,
  GET_ALL_PRODUCT_VARIANTS_BEGIN,
  GET_ALL_PRODUCT_VARIANTS_SUCCESS,
  UPDATE_SELECTED_PRODUCT_QUANTITY,
  UPDATE_REVIEWABLE,
  UPDATE_PRODUCT_FAVORITE_SUCCESS,
  CLEAR_PRODUCT_INFO_SUCCESS,
  FETCH_FAVORITED_PRODUCTS_SUCCESS,
  FETCH_FAVORITED_PRODUCTS_BEGIN,
  FETCH_FAVORITED_PRODUCTS_END,
} from './types';

export const initialState = {
  error: {},
  productDetails: {
    productId: {
      detail: undefined,
      variantValues: [],
      variants: [],
      allVariants: {
        content: [],
        totalElements: 0,
      },
      selectedVariant: undefined,
      quantity: 1,
      screenCount: 0,
    }
  },
  allFavoritedProducts: {
    content: [],
    pageable: {
      pageNumber: 0,
    },
    totalPages: 1,
    last: false,
  },
  fetchingFavoritedProducts: false,
};

// sample
/*

*/

const productDetailReducer = {
  // [GET_PRODUCT_DETAIL_BEGIN]: (state, action) => produce(state, (draft) => {
  //   const productId = _.get(action, 'payload.productId');
  //   const productDetails = { ...draft.productDetails };
  //   _.set(productDetails, `${[productId]}`, {});
  //   draft.productDetails = productDetails;
  // }),
  [GET_PRODUCT_DETAIL_SUCCESS]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const product = _.get(action, 'payload.data');

    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.detail`, product);
    const currentScreenCount = _.get(productDetails, `${productId}.screenCount`, 0);
    _.set(productDetails, `${[productId]}.screenCount`, currentScreenCount + 1);

    // draft.productDetails = productDetails;
    draft.error = {};
  }),
  [GET_PRODUCT_DETAIL_FAIL]: (state, action) => produce(state, (draft) => {
    draft.error = _.get(action, 'payload', {});
  }),
  [UPDATE_REVIEWABLE]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const reviewable = _.get(action, 'payload.data', false);
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.detail.isReviewable`, reviewable);
    // draft.productDetails = productDetails;
  }),
  [CLEAR_PRODUCT_INFO_SUCCESS]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const { productDetails } = draft;
    const currentScreenCount = _.get(productDetails, `${productId}.screenCount`, 0);
    if (currentScreenCount <= 1) {
      _.set(productDetails, `${[productId]}`, {});
    } else {
      _.set(productDetails, `${[productId]}.screenCount`, currentScreenCount - 1);
    }
    // draft.productDetails = productDetails;
  }),
};

const productVariantsReducer = {
  [GET_PRODUCT_VARIANTS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const variants = _.get(action, 'payload.data');
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.variants`, variants);
    if (!_.isEmpty(variants)) {
      _.set(productDetails, `${[productId]}.selectedVariant`, variants[0]);
    }
    draft.error = {};
  }),
  [GET_ALL_PRODUCT_VARIANTS_BEGIN]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.allVariants`, {
      content: [],
      totalElements: 0,
    });
    // draft.productDetails = productDetails;
  }),
  [GET_ALL_PRODUCT_VARIANTS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const data = _.get(action, 'payload.data', {});
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.allVariants`, data);
    // draft.productDetails = productDetails;
  }),
};

const productVariantValuesReducer = {
  [GET_PRODUCT_VARIANT_VALUES_SUCCESS]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const data = _.get(action, 'payload.data', []);
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.variantValues`, data);
    // draft.productDetails = productDetails;
    draft.error = {};
  }),
  [UPDATE_SELECTED_PRODUCT_VARIANT]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const data = _.get(action, 'payload.data');
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.selectedVariant`, data);
    // draft.productDetails = productDetails;
    draft.error = {};
  }),
  [UPDATE_SELECTED_PRODUCT_QUANTITY]: (state, action) => produce(state, (draft) => {
    const productId = _.get(action, 'payload.productId');
    const data = _.get(action, 'payload.data', 1);
    const { productDetails } = draft;
    _.set(productDetails, `${[productId]}.quantity`, data);
    // draft.productDetails = productDetails;
  }),
};

const favoriteReducer = {
  [FETCH_FAVORITED_PRODUCTS_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetchingFavoritedProducts = true;
  }),
  [FETCH_FAVORITED_PRODUCTS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', {});
    const page = _.get(payload, 'pageable.pageNumber', 0);
    const currentPage = _.get(draft.allFavoritedProducts, 'pageable.pageNumber', 0);
    if (page === 0) {
      draft.allFavoritedProducts = payload;
    } else if (page !== currentPage) {
      let content = _.get(payload, 'content', []);
      content = _.concat(_.get(draft.allFavoritedProducts, 'content'), content);
      payload.content = content;
      draft.allFavoritedProducts = payload;
    }
    draft.fetchingFavoritedProducts = false;
  }),
  [FETCH_FAVORITED_PRODUCTS_END]: (state) => produce(state, (draft) => {
    draft.fetchingFavoritedProducts = false;
  }),
  [UPDATE_PRODUCT_FAVORITE_SUCCESS]: (state, action) => produce(state, (draft) => {
    const payload = _.get(action, 'payload', {});
    const productId = _.get(payload, 'productId', -1);
    const isFavorite = _.get(payload, 'isFavorite', false);
    const { productDetails } = draft;
    _.set(productDetails, `${productId}.detail.isFavorite`, isFavorite);
    // draft.productDetails = productDetails;
    if (!payload.isFavorite) {
      const favorites = _.get(draft.allFavoritedProducts, 'content');
      _.remove(favorites, (p) => p.productId === payload.productId);
    }
  }),
};

export default handleActions(
  {
    ...productDetailReducer,
    ...productVariantsReducer,
    ...productVariantValuesReducer,
    ...favoriteReducer,
  },
  initialState,
);

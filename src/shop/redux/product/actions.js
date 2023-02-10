import _ from 'lodash';
import { createSideEffectAction, createSingleAction } from '../../utils/reduxHelper';
import { shopService, reviewService } from '../../services';
import * as alert from '../../utils/alert';

import {
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_VARIANTS,
  GET_PRODUCT_VARIANT_VALUES,
  UPDATE_SELECTED_PRODUCT_VARIANT,
  UPDATE_SELECTED_PRODUCT_QUANTITY,
  GET_ALL_PRODUCT_VARIANTS,
  UPDATE_REVIEWABLE,
  UPDATE_PRODUCT_FAVORITE,
  CLEAR_PRODUCT_INFO,
  FETCH_FAVORITED_PRODUCTS,
} from './types';
import { DEFAULT_PAGE_SIZE } from '../../constants';

export const [
  getProductDetailBegin,
  getProductDetailSuccess,
  getProductDetailFail,
  getProductDetailEnd,
] = createSideEffectAction(GET_PRODUCT_DETAIL);

export const [
  getProductVariantsBegin,
  getProductVariantsSuccess,
  getProductVariantsFail,
  getProductVariantsEnd,
] = createSideEffectAction(GET_PRODUCT_VARIANTS);

export const [
  getProductVariantValuesBegin,
  getProductVariantValuesSuccess,
  getProductVariantValuesFail,
  getProductVariantValuesEnd,
] = createSideEffectAction(GET_PRODUCT_VARIANT_VALUES);

export const updateSelectedProductVariantAction = createSingleAction(
  UPDATE_SELECTED_PRODUCT_VARIANT
);
export const updateSelectedProductQuantityAction = createSingleAction(
  UPDATE_SELECTED_PRODUCT_QUANTITY
);

export const [
  getAllProductVariantsBegin,
  getAllProductVariantsSuccess,
  getAllProductVariantsFail,
  getAllProductVariantsEnd
] = createSideEffectAction(GET_ALL_PRODUCT_VARIANTS);

export const updateReviewable = createSingleAction(
  UPDATE_REVIEWABLE
);

export const [
  updateProductFavoriteBegin,
  updateProductFavoriteSuccess,
  updateProductFavoriteFail,
  updateProductFavoriteEnd,
] = createSideEffectAction(UPDATE_PRODUCT_FAVORITE);

export const [
  clearProductInfoBegin,
  clearProductInfoSuccess,
  clearProductInfoFail,
  clearProductInfoEnd
] = createSideEffectAction(CLEAR_PRODUCT_INFO);

export const [
  fetchFavoritedProductsBegin,
  fetchFavoritedProductsSuccess,
  fetchFavoritedProductsFail,
  fetchFavoritedProductsEnd
] = createSideEffectAction(FETCH_FAVORITED_PRODUCTS);

export function getProductDetail(productId) {
  return async (dispatch) => {
    try {
      dispatch(getProductDetailBegin({ productId }));
      const result = await shopService.getProductDetail(productId);
      dispatch(getProductDetailSuccess({ productId, data: _.get(result, 'data.data') }));
    } catch (e) {
      dispatch(getProductDetailFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      alert.handleServerError(e);
    } finally {
      dispatch(getProductDetailEnd());
    }
  };
}

export function getProductVariants(productId, valueIds, callback) {
  return async (dispatch) => {
    try {
      dispatch(getProductVariantsBegin({ productId }));
      const result = await shopService.getProductVariants(productId, valueIds);
      const data = {
        productId,
        data: _.get(result, 'data.data', []),
      };
      if (callback) {
        callback(data);
      }
      dispatch(getProductVariantsSuccess(data));
    } catch (e) {
      dispatch(getProductVariantsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getProductVariantsEnd());
    }
  };
}

export function getProductVariantValues(productId) {
  return async (dispatch) => {
    try {
      dispatch(getProductVariantValuesBegin({ productId }));
      const result = await shopService.getProductVariantValues(productId);
      dispatch(getProductVariantValuesSuccess({ productId, data: _.get(result, 'data.data') }));
    } catch (e) {
      dispatch(getProductVariantValuesFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getProductVariantValuesEnd());
    }
  };
}

export function updateSelectedProductVariant(productId, variant) {
  return async (dispatch) => {
    dispatch(updateSelectedProductVariantAction({ productId, data: variant }));
  };
}

export function updateSelectedProductQuantity(productId, quantity) {
  return async (dispatch) => {
    dispatch(updateSelectedProductQuantityAction({ productId, data: quantity }));
  };
}

export function getAllProductVariants(productId) {
  return async (dispatch) => {
    try {
      dispatch(getAllProductVariantsBegin({ productId }));
      const result = await shopService.getAllProductVariants(productId);
      dispatch(getAllProductVariantsSuccess({
        productId,
        data: _.get(result, 'data.data')
      }));
    } catch (e) {
      // TODO
    }
  };
}

export function clearProductInfo(productId) {
  return async (dispatch) => {
    dispatch(clearProductInfoSuccess({ productId }));
  };
}

export function updateProductFavorite(productId, favorited) {
  return async (dispatch) => {
    try {
      dispatch(updateProductFavoriteBegin());
      const result = await reviewService.updateFavorite(productId, favorited);
      dispatch(updateProductFavoriteSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(updateProductFavoriteFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(updateProductFavoriteEnd());
    }
  };
}

export function fetchFavoritedProducts(page, limit = DEFAULT_PAGE_SIZE) {
  return async (dispatch) => {
    try {
      dispatch(fetchFavoritedProductsBegin());
      const result = await reviewService.fetchAllFavorited(page, limit);
      dispatch(fetchFavoritedProductsSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(fetchFavoritedProductsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(fetchFavoritedProductsEnd());
    }
  };
}

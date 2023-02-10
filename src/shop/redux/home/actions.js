// import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { createSideEffectAction } from '../../utils/reduxHelper';
import { shopService, searchService } from '../../services';
import * as alert from '../../utils/alert';
import { SpotlightTypes, SortType } from '../../constants';

import {
  GET_SPOTLIGHT_ITEMS,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_FOR_CATEGORY,
  GET_CURRENT_FLASH_SALE,
  GET_FLASH_SALE_PRODUCTS,
} from './types';

export const [
  getSpotlightItemsBegin,
  getSpotlightItemsSuccess,
  getSpotlightItemsFail,
  getSpotlightItemsEnd,
] = createSideEffectAction(GET_SPOTLIGHT_ITEMS);

export const [
  getAllProductsBegin,
  getAllProductsSuccess,
  getAllProductsFail,
  getAllProductsEnd,
] = createSideEffectAction(GET_ALL_PRODUCTS);

export const [
  getProductsForCategoryBegin,
  getProductsForCategorySuccess,
  getProductsForCategoryFail,
  getProductsForCategoryEnd,
] = createSideEffectAction(GET_PRODUCTS_FOR_CATEGORY);

export const [
  getCurrentFlashSaleBegin,
  getCurrentFlashSaleSuccess,
  getCurrentFlashSaleFail,
  getCurrentFlashSaleEnd,
] = createSideEffectAction(GET_CURRENT_FLASH_SALE);

export const [
  getFlashSaleProductsBegin,
  getFlashSaleProductsSuccess,
  getFlashSaleProductsFail,
  getFlashSaleProductsEnd
] = createSideEffectAction(GET_FLASH_SALE_PRODUCTS);

export function getSpotlightItems() {
  return async (dispatch) => {
    try {
      dispatch(getSpotlightItemsBegin());
      // const cachedSpotlightItems = await AsyncStorage.getItem('@isalon:shop:spotlightItems');
      // if (cachedSpotlightItems) {
      //   dispatch(getSpotlightItemsSuccess(JSON.parse(cachedSpotlightItems)));
      // }
      const result = await shopService.getSpotlightItems();
      // await AsyncStorage.setItem('@isalon:shop:spotlightItems',
      // JSON.stringify(result.data.data));
      dispatch(getSpotlightItemsSuccess(result.data.data));
    } catch (e) {
      dispatch(getSpotlightItemsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      alert.handleServerError(e);
    } finally {
      dispatch(getSpotlightItemsEnd());
    }
  };
}

export function getAllProducts(page, limit) {
  return async (dispatch) => {
    try {
      dispatch(getAllProductsBegin());
      const result = await shopService.getAllProducts(page, limit);
      dispatch(getAllProductsSuccess(result.data.data));
    } catch (e) {
      dispatch(getAllProductsFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getAllProductsEnd());
    }
  };
}

export function getCurrentFlashSaleInfo() {
  return async (dispatch) => {
    try {
      dispatch(getCurrentFlashSaleBegin());
      const result = await shopService.getCurrentFlashSaleInfo();
      dispatch(getCurrentFlashSaleSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getCurrentFlashSaleFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getCurrentFlashSaleEnd());
    }
  };
}

export function getCategoryProducts(category, params, page, limit) {
  // find category id from params
  const categoryIds = _.get(params, 'categoryIds');
  const id = categoryIds;
  const key = id ? `${category}_${id}` : category;
  return async (dispatch) => {
    try {
      dispatch(getProductsForCategoryBegin({ key }));
      let result;
      if (category === SpotlightTypes.flashSale) {
        result = await shopService.getFlashSaleProducts({ flashSaleId: id, page, limit });
      } else if (category === SpotlightTypes.targeted) {
        result = await searchService.getSuggestionProducts({ page, limit });
      } else {
        result = await shopService.findAllProducts({ ...params, page, limit });
      }
      const payload = { key, data: _.get(result, 'data.data') };
      dispatch(getProductsForCategorySuccess(payload));
    } catch (e) {
      dispatch(getProductsForCategoryFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getProductsForCategoryEnd({ key }));
    }
  };
}

import _ from 'lodash';
import { createSideEffectAction, createSingleAction } from '../../utils/reduxHelper';
import { shopService } from '../../services';
import * as alert from '../../utils/alert';

import {
  GET_CART,
  ADD_PRODUCT_TO_CART,
  GET_GIFTCODES,
  UPDATE_ERRORS,
  UPDATE_CART_ITEM,
  DELETE_CART_ITEM,
  GET_CART_QUANTITY_SUCCESS,
  GET_CART_QUANTITY_FAIL,
} from './types';
import { ErrorTypes } from '../../constants';

const [
  getCartBegin,
  getCartSuccess,
  getCartFail,
  getCartEnd,
] = createSideEffectAction(GET_CART);

const [
  getPublicGiftCodesBegin,
  getPublicGiftCodesSuccess,
  getPublicGiftCodesFail,
  getPublicGiftCodesEnd,
] = createSideEffectAction(GET_GIFTCODES);

const getCartQuantitySuccess = createSingleAction(GET_CART_QUANTITY_SUCCESS);
const getCartQuantityFail = createSingleAction(GET_CART_QUANTITY_FAIL);

const [
  addProductToCartBegin,
  // eslint-disable-next-line no-unused-vars
  addProductToCartSuccess,
  addProductToCartFail,
  addProductToCartEnd,
] = createSideEffectAction(ADD_PRODUCT_TO_CART);

const updateErrorsAction = createSingleAction(UPDATE_ERRORS);

const [
  updateCartItemBegin,
  // eslint-disable-next-line no-unused-vars
  updateCartItemSuccess,
  updateCartItemFail,
  updateCartItemEnd
] = createSideEffectAction(UPDATE_CART_ITEM);

const [
  deleteCartItemBegin,
  // eslint-disable-next-line no-unused-vars
  deleteCartItemSuccess,
  deleteCartItemFail,
  deleteCartItemEnd
] = createSideEffectAction(DELETE_CART_ITEM);

export function updateErrors(errors) {
  return (dispatch) => {
    dispatch(updateErrorsAction(errors));
  };
}

export function getCart() {
  return async (dispatch) => {
    try {
      dispatch(getCartBegin());
      const result = await shopService.getCart();
      dispatch(getCartSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getCartFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(getCartEnd());
    }
  };
}

export function getCartQuantity() {
  return async (dispatch) => {
    try {
      const result = await shopService.getCartQuantity();
      dispatch(getCartQuantitySuccess(_.get(result, 'data.data.quantity')));
    } catch (e) {
      dispatch(getCartQuantityFail());
    }
  };
}

export function addProductToCart(payload, callback) {
  return async (dispatch) => {
    try {
      dispatch(addProductToCartBegin());
      const result = await shopService.addProductsToCart(payload);
      dispatch(getCartSuccess(_.get(result, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(addProductToCartFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(addProductToCartEnd());
    }
  };
}

export function removeProductFromCart(payload, callback) {
  return async (dispatch) => {
    try {
      dispatch(addProductToCartBegin());
      const result = await shopService.removeProductFromCart(payload);
      dispatch(getCartSuccess(_.get(result, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(addProductToCartFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(addProductToCartEnd());
    }
  };
}

export function getAllPublicGiftCodes() {
  return async (dispatch) => {
    try {
      dispatch(getPublicGiftCodesBegin());
      const result = await shopService.getPublicGiftCodes();
      dispatch(getPublicGiftCodesSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getPublicGiftCodesFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(getPublicGiftCodesEnd());
    }
  };
}

export function updateCartItem(payload) {
  return async (dispatch) => {
    try {
      dispatch(updateCartItemBegin());
      const result = await shopService.updateCartItem(payload);
      dispatch(getCartSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(updateCartItemFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(updateCartItemEnd());
    }
  };
}

export function deleteCartItems(ids) {
  return async (dispatch) => {
    try {
      dispatch(deleteCartItemBegin());
      const result = await shopService.deleteCartItems(ids);
      dispatch(getCartSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(deleteCartItemFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(deleteCartItemEnd());
    }
  };
}

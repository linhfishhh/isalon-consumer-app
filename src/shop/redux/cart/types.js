import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/cart';

export const GET_CART = `${CONTEXT}/GET_CART`;
export const GET_CART_QUANTITY = `${CONTEXT}/GET_CART_QUANTITY`;
export const ADD_PRODUCT_TO_CART = `${CONTEXT}/ADD_PRODUCT_TO_CART`;
export const GET_GIFTCODES = `${CONTEXT}/GET_GIFTCODES`;
export const UPDATE_ERRORS = `${CONTEXT}/UPDATE_ERRORS`;
export const UPDATE_CART_ITEM = `${CONTEXT}/UPDATE_CART_ITEM`;
export const DELETE_CART_ITEM = `${CONTEXT}/DELETE_CART_ITEM`;

export const [
  GET_CART_BEGIN,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  GET_CART_END
] = createActionType(GET_CART);

export const [
  GET_CART_QUANTITY_BEGIN,
  GET_CART_QUANTITY_SUCCESS,
  GET_CART_QUANTITY_FAIL,
  GET_CART_QUANTITY_END
] = createActionType(GET_CART_QUANTITY);

export const [
  ADD_PRODUCT_TO_CART_BEGIN,
  ADD_PRODUCT_TO_CART_SUCCESS,
  ADD_PRODUCT_TO_CART_FAIL,
  ADD_PRODUCT_TO_CART_END
] = createActionType(ADD_PRODUCT_TO_CART);

export const [
  GET_GIFTCODES_BEGIN,
  GET_GIFTCODES_SUCCESS,
  GET_GIFTCODES_FAIL,
  GET_GIFTCODES_END
] = createActionType(GET_GIFTCODES);

export const [
  UPDATE_CART_ITEM_BEGIN,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAIL,
  UPDATE_CART_ITEM_END
] = createActionType(UPDATE_CART_ITEM);

export const [
  DELETE_CART_ITEM_BEGIN,
  DELETE_CART_ITEM_SUCCESS,
  DELETE_CART_ITEM_FAIL,
  DELETE_CART_ITEM_END
] = createActionType(DELETE_CART_ITEM);
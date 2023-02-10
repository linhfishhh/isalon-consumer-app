/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_CART_BEGIN,
  GET_CART_SUCCESS,
  GET_CART_END,
  GET_CART_QUANTITY_SUCCESS,
  GET_CART_QUANTITY_FAIL,
  ADD_PRODUCT_TO_CART_BEGIN,
  ADD_PRODUCT_TO_CART_SUCCESS,
  ADD_PRODUCT_TO_CART_END,
  GET_GIFTCODES_SUCCESS,
  UPDATE_ERRORS,
  UPDATE_CART_ITEM_BEGIN,
  UPDATE_CART_ITEM_END,
  DELETE_CART_ITEM_BEGIN,
  DELETE_CART_ITEM_END,
} from './types';

// cart = {
//   cartItems: [
//     {
//       id,
//       title,
//       data: [
//         ...server_items
//       ]
//     }
//   ],
//   estimatedFee: {
//     estimatedTotalPrice,
//     shippingCost
//   }
// }
export const initialState = {
  cart: {},
  quantity: 0,
  fetching: true,
  updating: false,
  giftCodes: [],
  errors: undefined,
};

const cartReducer = {
  [GET_CART_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetching = true;
  }),
  [GET_CART_SUCCESS]: (state, action) => produce(state, (draft) => {
    const cartInfo = _.get(action, 'payload');
    const items = _.get(cartInfo, 'items');
    if (items) {
      const cartItems = [];
      if (items.length > 0) {
        cartItems.push({
          id: 1,
          title: 'Chọn tất cả',
          data: items,
        });
      }
      draft.cart = {
        cartItems,
        estimatedFee: {
          estimatedTotalPrice: _.get(cartInfo, 'estimatedTotalPrice'),
          shippingCost: _.get(cartInfo, 'shippingCost')
        }
      };
    }
    draft.quantity = _.get(cartInfo, 'quantity');
    draft.fetching = false;
  }),
  [GET_CART_END]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
  [GET_CART_QUANTITY_SUCCESS]: (state, action) => produce(state, (draft) => {
    draft.quantity = _.get(action, 'payload');
  }),
  [GET_CART_QUANTITY_FAIL]: (state) => produce(state, (draft) => {
    draft.quantity = 0;
  }),
  [ADD_PRODUCT_TO_CART_BEGIN]: (state) => produce(state, (draft) => {
    draft.updating = true;
  }),
  [ADD_PRODUCT_TO_CART_SUCCESS]: (state) => produce(state, (draft) => {
    // const payload = _.get(action, 'payload');
    draft.updating = false;
  }),
  [ADD_PRODUCT_TO_CART_END]: (state) => produce(state, (draft) => {
    draft.updating = false;
  }),
  [UPDATE_CART_ITEM_BEGIN]: (state) => produce(state, (draft) => {
    draft.updating = true;
  }),
  [UPDATE_CART_ITEM_END]: (state) => produce(state, (draft) => {
    draft.updating = false;
  }),
  [DELETE_CART_ITEM_BEGIN]: (state) => produce(state, (draft) => {
    draft.updating = true;
  }),
  [DELETE_CART_ITEM_END]: (state) => produce(state, (draft) => {
    draft.updating = false;
  }),
};

const giftCodeReducer = {
  [GET_GIFTCODES_SUCCESS]: (state, action) => produce(state, (draft) => {
    draft.giftCodes = _.get(action, 'payload', []);
  }),
};

const errorReducer = {
  [UPDATE_ERRORS]: (state, action) => produce(state, (draft) => {
    draft.errors = _.get(action, 'payload', undefined);
  }),
};

export default handleActions(
  {
    ...cartReducer,
    ...giftCodeReducer,
    ...errorReducer,
  },
  initialState,
);

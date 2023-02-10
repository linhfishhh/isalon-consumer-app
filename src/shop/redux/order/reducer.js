/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  PRE_PAY_BEGIN,
  PRE_PAY_SUCCESS,
  PRE_PAY_END,

  CONFIRM_PAY_BEGIN,
  CONFIRM_PAY_SUCCESS,
  CONFIRM_PAY_END,

  UPDATE_ERRORS,
} from './types';

export const initialState = {
  orderInfo: {},
  fetching: false,
  errors: undefined,
};

// sample
/*

*/

const prepayReducer = {
  [PRE_PAY_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetching = true;
    draft.orderInfo = {};
  }),
  [PRE_PAY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const order = _.get(action, 'payload', []);
    draft.orderInfo = order;
    draft.fetching = false;
  }),
  [PRE_PAY_END]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
};

const payReducer = {
  [CONFIRM_PAY_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetching = true;
  }),
  [CONFIRM_PAY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const order = _.get(action, 'payload', []);
    draft.orderInfo = order;
    draft.fetching = false;
  }),
  [CONFIRM_PAY_END]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
};

const errorReducer = {
  [UPDATE_ERRORS]: (state, action) => produce(state, (draft) => {
    draft.errors = _.get(action, 'payload', undefined);
  }),
};

export default handleActions(
  {
    ...prepayReducer,
    ...payReducer,
    ...errorReducer,
  },
  initialState,
);

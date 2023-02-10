/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_ORDERS_HISTORY_BEGIN,
  GET_ORDERS_HISTORY_SUCCESS,
  GET_ORDERS_HISTORY_FAIL,
  // GET_ORDERS_HISTORY_END
  CANCEL_ORDERS_SUCCESS,
} from './types';

const initialData = {
  loading: true,
  orderList: [],
  paging: {}
};

export const initialState = {
  error: {}
};

const orderHistoryReducer = {
  [GET_ORDERS_HISTORY_BEGIN]: (state, action) => produce(state, (draft) => {
    const dataKey = _.get(action, 'payload.dataKey');
    const refreshing = _.get(action, 'payload.refreshing', false);
    if (draft[dataKey]) {
      if (refreshing) {
        draft[dataKey].loading = true;
      }
    } else {
      draft[dataKey] = initialData;
    }
  }),
  [GET_ORDERS_HISTORY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const dataKey = _.get(action, 'payload.dataKey');
    const pageNumber = _.get(action, 'payload.data.pageable.pageNumber');
    if (!pageNumber) {
      draft[dataKey].orderList = _.get(action, 'payload.data.content');
    } else {
      draft[dataKey].orderList = [
        ...state[dataKey].orderList,
        ..._.get(action, 'payload.data.content')
      ];
    }
    draft[dataKey].loading = false;
    draft[dataKey].paging = _.get(action, 'payload.data');
    _.unset(draft[dataKey].paging, 'content');
    draft.error = {};
  }),
  [GET_ORDERS_HISTORY_FAIL]: (state, action) => produce(state, (draft) => {
    const dataKey = _.get(action, 'payload.dataKey', '');
    draft[dataKey].loading = false;
    draft.error = _.get(action, 'payload', '');
  }),
  [CANCEL_ORDERS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const dataKey = _.get(action, 'payload.dataKey');
    const orderItem = _.get(action, 'payload.data');
    draft[dataKey].orderList = state[dataKey].orderList.map(
      (item) => (item.orderId === orderItem.orderId ? orderItem : item)
    );
  })
};

export default handleActions(
  {
    ...orderHistoryReducer
  },
  initialState
);

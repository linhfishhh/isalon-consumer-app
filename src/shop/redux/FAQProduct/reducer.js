/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_FAQ_LIST_BEGIN,
  GET_FAQ_LIST_SUCCESS,
  GET_FAQ_LIST_FAIL,
} from './types';

export const initialState = {
  loading: true,
  faqList: [],
  paging: {}
};

const FAQProductReducer = {
  [GET_FAQ_LIST_BEGIN]: (state, action) => produce(state, (draft) => {
    const refreshing = _.get(action, 'payload.refreshing', false);
    if (refreshing) {
      draft.loading = true;
    }
  }),
  [GET_FAQ_LIST_SUCCESS]: (state, action) => produce(state, (draft) => {
    const pageNumber = _.get(action, 'payload.data.pageable.pageNumber');
    if (!pageNumber) {
      draft.faqList = _.get(action, 'payload.data.content');
    } else {
      draft.faqList = [
        ...state.faqList,
        ..._.get(action, 'payload.data.content')
      ];
    }
    draft.loading = false;
    draft.paging = _.get(action, 'payload.data');
    _.unset(draft.paging, 'content');
    draft.error = {};
  }),
  [GET_FAQ_LIST_FAIL]: (state, action) => produce(state, (draft) => {
    draft.loading = false;
    draft.error = _.get(action, 'payload');
  }),
};

export default handleActions(
  {
    ...FAQProductReducer
  },
  initialState
);

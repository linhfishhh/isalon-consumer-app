/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';

import {
  LOGIN_SUCCESS,
} from './types';

export const initialState = {
  error: {},
};

// sample
/*

*/

const loginReducer = {
  [LOGIN_SUCCESS]: (state) => produce(state, (draft) => {
    draft.error = undefined;
  }),
};

export default handleActions(
  {
    ...loginReducer,
  },
  initialState,
);

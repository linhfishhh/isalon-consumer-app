import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/FAQ';

export const GET_FAQ_LIST = `${CONTEXT}/GET_FAQ_LIST`;
export const ADD_FAQ = `${CONTEXT}/ADD_FAQ`;

export const [
  GET_FAQ_LIST_BEGIN,
  GET_FAQ_LIST_SUCCESS,
  GET_FAQ_LIST_FAIL,
  GET_FAQ_LIST_END
] = createActionType(GET_FAQ_LIST);

export const [
  ADD_FAQ_BEGIN,
  ADD_FAQ_SUCCESS,
  ADD_FAQ_FAIL,
  ADD_FAQ_END
] = createActionType(ADD_FAQ);

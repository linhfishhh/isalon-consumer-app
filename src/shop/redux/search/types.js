import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/search';

export const GET_SUGGESTION_KEYWORDS = `${CONTEXT}/GET_SUGGESTION_KEYWORDS`;
export const GET_SUGGESTION_PRODUCTS = `${CONTEXT}/GET_SUGGESTION_PRODUCTS`;
export const GET_SEARCH_HISTORY = `${CONTEXT}/GET_SEARCH_HISTORY`;
export const GET_HOT_KEYWORDS = `${CONTEXT}/GET_HOT_KEYWORDS`;
export const FIND_PRODUCTS_FOR_CATEGORY = `${CONTEXT}/FIND_PRODUCTS_FOR_CATEGORY`;
export const CLEAR_SEARCH_RESULT = `${CONTEXT}/CLEAR_SEARCH_RESULT`;
export const FETCH_FILTER_OPTIONS = `${CONTEXT}/FETCH_FILTER_OPTIONS`;
export const CLEAR_SEARCH_HISTORY = `${CONTEXT}/CLEAR_SEARCH_HISTORY`;

export const [
  GET_SUGGESTION_KEYWORDS_BEGIN,
  GET_SUGGESTION_KEYWORDS_SUCCESS,
  GET_SUGGESTION_KEYWORDS_FAIL,
  GET_SUGGESTION_KEYWORDS_END
] = createActionType(GET_SUGGESTION_KEYWORDS);

export const [
  GET_SUGGESTION_PRODUCTS_BEGIN,
  GET_SUGGESTION_PRODUCTS_SUCCESS,
  GET_SUGGESTION_PRODUCTS_FAIL,
  GET_SUGGESTION_PRODUCTS_END
] = createActionType(GET_SUGGESTION_PRODUCTS);

export const [
  GET_SEARCH_HISTORY_BEGIN,
  GET_SEARCH_HISTORY_SUCCESS,
  GET_SEARCH_HISTORY_FAIL,
  GET_SEARCH_HISTORY_END
] = createActionType(GET_SEARCH_HISTORY);

export const [
  GET_HOT_KEYWORDS_BEGIN,
  GET_HOT_KEYWORDS_SUCCESS,
  GET_HOT_KEYWORDS_FAIL,
  GET_HOT_KEYWORDS_END
] = createActionType(GET_HOT_KEYWORDS);

export const [
  FIND_PRODUCTS_FOR_CATEGORY_BEGIN,
  FIND_PRODUCTS_FOR_CATEGORY_SUCCESS,
  FIND_PRODUCTS_FOR_CATEGORY_FAIL,
  FIND_PRODUCTS_FOR_CATEGORY_END
] = createActionType(FIND_PRODUCTS_FOR_CATEGORY);

export const [
  FETCH_FILTER_OPTIONS_BEGIN,
  FETCH_FILTER_OPTIONS_SUCCESS,
  FETCH_FILTER_OPTIONS_FAIL,
  FETCH_FILTER_OPTIONS_END
] = createActionType(FETCH_FILTER_OPTIONS);

export const [
  CLEAR_SEARCH_HISTORY_BEGIN,
  CLEAR_SEARCH_HISTORY_SUCCESS,
  CLEAR_SEARCH_HISTORY_FAIL,
  CLEAR_SEARCH_HISTORY_END
] = createActionType(CLEAR_SEARCH_HISTORY);

import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/account';

export const LOGIN = `${CONTEXT}/LOGIN`;
export const LOGOUT = `${CONTEXT}/LOGOUT`;

export const [
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_END,
] = createActionType(
  LOGIN,
);

export const [
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_END,
] = createActionType(
  LOGOUT,
);

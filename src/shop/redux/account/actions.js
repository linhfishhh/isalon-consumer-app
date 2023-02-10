import { createSideEffectAction } from '../../utils/reduxHelper';
import { authService } from '../../services';

import {
  LOGIN,
  LOGOUT,
} from './types';

export const [
  loginBegin,
  loginSuccess,
  loginFail,
  loingEnd,
] = createSideEffectAction(LOGIN);

export const [
  logoutBegin,
  logoutSuccess,
  logoutFail,
  logoutEnd,
] = createSideEffectAction(LOGOUT);

export function login(payload) {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const result = await authService.login(payload);
      dispatch(loginSuccess(result.data));
    } catch (e) {
      dispatch(loginFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
    } finally {
      dispatch(loginFail());
    }
  };
}

import _ from 'lodash';
import {
  createSideEffectAction,
  createSingleAction
} from '../../utils/reduxHelper';
import { shopService } from '../../services';
import * as alert from '../../utils/alert';

import { PRE_PAY, CONFIRM_PAY, UPDATE_ERRORS } from './types';
import { ErrorTypes } from '../../constants';

const [
  prepayBegin,
  prepaySuccess,
  prepayFail,
  prepayEnd
] = createSideEffectAction(PRE_PAY);

const [
  confirmPayBegin,
  confirmPaySuccess,
  confirmPayFail,
  confirmPayEnd
] = createSideEffectAction(CONFIRM_PAY);

const updateErrorsAction = createSingleAction(UPDATE_ERRORS);

// errors is array of error message
export function updateErrors(errors) {
  return (dispatch) => {
    dispatch(updateErrorsAction(errors));
  };
}

export function prepay(payload) {
  return async (dispatch) => {
    try {
      dispatch(prepayBegin());
      const result = await shopService.prepayOrder(payload);
      dispatch(prepaySuccess(_.get(result, 'data.data')));
      const errors = _.get(result, 'data.data.errors');
      if (!_.isEmpty(errors)) {
        dispatch(updateErrorsAction(errors));
      }
    } catch (e) {
      dispatch(prepayFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(prepayEnd());
    }
  };
}

export function payOrder(payload, callback) {
  return async (dispatch) => {
    try {
      dispatch(confirmPayBegin());
      const result = await shopService.payOrder(payload);
      dispatch(confirmPaySuccess(_.get(result, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(confirmPayFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(confirmPayEnd());
    }
  };
}

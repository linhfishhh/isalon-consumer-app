import {
  createSideEffectAction,
} from '../../utils/reduxHelper';
import { ordersService } from '../../services';

import { GET_ORDERS_HISTORY, CANCEL_ORDERS } from './types';

export const [
  getOrderHistoryBegin,
  getOrderHistorySuccess,
  getOrderHistoryFail,
  getOrderHistoryEnd
] = createSideEffectAction(GET_ORDERS_HISTORY);


export const [
  cancelOrdersBegin,
  cancelOrdersSuccess,
  cancelOrdersFail,
  cancelOrdersEnd
] = createSideEffectAction(CANCEL_ORDERS);

export function getOrderHistory(dataKey, orderStatus, refreshing, page, limit) {
  return async (dispatch) => {
    try {
      dispatch(getOrderHistoryBegin({ dataKey, refreshing }));
      const result = await ordersService.getOrderHistory(orderStatus, page, limit);
      dispatch(getOrderHistorySuccess({ ...result.data, dataKey }));
    } catch (e) {
      dispatch(
        getOrderHistoryFail({
          dataKey,
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(getOrderHistoryEnd({ dataKey }));
    }
  };
}

export function cancelOrders(data, dataKey, callback) {
  return async (dispatch) => {
    try {
      dispatch(cancelOrdersBegin());
      const result = await ordersService.cancelOrders(data);
      dispatch(cancelOrdersSuccess({ ...result.data, dataKey }));
      if (callback) {
        callback();
      }
    } catch (e) {
      if (callback) {
        callback(e);
      }
      dispatch(
        cancelOrdersFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(cancelOrdersEnd());
    }
  };
}

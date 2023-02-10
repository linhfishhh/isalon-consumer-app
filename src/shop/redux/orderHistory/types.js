import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/orderHistory';

export const GET_ORDERS_HISTORY = `${CONTEXT}/GET_ORDERS_HISTORY`;
export const CANCEL_ORDERS = `${CONTEXT}/CANCEL_ORDERS`;

export const [
  GET_ORDERS_HISTORY_BEGIN,
  GET_ORDERS_HISTORY_SUCCESS,
  GET_ORDERS_HISTORY_FAIL,
  GET_ORDERS_HISTORY_END
] = createActionType(GET_ORDERS_HISTORY);

export const [
  CANCEL_ORDERS_BEGIN,
  CANCEL_ORDERS_SUCCESS,
  CANCEL_ORDERS_FAIL,
  CANCEL_ORDERS_END
] = createActionType(CANCEL_ORDERS);

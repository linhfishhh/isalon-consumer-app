import { createActionType } from '../../utils/reduxHelper';

export const CONTEXT = 'shop/order';

export const PRE_PAY = `${CONTEXT}/PRE_PAY`;
export const CONFIRM_PAY = `${CONTEXT}/CONFIRM_PAY`;
export const UPDATE_ERRORS = `${CONTEXT}/UPDATE_ERRORS`;

export const [
  PRE_PAY_BEGIN,
  PRE_PAY_SUCCESS,
  PRE_PAY_FAIL,
  PRE_PAY_END,
] = createActionType(
  PRE_PAY,
);

export const [
  CONFIRM_PAY_BEGIN,
  CONFIRM_PAY_SUCCESS,
  CONFIRM_PAY_FAIL,
  CONFIRM_PAY_END,
] = createActionType(
  CONFIRM_PAY,
);

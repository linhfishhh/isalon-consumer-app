import { createAction } from 'redux-actions';

// Suffix for redux action base on flow BEGIN -> SUCCESS | FAIL -> END
const [BEGIN_SUFFIX, SUCCESS_SUFFIX, FAIL_SUFFIX, END_SUFFIX] = [
  'BEGIN',
  'SUCCESS',
  'FAIL',
  'END',
];

export const [
  ACTION_TYPE_BEGIN_SUFFIX,
  ACTION_TYPE_SUCCESS_SUFFIX,
  ACTION_TYPE_FAIL_SUFFIX,
  ACTION_TYPE_END_SUFFIX,
] = [
  BEGIN_SUFFIX,
  `REQUEST_${SUCCESS_SUFFIX}`,
  `REQUEST_${FAIL_SUFFIX}`,
  END_SUFFIX,
];

function createActionType(type) {
  return [
    `${type}_${ACTION_TYPE_BEGIN_SUFFIX}`,
    `${type}_${ACTION_TYPE_SUCCESS_SUFFIX}`,
    `${type}_${ACTION_TYPE_FAIL_SUFFIX}`,
    `${type}_${ACTION_TYPE_END_SUFFIX}`,
  ];
}

function createSingleAction(type) {
  return createAction(type);
}

function createSideEffectAction(type) {
  return [
    createAction(`${type}_${ACTION_TYPE_BEGIN_SUFFIX}`),
    createAction(`${type}_${ACTION_TYPE_SUCCESS_SUFFIX}`),
    createAction(`${type}_${ACTION_TYPE_FAIL_SUFFIX}`),
    createAction(`${type}_${ACTION_TYPE_END_SUFFIX}`),
  ];
}

export { createActionType, createSingleAction, createSideEffectAction };

/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_PREDEFINE_LOCATION_LIST_BEGIN,
  GET_PREDEFINE_LOCATION_LIST_SUCCESS,
  GET_PREDEFINE_LOCATION_LIST_END,

  ADD_ADDRESS_SUCCESS,

  GET_MY_ADDRESSES_BEGIN,
  GET_MY_ADDRESSES_SUCCESS,
  GET_MY_ADDRESSES_END,

  DELETE_ADDRESS_SUCCESS,
  UPDATE_SELECTED_SHIPPING_ADDRESS,

  UPDATE_ERRORS,
  UPDATE_ADDRESS_SUCCESS,
} from './types';

export const initialState = {
  locations: [],
  myShippingAddresses: [],
  selectedShippingAddress: undefined,
  fetching: false,
  errors: undefined,
};

// sample
/*

*/

const predefineLocationReducer = {
  [GET_PREDEFINE_LOCATION_LIST_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetching = true;
    draft.locations = [];
  }),
  [GET_PREDEFINE_LOCATION_LIST_SUCCESS]: (state, action) => produce(state, (draft) => {
    const locations = _.get(action, 'payload', []);
    draft.locations = locations;
    draft.fetching = false;
  }),
  [GET_PREDEFINE_LOCATION_LIST_END]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
};

const myAddressReducer = {
  [ADD_ADDRESS_SUCCESS]: (state) => produce(state, (draft) => {
    // const myAddress = _.get(action, 'payload', []);
    // const index = _.findIndex(draft.myShippingAddresses, {addressId: myAddress.addressId});
    // if (index === -1) {
    //   draft.myShippingAddresses = [...draft.myShippingAddresses, myAddress];
    // } else {
    //   let addrs = [...draft.myShippingAddresses];
    //   addrs.splice(index, 1, myAddress);
    //   draft.myShippingAddresses = addrs;
    // }
    draft.fetching = false;
  }),
  [UPDATE_ADDRESS_SUCCESS]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
  [GET_MY_ADDRESSES_BEGIN]: (state) => produce(state, (draft) => {
    draft.fetching = true;
    // draft.myShippingAddresses = [];
  }),
  [GET_MY_ADDRESSES_SUCCESS]: (state, action) => produce(state, (draft) => {
    const myAddresses = _.get(action, 'payload', []);
    draft.myShippingAddresses = myAddresses;
    if (_.isEmpty(draft.selectedShippingAddress)) {
      draft.selectedShippingAddress = _.find(myAddresses, (addr) => addr.isDefault === true);
    }
    draft.fetching = false;
  }),
  [GET_MY_ADDRESSES_END]: (state) => produce(state, (draft) => {
    draft.fetching = false;
  }),
  [DELETE_ADDRESS_SUCCESS]: (state, action) => produce(state, (draft) => {
    const deletedAddress = _.get(action, 'payload', {});
    const addrs = [...draft.myShippingAddresses];
    _.remove(addrs, (addr) => addr.addressId === deletedAddress.addressId);
    draft.myShippingAddresses = addrs;
    const found = _.find(addrs, (selected) => selected.addressId === _.get(draft.selectedShippingAddress, 'addressId'));
    if (_.isEmpty(found)) {
      draft.selectedShippingAddress = _.isEmpty(addrs) ? undefined : addrs[0];
    }
  }),
  [UPDATE_SELECTED_SHIPPING_ADDRESS]: (state, action) => produce(state, (draft) => {
    draft.selectedShippingAddress = _.get(action, 'payload', {});
  }),
};

const errorReducer = {
  [UPDATE_ERRORS]: (state, action) => produce(state, (draft) => {
    draft.errors = _.get(action, 'payload', undefined);
  }),
};

export default handleActions(
  {
    ...predefineLocationReducer,
    ...myAddressReducer,
    ...errorReducer,
  },
  initialState,
);

import _ from 'lodash';
import { createSideEffectAction, createSingleAction } from '../../utils/reduxHelper';
import { profileService } from '../../services';
import * as alert from '../../utils/alert';

import {
  GET_PREDEFINE_LOCATION_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  GET_MY_ADDRESSES,
  UPDATE_SELECTED_SHIPPING_ADDRESS,
  UPDATE_ERRORS,
} from './types';
import { ErrorTypes } from '../../constants';

const [
  getPredefineLocationListBegin,
  getPredefineLocationListSuccess,
  getPredefineLocationListFail,
  getPredefineLocationListEnd,
] = createSideEffectAction(GET_PREDEFINE_LOCATION_LIST);

const [
  addAddressBegin,
  addAddressSuccess,
  addAddressFail,
  addAddressEnd
] = createSideEffectAction(ADD_ADDRESS);

const [
  updateAddressBegin,
  updateAddressSuccess,
  updateAddressFail,
  updateAddressEnd
] = createSideEffectAction(UPDATE_ADDRESS);

const [
  deleteAddressBegin,
  deleteAddressSuccess,
  deleteAddressFail,
  deleteAddressEnd
] = createSideEffectAction(DELETE_ADDRESS);

const [
  getMyAddressesBegnin,
  getMyAddressesSuccess,
  getMyAddressesFail,
  getMyAddressesEnd,
] = createSideEffectAction(GET_MY_ADDRESSES);

const updateSelectedShippingAddressSuccess = createSingleAction(UPDATE_SELECTED_SHIPPING_ADDRESS);
const updateErrorsAction = createSingleAction(UPDATE_ERRORS);

export function updateErrors(errors) {
  return (dispatch) => {
    dispatch(updateErrorsAction(errors));
  };
}

export function getProvinceList() {
  return async (dispatch) => {
    try {
      dispatch(getPredefineLocationListBegin());
      const result = await profileService.getProvinceList();
      dispatch(getPredefineLocationListSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getPredefineLocationListFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(getPredefineLocationListEnd());
    }
  };
}

export function getDistrictList(provinceId) {
  return async (dispatch) => {
    try {
      dispatch(getPredefineLocationListBegin());
      const result = await profileService.getDistrictList(provinceId);
      dispatch(getPredefineLocationListSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getPredefineLocationListFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(getPredefineLocationListEnd());
    }
  };
}

export function getCommuneList(districtId) {
  return async (dispatch) => {
    try {
      dispatch(getPredefineLocationListBegin());
      const result = await profileService.getCommuneList(districtId);
      dispatch(getPredefineLocationListSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getPredefineLocationListFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(getPredefineLocationListEnd());
    }
  };
}

// dispatch, getState
export function addMyAddress(payload, callback) {
  return async (dispatch) => {
    try {
      dispatch(addAddressBegin());
      const addResult = await profileService.addAddress(payload);
      dispatch(addAddressSuccess(_.get(addResult, 'data.data')));
      const fetchResult = await profileService.getMyAddresses();
      dispatch(getMyAddressesSuccess(_.get(fetchResult, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(addAddressFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(addAddressEnd());
    }
  };
}

export function updateMyAddress(payload, callback) {
  return async (dispatch) => {
    try {
      dispatch(updateAddressBegin());
      const addResult = await profileService.updateAddress(payload);
      dispatch(updateAddressSuccess(_.get(addResult, 'data.data')));
      const fetchResult = await profileService.getMyAddresses();
      dispatch(getMyAddressesSuccess(_.get(fetchResult, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(updateAddressFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(updateAddressEnd());
    }
  };
}

export function getMyAddresses() {
  return async (dispatch) => {
    try {
      dispatch(getMyAddressesBegnin());
      const result = await profileService.getMyAddresses();
      dispatch(getMyAddressesSuccess(_.get(result, 'data.data')));
    } catch (e) {
      dispatch(getMyAddressesFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(getMyAddressesEnd());
    }
  };
}

export function deleteMyAddress(addressId, callback) {
  return async (dispatch) => {
    try {
      dispatch(deleteAddressBegin());
      const result = await profileService.removeAddress(addressId);
      dispatch(deleteAddressSuccess(_.get(result, 'data.data')));
      if (callback) {
        callback();
      }
    } catch (e) {
      dispatch(deleteAddressFail({
        title: 'Đã có lỗi xảy ra',
        message: '',
      }));
      dispatch(updateErrorsAction([{
        type: ErrorTypes.connection,
        message: alert.getServerErrorMessage(e),
      }]));
    } finally {
      dispatch(deleteAddressEnd());
    }
  };
}

export function updateSelectedShippingAddress(addr) {
  return async (dispatch) => {
    dispatch(updateSelectedShippingAddressSuccess(addr));
  };
}

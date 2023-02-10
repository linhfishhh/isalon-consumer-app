import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const cancelBooking = (bookingID , after) => {
    return async(dispatch, getState) => {
        if(getState().booking.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/cancel', {
                id: bookingID
            });
            after(rq.data);
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const getBookingPaymentLink = (bookingID , after) => {
    return async(dispatch, getState) => {

        if(getState().booking.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/payment/link', {
                id: bookingID
            });
            after(rq.data);
            dispatch(updateInfo({
                fetching: false,
            }))
        }
        catch (e) {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const createNewAddressInfo = (data , after) => {
    return async(dispatch, getState) => {

        if(getState().booking.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/address-info/new', data);
            after(rq.data);
            dispatch(updateInfo({
                fetching: false,
            }))
        }
        catch (e) {
            dispatch(updateInfo({
                error: true,
                fetching: false,
                errorTitle: 'Lỗi xảy ra',
                errorMessage: e.response.status === 422?Utils.getValidationMessage(e.response):'Lỗi lưu thông tin'
            }))
        }
    }
};

export const setError = (title, msg) =>{
    return {
        type: setError,
        message: msg,
        title: title
    }
};

export const clearError = () =>{
    return {
        type: aclearError,
    }
};

export const starFetching = () =>{
    return {
        type: afetchingStart,
    }
};

export const doneFetching = () =>{
    return {
        type: afetchingDone,
    }
};

export const updateInfo = (info) =>{
    return {
        type: aupdateInfo,
        info : info
    }
};
import Utils from '../../configs';
import { aclearError, afetchingDone, afetchingStart, aupdateInfo } from "./types";

export const getFlastDeals = () => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios(getState().account.token).post(
                'promo-salons'
            );
            dispatch(updateInfo({
                data: rq.data
            }));
        }
        catch (e) {

        }
    }
};

export const setError = (title, msg) => {
    return {
        type: setError,
        message: msg,
        title: title
    }
};

export const clearError = () => {
    return {
        type: aclearError,
    }
};

export const starFetching = () => {
    return {
        type: afetchingStart,
    }
};

export const doneFetching = () => {
    return {
        type: afetchingDone,
    }
};

export const updateInfo = (info) => {
    return {
        type: aupdateInfo,
        info: info
    }
};
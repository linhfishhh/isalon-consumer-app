import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const loadWaitingHistory = (force = false) => {
    return async(dispatch, getState) => {
        let loaded = getState().history.loaded;
        if(loaded && !force){
            return false;
        }
        if(!getState().account.token){
            return false;
        }
        try {
            dispatch(updateInfo({
                fetching: true
            }));
            let rq = await Utils.getAxios(getState().account.token).post(
                'booking/waiting'
            );
            dispatch(updateInfo({
                data: rq.data,
                fetching: false,
                loaded: true
            }));
        }
        catch (e) {
            dispatch(updateInfo({
                fetching: false
            }));
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
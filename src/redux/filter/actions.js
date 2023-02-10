import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const updateFilterSettings = (settings) => {
    return (dispatch, getState) => {
        dispatch(updateInfo({
            settings: settings
        }));
    }
};

export const cacheCats = () => {
    return async(dispatch, getState) => {
        if(getState().filter.fetching){
            return false;
        }
        let cacheCats = getState().filter.cacheCats;
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('search/get-service-categories');
            cacheCats = rq.data;
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                cacheCats: cacheCats
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
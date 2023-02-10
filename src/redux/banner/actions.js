import Utils from '../../configs';
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const getBanners = () => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios().get(
                'banners'
            );
            dispatch(updateInfo({
                listBanners: rq.data
            }));
        }
        catch (e) {
            // TODO
        }
    }
};


export const getBannerGird = () => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios().get(
                'banner-gird'
            );
            dispatch(updateInfo({
                listBannersGird: rq.data
            }));
        }
        catch (e) {
            // TODO
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

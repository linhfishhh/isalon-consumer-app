import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const updateActive = (active) => {
    return dispatch => {
        let p;
        if(!active){
            p = {
                homeActive: active,
                mapSaved: true
            };
        }
        else{
            p = {
                homeActive: active,
            };
        }
        dispatch(updateInfo(p));
    }
};

export const updateTabIndex = (index) => {
    return dispatch => {
        let p;
        if(index === 0){
            p = {
                tabIndex: index,
                mapSaved: true
            };
        }
        else{
            p = {
                tabIndex: index,
            };
        }
        dispatch(updateInfo(p));
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
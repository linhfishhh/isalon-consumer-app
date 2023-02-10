import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";

export const setCurrentSelectedSalon = (salon) => {
    return (dispatch, getState) => {
        dispatch(updateInfo(
            {
                currentSelectedSalon: salon
            }
        ));
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
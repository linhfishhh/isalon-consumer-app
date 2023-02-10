import Utils from '../../configs'
import {lFetchingDone, lFetchingStart, lUpdateInfo} from "./types";

export const updateCount = () => {
    return async(dispatch, getState) => {
        try {
            if(!getState().account.token){
                return false;
            }
            let rq = await Utils.getAxios(getState().account.token).post(
                'notification/count'
            );
            dispatch(updateInfo({
                count: rq.data
            }));
        }
        catch (e) {

        }
    }
};

export const readNotify = (id) => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios(getState().account.token).post(
                'notification/'+id+'/read'
            );
            dispatch(
                updateInfo(
                    {
                        count: rq.data
                    }
                )
            );
        }
        catch (e) {

        }
    }
};

export const starFetching = () =>{
    return {
        type: lFetchingStart,
    }
};

export const doneFetching = () =>{
    return {
        type: lFetchingDone,
    }
};

export const updateInfo = (info) =>{
    return {
        type: lUpdateInfo,
        info : info
    }
};
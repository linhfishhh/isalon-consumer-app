import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";

export const likeReview = (id, afterThat) => {
    return async(dispatch, getState) => {
        if(getState().likes.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('review/'+id+'/like');
            afterThat(rq.data);
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

export const likeShowcase = (id, afterThat) => {
    return async(dispatch, getState) => {
        if(getState().likes.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('showcase/'+id+'/like');
            afterThat(rq.data);
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

export const likeSalon = (id, afterThat) => {
    return async(dispatch, getState) => {
        if(getState().likes.fetching){
            return;
        }
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('salon/'+id+'/like');
            afterThat(rq.data);
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
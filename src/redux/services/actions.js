import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";
import {updateInfo as updateReviewInfo} from "../reviews/actions";

export const getServiceDetail = (id) => {
    return async (dispatch, getState) => {
        let currentService = undefined;
        let serviceReviewBox = {
            items: [],
            isLast: true,
            total: 0,
            next: 2
        };
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let from_lat = getState().new_search.user_location.lat;
            let from_lng = getState().new_search.user_location.lng;
            let rq = await Utils.getAxios(getState().account.token).post('service/'+id+'/detail', {
                from_lat: from_lat,
                from_lng: from_lng,
            });
            currentService = rq.data;
            serviceReviewBox = {
                ...serviceReviewBox,
                total: currentService.reviews.total,
                items: currentService.reviews.items,
                isLast: currentService.reviews.isLast,
                next: currentService.reviews.next
            };
        }
        catch (e) {
        }
        finally {
            dispatch(updateReviewInfo({
                serviceReviewBox: serviceReviewBox
            }));
            dispatch(updateInfo({
                fetching: false,
                currentService: currentService
            }))
        }
    }
};

export const setError = (title, msg) =>{
    return {
        type: asetError,
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
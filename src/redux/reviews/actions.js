import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";

export const updateServiceReviewLikes = (id, liked,  count) => {
    return (dispatch, getState) => {
        if(getState().reviews.serviceReviewBox === undefined){
            return;
        }
        if(getState().reviews.serviceReviewBox.items === undefined){
            return;
        }
        dispatch(updateInfo({
            serviceReviewBox: {
                ...getState().reviews.serviceReviewBox,
                items: getState().reviews.serviceReviewBox.items.map((review) => {
                    if(review.id !== id){
                        return review;
                    }
                    return {
                        ...review,
                        liked: liked,
                        likes: count
                    }
                })
            }
        }))
    }
};

export const updateSalonReviewLikes = (id, liked,  count) => {
    return (dispatch, getState) => {
        if(getState().reviews.reviewBox === undefined){
            return;
        }
        if(getState().reviews.reviewBox.items === undefined){
            return;
        }
        dispatch(updateInfo({
            reviewBox: {
                ...getState().reviews.reviewBox,
                items: getState().reviews.reviewBox.items.map((review) => {
                    if(review.id !== id){
                        return review;
                    }
                    return {
                        ...review,
                        liked: liked,
                        likes: count
                    }
                })
            }
        }))
    }
};

export const loadServiceReviews = (id) => {
    return async (dispatch, getState) => {
        let serviceReviewBox = getState().reviews.serviceReviewBox;
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('service/'+id+'/reviews', {
                id: id,
                page: getState().reviews.serviceReviewBox.next
            });
            let data = rq.data;
            serviceReviewBox = {
                ...serviceReviewBox,
                total: data.total,
                items: serviceReviewBox.items.concat(data.items),
                isLast: data.isLast,
                next: data.next
            };
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                serviceReviewBox: serviceReviewBox
            }));
        }
    }
};

export const loadSalonReviews = (id) => {
    return async (dispatch, getState) => {
        let reviewBox = getState().reviews.reviewBox;
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('salon/'+id+'/reviews', {
                id: id,
                page: getState().reviews.reviewBox.next
            });
            let data = rq.data;
            reviewBox = {
                ...reviewBox,
                total: data.total,
                items: reviewBox.items.concat(data.items),
                isLast: data.isLast,
                next: data.next
            };
        }catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                reviewBox: reviewBox
            }));
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
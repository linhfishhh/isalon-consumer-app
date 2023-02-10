import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";
import {updateInfo as updateReviewInfo} from "../reviews/actions";

export const getSalonNearBy = () => {
    return async (dispatch, getState) => {
        if(getState().search.fetching){
            return false;
        }
        let from_lat = getState().map.hasPermission?getState().map.data.latitude:0;
        let from_lng = getState().map.hasPermission?getState().map.data.longitude:0;
        let lastNearBy = getState().search.lastNearBy;
        if(from_lat === 0 && from_lng ===0){
            return;
        }
        if((from_lat === lastNearBy.lat) && (from_lng === lastNearBy.lng)){
            return false;
        }
        let nearBySalons = [];
        try{
            dispatch(updateInfo({
                fetching: true
            }));
            let rq = await Utils.getAxios(getState().account.token).post('search/salon-near-me', {
                from_lat: from_lat,
                from_lng: from_lng,
            });
            nearBySalons = rq.data;
            lastNearBy =  {
                lat: from_lat,
                lng: from_lng
            };
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                nearBySalons: nearBySalons,
                lastNearBy: lastNearBy
            }));
        }
    }
};

export const updateHintLikes =  (salon_id, liked) => {
        return (dispatch, getState) => {
            if(getState().search.featuredSalons === undefined){
                return;
            }
            dispatch(updateInfo({
                featuredSalons: getState().search.featuredSalons.map((salon) => {
                    if(salon.id !== salon_id){
                        return salon;
                    }
                    return {
                        ...salon,
                        liked: liked
                    }
                })
            }))
        }
};

export const updateFullSearchResultLikes =  (salon_id, liked) => {
    return (dispatch, getState) => {
        if(getState().search.fullSearchResult === undefined){
            return;
        }
        if(getState().search.fullSearchResult.result === undefined){
            return
        }
        if(getState().search.fullSearchResult.result.length === 0){
            return;
        }
        dispatch(updateInfo({
            fullSearchResult: {
                ...getState().search.fullSearchResult,
                result: getState().search.fullSearchResult.result.map((salon) => {
                    if(salon.id !== salon_id){
                        return salon;
                    }
                    return {
                        ...salon,
                        liked: liked
                    }
                })
            }
        }))
    }
};

export const updateCurrentSalonDetailLike = (id, liked) => {
    return (dispatch, getState) => {
        if(getState().search.currentSalon === undefined){
            return;
        }
        if(getState().search.currentSalon.id !== id){
            return
        }
        dispatch(updateInfo({
            currentSalon: {
                ...getState().search.currentSalon,
                liked: liked
            }
        }))
    }
};

export const updateCurrentSalonDetailShowcaseLike = (id, liked) => {
    return (dispatch, getState) => {
        if(getState().search.currentSalon === undefined){
            return;
        }
        if(getState().search.currentSalon.showcase.length === 0){
            return;
        }
        dispatch(updateInfo({
            currentSalon: {
                ...getState().search.currentSalon,
                showcase: getState().search.currentSalon.showcase.map((showcase) => {
                    if(showcase.id !== id){
                        return showcase;
                    }
                    return {
                        ...showcase,
                        liked: liked
                    }
                })
            }
        }))
    }
};

export const getHints = () => {
    return async (dispatch, getState) => {
        let catItems = [];
        let salonItems = [];

        try{
            dispatch(updateInfo({
                fetching: true
            }));
            let rq = await Utils.getAxios(getState().account.token).post('search/get-featured-items', {
                from_lat: getState().map.hasPermission?getState().map.data.latitude:0,
                from_lng: getState().map.hasPermission?getState().map.data.longitude:0,
            });
            catItems = rq.data.cats.map((item) => {
                return {
                    ...item,
                    image: {uri: item.image}
                }
            });
            salonItems = rq.data.salons.map((item) => {
                return {
                    ...item,
                    image: {uri: item.image}
                }
            });
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                featuredCats: catItems,
                featuredSalons: salonItems
            }));
        }
    }
};

export const doSearch = (keyword) => {
    return async(dispatch, getState) => {
        let searchResult = {
            services: [],
            salons: [],
            total: 0
        };
        try{
            dispatch(updateInfo({
                fetching: true,
                searchResult: searchResult
            }));
            let rq = await Utils.getAxios(getState().account.token).post('search/by-keyword', {
                keyword: keyword,
                from_lat: getState().map.hasPermission?getState().map.data.latitude:0,
                from_lng: getState().map.hasPermission?getState().map.data.longitude:0,
            });
            searchResult = rq.data;
            searchResult.keyword = keyword;
            searchResult.serviceLimit = true;
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                searchResult: searchResult,
            }))
        }
    }
};

export const resetFullSearch = () => {
  return dispatch => {
      dispatch(updateInfo({
          fullSearchResult: {
              result: [],
              next_page: 1,
              is_last_page: false,
              locations: [],
              location_lv: undefined,
              cats: [],
          }
      }))
  }
};

export const doFullSearch = (query) => {
    return async(dispatch, getState) => {
        let searchResult = getState().search.fullSearchResult;
        if(searchResult.is_last_page){
            return dispatch(updateInfo({
                fetching: false
            }));
        }
        try{
            dispatch(updateInfo({
                fetching: true,
            }));
            let from_lat = getState().new_search.user_location.lat;
            let from_lng = getState().new_search.user_location.lng;
            let rq = await Utils.getAxios(getState().account.token).post('search/full-search', {
                ...query,
                from_lat: from_lat,
                from_lng: from_lng,
                page: searchResult.next_page
            });
            searchResult = {
                ...rq.data,
                result: searchResult.result.concat(rq.data.result.map((item) => {
                    return {
                        ...item,
                        image: {
                            uri: item.image
                        }
                    }
                })),
            };
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                fullSearchResult: searchResult
            }))
        }
    }
};

export const getSalonDetail = (id, after=()=>{}) => {
        return async (dispatch, getState) => {
            let currentSalon = undefined;
            let reviewBox = {
                items: [],
                isLast: true,
                total: 0,
                next: 2
            };
            try {
                dispatch(updateInfo({
                    fetching: true,
                }));
                let from_lat = getState().new_search.user_location.lat;
                let from_lng = getState().new_search.user_location.lng;
                let rq = await Utils.getAxios(getState().account.token).post('salon/'+id+'/detail', {
                    from_lat: from_lat,
                    from_lng: from_lng,
                });
                currentSalon = rq.data;
                reviewBox = {
                    ...reviewBox,
                    total: currentSalon.reviews.total,
                    items: currentSalon.reviews.items,
                    isLast: currentSalon.reviews.isLast,
                    next: currentSalon.reviews.next
                };
                after(currentSalon);
            }
            catch (e) {
            }
            finally {
                dispatch(updateReviewInfo({
                    reviewBox: reviewBox
                }));
                dispatch(updateInfo({
                    fetching: false,
                    currentSalon: currentSalon
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

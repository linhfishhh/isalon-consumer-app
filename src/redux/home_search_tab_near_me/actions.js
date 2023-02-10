import Utils from '../../configs'
import {aupdateInfo} from "./types";
import {buildSearchQuery} from "../../NewSearchUtils";
import _ from 'lodash';

export const updateSearchTabNearMeState = (state) =>{
    return {
        type: aupdateInfo,
        info : state
    }
};

export const getResultSearchTabNearMe = (extra = {}, restart = true) =>{
    return async (dispatch, getState) => {
        let tab = getState().new_home_search_tab_near_me;
        if(!tab.currentLocation){
            return;
        }
        if(tab.loading || tab.loading_more){
            return;
        }
        let search_tab = getState().new_search;
        let keyword = search_tab.keyword;
        if(tab.searchApplyCallBack){
            tab.searchApplyCallBack();
        }
        var distance = tab.searchRadiusList;
        if (distance !== null && distance.length > 0){
            distance = distance[distance.length - 1];}
        else {
            distance = 4000;
        }
        let params =  buildSearchQuery(keyword, getState().new_search, {
            ...extra,
            view_type: 'near_me',
            from_lat: search_tab.user_location.lat,
            from_lng: search_tab.user_location.lng,
            address_lat : search_tab.user_location.lat,
            address_lng : search_tab.user_location.lng,
            // address_lat: tab.currentLocation.address_lat,
            // address_lng: tab.currentLocation.address_lng,
            distance: distance/1000.0
        });
        _.unset(params, 'cat');
        params.cat = [];
        try {
            dispatch(updateSearchTabNearMeState({
                loading: true,
            }));

            let query = await Utils.getAxios(getState().account.token).post(
                'search/v2',
                params
            );
            let showQuestion = false;
            if(query.data.items.length === 0){
                if((tab.searchRadiusList.length - 1) !== tab.searchRadiusIndex){
                    showQuestion = true;
                }
            }
            dispatch(updateSearchTabNearMeState({
                loaded: true,
                loading: false,
                params : params,
                result: query.data,
                showRadiusQuestion: showQuestion
            }));
        }
        catch (e) {
            dispatch(updateSearchTabNearMeState({
                loading: false,
            }));
        }
    }
};


export const updateSalonNearMeLike = (id, liked) => {
    return (dispatch, getState) => {
        if(getState().new_home_search_tab_near_me.result.items === null){
            return;
        }
        if(getState().new_home_search_tab_near_me.result.items.length === 0){
            return;
        }
        dispatch(updateSearchTabNearMeState({
            result: {
                ...getState().new_home_search_tab_near_me.result,
                items: getState().new_home_search_tab_near_me.result.items.map((salon) => {
                    if(salon.id !== id){
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



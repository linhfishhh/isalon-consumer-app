import Utils from '../../configs'
import {aupdateInfo} from "./types";
import {updateSearchTabLatestState} from "../search_tab_latest/actions";
import {buildSearchQuery} from "../../NewSearchUtils";
import {updateSearchTabNearMeState} from "../search_tab_near_me/actions";

const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();

export const updateSearchTabMostBookingState = (state) =>{
    return {
        type: aupdateInfo,
        info : state
    }
};

export const getResultSearchTabMostBooking = (extra = {}, restart = true) =>{
    return async (dispatch, getState) => {
        let tab = getState().new_search_tab_most_booking;
        if(!restart && tab.result.is_last_page){
            return;
        }
        if(tab.loading || tab.loading_more){
            return;
        }
        let page = 1;
        if(!restart){
            page = tab.result.page + 1;
        }
        let search_tab = getState().new_search;
        let keyword = search_tab.keyword;
        if(!tab.loaded || !restart){
            let params =  buildSearchQuery(keyword, getState().new_search, {
                ...extra,
                view_type: 'most_booking',
                from_lat: search_tab.user_location.lat,
                from_lng: search_tab.user_location.lng,
                page: page
            });
            try {
                let items;
                if(!restart){
                    dispatch(updateSearchTabMostBookingState({
                        loading_more: true,
                    }));
                    items = tab.result.items;
                }
                else{
                    dispatch(updateSearchTabMostBookingState({
                        loading: true,
                    }));
                    items = [];
                }
                let query = await Utils.getAxios().post(
                  'search/v2',
                  params
                );
                items = [
                    ...items,
                  ...query.data.items
                ];
                dispatch(updateSearchTabMostBookingState({
                    loaded: true,
                    loading: false,
                    loading_more: false,
                    result: {
                        ...query.data,
                        items: items
                    },
                }));
            }
            catch (e) {
                dispatch(updateSearchTabMostBookingState({
                    loading: false,
                }));
            }

        }
    }
};
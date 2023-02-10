import {aupdateInfo} from "./types";
import utils from '../../configs';

export const updateSearchHintState = (state) =>{
  return {
    type: aupdateInfo,
    info : state
  }
};

export const fetchHints = (keyword, location_lv1) => {
  return async (dispatch, getState) => {
      dispatch(updateSearchHintState({
        fetching: true,
        cats: [],
        services: [],
        salons: [],
      }));
      try{
        if(keyword.trim().length <2){
          dispatch(updateSearchHintState({
            fetching: false
          }));
          return;
        }
        let search = getState().new_search;

        let rq = await utils.getAxios().post(
          'search/hints',
          {
            keyword: keyword,
            location_lv1: location_lv1,
            from_lat: search.user_location.lat,
            from_lng: search.user_location.lng
          }
        );
        let data = rq.data;
        dispatch(updateSearchHintState({
          fetching: false,
          cats: data.cats,
          services: data.services,
          salons: data.salons
        }))
      }
      catch (e) {
        dispatch(updateSearchHintState({
          fetching: false
        }))
      }

  }
};
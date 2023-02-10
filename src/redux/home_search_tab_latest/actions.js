import Utils from "../../configs";
import { aupdateInfo } from "./types";
import { buildSearchQuery } from "../../NewSearchUtils";
import _ from 'lodash';

//Gán cờ true/false --> Nếu đang tải thì không tải lại
export const updateSearchTabLatestState = state => {
  return {
    type: aupdateInfo,
    info: state
  };
};

//Lấy danh sách địa điểm iSalon
export const getResultSearchTabLatest = (extra = {}, restart = true) => {
  return async (dispatch, getState) => {
    let tab = getState().new_home_search_tab_latest;

    if (!restart && tab.result.is_last_page) {
      return;
    }
    if (tab.loading || tab.loading_more) {
      return;
    }
    let page = 1;
    if (!restart) {
      page = tab.result.page + 1;
    }
    let search_tab = getState().new_search;
    let keyword = search_tab.keyword;
    let params = buildSearchQuery(keyword, getState().new_search, {
      ...extra,
      view_type: "latest",
      from_lat: search_tab.user_location.lat,
      from_lng: search_tab.user_location.lng,
      page: page
    });
    _.unset(params, 'cat');
    params.cat = [];
    try {
      let items;
      if (!restart) {
        dispatch(
          updateSearchTabLatestState({
            loading_more: true
          })
        );
        items = tab.result.items;
      } else {
        dispatch(
          updateSearchTabLatestState({
            loading: true
          })
        );
        items = [];
      }
      let query = await Utils.getAxios(getState().account.token).post(
        "search/v2",
        params
      );
      items = [...items, ...query.data.items];
      dispatch(
        updateSearchTabLatestState({
          loaded: true,
          loading: false,
          loading_more: false,
          params: {
            ...params,
            page: 1
          },
          result: {
            ...query.data,
            items: items
          }
        })
      );
    } catch (e) {
      dispatch(
        updateSearchTabLatestState({
          loading: false
        })
      );
    }
  };
};

export const updateSalonNewLike = (id, liked) => {
  return (dispatch, getState) => {
    if (getState().new_home_search_tab_latest.result.items === null) {
      return;
    }
    if (getState().new_home_search_tab_latest.result.items.length === 0) {
      return;
    }
    dispatch(
      updateSearchTabLatestState({
        result: {
          ...getState().new_home_search_tab_latest.result,
          items: getState().new_home_search_tab_latest.result.items.map(salon => {
            if (salon.id !== id) {
              return salon;
            }
            return {
              ...salon,
              liked: liked
            };
          })
        }
      })
    );
  };
};

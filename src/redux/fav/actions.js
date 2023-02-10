import Utils from "../../configs";
import {
  aclearError,
  afetchingDone,
  afetchingStart,
  aupdateInfo
} from "./types";

export const clearData = () => {
  return (dispatch, getState) => {
    dispatch();
  };
};

export const deleteShowcase = (id, after) => {
  return async (dispatch, getState) => {
    try {
      await Utils.getAxios(getState().account.token).post(
        "fav/showcase/delete",
        {
          id: id
        }
      );

      let showcases = getState().fav.data.showcases.filter(item => {
        return item.id !== id;
      });
      let salons = getState().fav.data.salons;
      after();
      dispatch(
        updateInfo({
          data: {
            salons: salons,
            showcases: showcases
          }
        })
      );
    } catch (e) {

    }
  };
};

export const deleteSalon = (id, after) => {
  return async (dispatch, getState) => {
    try {
      await Utils.getAxios(getState().account.token).post("fav/salon/delete", {
        id: id
      });
      let showcases = getState().fav.data.showcases;
      let salons = getState().fav.data.salons.filter(item => {
        return item.id !== id;
      });
      after();
      dispatch(
        updateInfo({
          data: {
            salons: salons,
            showcases: showcases
          }
        })
      );
    } catch (e) {

    }
  };
};

export const loadFavData = (force = false) => {
  return async (dispatch, getState) => {
    let loaded = getState().fav.loaded;
    if (loaded && !force) {
      return false;
    }
    if (!getState().account.token) {
      return false;
    }
    try {
      dispatch(
        updateInfo({
          fetching: true
        })
      );
      let rq = await Utils.getAxios(getState().account.token).post("fav/list");
      dispatch(
        updateInfo({
          data: rq.data,
          fetching: false,
          loaded: true
        })
      );
    } catch (e) {
      dispatch(
        updateInfo({
          fetching: false
        })
      );
    }
  };
};

export const setError = (title, msg) => {
  return {
    type: setError,
    message: msg,
    title: title
  };
};

export const clearError = () => {
  return {
    type: aclearError
  };
};

export const starFetching = () => {
  return {
    type: afetchingStart
  };
};

export const doneFetching = () => {
  return {
    type: afetchingDone
  };
};

export const updateInfo = info => {
  return {
    type: aupdateInfo,
    info: info
  };
};

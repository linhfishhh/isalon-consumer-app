import Utils from "../../configs";
import {
  aclearError,
  afetchingDone,
  afetchingStart,
  afetchingSearch
} from "./types";

export const updateRecentSearchState = state => {
  return {
    type: afetchingSearch,
    info: state
  };
};

export const getRecentSearch = () => {
  return async (dispatch, getState) => {
    try {
      if (!getState().account.token) {
        return false;
      }
      let rq = await Utils.getAxios(getState().account.token).get(
        "history/get"
      );
      dispatch(
        updateRecentSearchState({
          fetching: false,
          catsRecent: rq.data
        })
      );
    } catch (e) {
      dispatch(
        updateRecentSearchState({
          fetching: false
        })
      );
    }
  };
};

export const addRecentSearch = idSalon => {
  return async (dispatch, getState) => {
    if (!getState().account.token) {
      return false;
    }
    try {
      let rq = await Utils.getAxios(getState().account.token).post(
        "history/add",
        {
          Salon_id: idSalon
        }
      );
      dispatch(
        updateRecentSearchState({
          fetching: false
        })
      );
    } catch (e) {
    } finally {
      dispatch(
        updateRecentSearchState({
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

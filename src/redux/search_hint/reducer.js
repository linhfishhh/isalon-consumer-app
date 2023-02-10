import {aupdateInfo} from "./types";

const defaultState = {
  cats: [],
  services: [],
  salons: [],
  fetching: false
};

export default  (state = defaultState, action) => {
  switch (action.type) {
    case aupdateInfo:
      state = {
        ...state,
        ...action.info
      };
      break;
  }
  return state;
}
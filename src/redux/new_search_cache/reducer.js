import {aupdateInfo} from "./types";

const defaultState = {
    locations: {
        lv1: [],
        lv2: [],
    }
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
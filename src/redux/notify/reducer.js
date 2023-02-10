import {lFetchingDone, lFetchingStart, lResetData, lUpdateInfo} from "./types";

const defaultState = {
    fetching: false,
    count: 0,
    data: {
        items: [],
        isLast: false,
        currentPage: 0,
    }
};

export default  (state = defaultState, action) => {
    switch (action.type) {
        case lResetData:
            state = defaultState;
            break;
        case lFetchingStart:
            state = {
                ...state,
                fetching: true
            };
            break;
        case lFetchingDone:
            state = {
                ...state,
                fetching: false
            };
            break;
        case lUpdateInfo:
            state = {
                ...state,
                ...action.info
            };
            break;
    }
    return state;
}
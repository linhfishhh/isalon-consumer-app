import {aclearError, afetchingDone, afetchingStart, aResetData, asetError, aupdateInfo} from "./types";

const defaultState = {
    fetching: false,
    error: false,
    errorMessage: undefined,
    loaded: false,
    data: {
        total: 0,
        orders: []
    }
};

export default  (state = defaultState, action) => {
    switch (action.type) {
        case aResetData:
            state = defaultState;
            break;
        case afetchingStart:
            state = {
                ...state,
                fetching: true
            };
            break;
        case afetchingDone:
            state = {
                ...state,
                fetching: false
            };
            break;
        case asetError:
            state = {
                ...state,
                error: true,
                errorTitle: action.title,
                errorMessage: action.message
            };
            break;
        case aclearError:
            state = {
                ...state,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
            };
            break;
        case aupdateInfo:
            state = {
                ...state,
                ...action.info
            };
            break;
    }
    return state;
}
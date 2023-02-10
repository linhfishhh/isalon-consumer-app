import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";

const defaultState = {
    fetching: false,
    error: false,
    errorMessage: undefined,
    hasPermission: false,
    init: false,
    data: undefined,
    currentSelectedSalon: undefined
};

export default  (state = defaultState, action) => {
    switch (action.type) {
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
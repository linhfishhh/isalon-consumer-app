import {aclearError, afetchingDone, afetchingStart, asetError, afetchingSearch} from "./types";

const defaultState = {
    fetching: false,
    error: false,
    errorMessage: undefined,
    loaded: false,
    catsRecent: [],
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
        case afetchingSearch:
          state = {
            ...state,
            ...action.info
          };
            break;
    }
    return state;
}

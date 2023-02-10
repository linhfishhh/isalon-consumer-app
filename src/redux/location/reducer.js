import {lClearError, lFetchingDone, lFetchingStart, lSetError, lUpdateInfo} from "./types";

const defaultState = {
    fetching: false,
    error: false,
    errorMessage: undefined,
    errorTitle: undefined,
    lv1: [],
    lv1Title: undefined,
    lv1Value: undefined,
    lv2: [],
    lv2Title: undefined,
    lv2Value: undefined,
    lv3: [],
    lv3Title: undefined,
    lv3Value: undefined,
};

export default  (state = defaultState, action) => {
    switch (action.type) {
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
        case lSetError:
            state = {
                ...state,
                error: true,
                errorTitle: action.title,
                errorMessage: action.message
            };
            break;
        case lClearError:
            state = {
                ...state,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
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
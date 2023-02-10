import ImageSources from "../../styles/ImageSources";
import AsyncStorage from '@react-native-community/async-storage';
import {
    aCheckOldToken,
    aCheckToken, aClearError,
    aFetching, aFetchingDone,
    aFetchingStart,
    aLogin,
    alogout, aRegisterStepOne, aSetError, aUpdateInfo, aUpdateRegisterData, aUpdateRegisterDate,
    aUpdateStartupRoute,
    aUpdateToken, aVerifyToken
} from "./types";


const defaultState = {
    fetching: false,
    email: undefined,
    name: undefined,
    user_id: undefined,
    device_id: undefined,
    avatar: undefined,
    token: undefined,
    startupRoute: undefined,
    error: false,
    errorTitle: undefined,
    errorMessage: undefined,
    registerData: {
        avatar: undefined,
        phone: undefined,
        password: undefined,
        code: undefined,
        address: undefined,
        lv1: undefined,
        lv2: undefined,
        lv3: undefined,
    },
    temp: {
        joinTOS: undefined
    }
};

export default  (state = defaultState, action) => {
    switch (action.type) {
        case aFetchingStart:
            state = {
                ...state,
                fetching: true
            };
            break;
        case aFetchingDone:
            state = {
                ...state,
                fetching: false
            };
            break;
        case aSetError:
            state = {
                ...state,
                error: true,
                errorTitle: action.title,
                errorMessage: action.message
            };
            break;
        case aClearError:
            state = {
                ...state,
                error: false,
                errorTitle: undefined,
                errorMessage: undefined
            };
            break;
        case aUpdateStartupRoute:
            state = {
                ...state,
                startupRoute: action.route
            };
            break;
        case aUpdateToken:
            state = {
                ...state,
                token: action.token
            };
            break;
        case aUpdateInfo:
            state = {
                ...state,
                ...action.info
            };
            break;
        case alogout:
            state = defaultState;
            break;

        case aUpdateRegisterData:
            state = {
                ...state,
                registerData: {
                    ...state.registerData,
                    ...action.data
                }
            };
            break;
    }
    return state;
};

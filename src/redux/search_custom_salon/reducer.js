import {aupdateInfo} from "./types";
import Utils from "../../configs";

const defaultTabState = {
    loading: false,
    items: [],
    fetching: false,
};


export default  (state = defaultTabState, action) => {
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
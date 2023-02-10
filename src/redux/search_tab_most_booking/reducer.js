import {aupdateInfo} from "./types";
import Utils from "../../configs";

const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();

const defaultTabState = {
    loading: false,
    loading_more: false,
    loaded: false,
    result: {
        page: 0,
        total: 0,
        is_last_page: false,
        items: []
    }
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
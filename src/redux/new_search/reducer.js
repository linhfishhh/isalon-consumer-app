import {aupdateInfo} from "./types";
import Utils from "../../configs";

const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();

const defaultSearchConfigs = {
    search_type: search_types.salon,
    filters: defaultFilters,
    user_location_init: false,
    user_location_init_waiting: false,
    keyword: '',
};

const defaultState = {
    ...defaultSearchConfigs,
    user_location: {
        id: 0,
        name: 'Toàn quốc',
        lat: 0,
        lng: 0
    },
    search_location: {
        id: 0,
        name: 'Toàn quốc',
        lat: 0,
        lng: 0
    },
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
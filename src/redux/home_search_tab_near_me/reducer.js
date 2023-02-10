import {aupdateInfo} from "./types";
import Utils from "../../configs";

const defaultTabState = {
    loading: false,
    loading_more: false,
    loaded: false,
    init: false,
    result: {
        page: 0,
        total: 0,
        is_last_page: false,
        items: []
    },
    searchRadiusList: [
        1000,
    ],
    searchRadiusIndex: 0,
    showRadiusSelector: false,
    currentPosition: {
        address_lat: 0,
        address_lng: 0
    },
    showRadiusQuestion: false
};


export default  (state = defaultTabState, action) => {
    switch (action.type) {
        case aupdateInfo:{
            state = {
                ...state,
                ...action.info
            };
            break;
        }
    }
    return state;
}
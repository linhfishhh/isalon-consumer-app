import {aupdateInfo} from "./types";

export const updateSearchCacheState = (state) =>{
    return {
        type: aupdateInfo,
        info : state
    }
};
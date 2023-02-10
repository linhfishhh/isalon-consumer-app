import Utils from '../../configs'
import { aupdateInfo } from "./types";

export const updateSearchCustomSalonState = (state) => {
    return {
        type: aupdateInfo,
        info: state
    }
};

export const getResultSearchCustomSalon = () => {
    return async (dispatch, getState) => {
        let tab = getState().new_search_custom_salon;
        // if(!getState().account.token){
        //     return false;
        // }
        if (tab.loading) {
            return;
        }
        try {
            dispatch(updateSearchCustomSalonState({
                loading: true,
            }));
            let query = await Utils.getAxios(getState().account.token).post(
                'custom-list-salon',
                {
                  from_lat: getState().new_search.user_location.lat,
                  from_lng: getState().new_search.user_location.lng
                }
            );
            dispatch(updateSearchCustomSalonState({
                loading: false,
                items: query.data,
            }));
        }
        catch (e) {
            dispatch(updateSearchCustomSalonState({
                loading: false,
            }));
        }
    }
};

export const likeSalon = (id, afterThat) => {
    return async (dispatch, getState) => {
        let tab = getState().new_search_custom_salon;
        if (tab.fetching) {
            return;
        }
        try {
            dispatch(updateSearchCustomSalonState({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('salon/' + id + '/like');
            afterThat(rq.data);
        }
        catch (e) {
        }
        finally {
            dispatch(updateSearchCustomSalonState({
                fetching: false,
            }))
        }
    }
};


export const updateTopSalonNam = (salon_id, liked) => {
    return (dispatch, getState) => {
        if (getState().new_search_custom_salon.items === undefined) {
            return;
        }
        if (getState().new_search_custom_salon.items.length === 0) {
            return;
        }
        dispatch(updateSearchCustomSalonState({
            items: getState().new_search_custom_salon.items.map((item) => {
                return {
                    ...item,
                    salons: item.salons.map((salon) => {
                        if(salon.id !== salon_id){
                            return salon;
                        }
                        return {
                            ...salon,
                            liked: liked
                        }
                    })
                }
            })
        }));
    }
};

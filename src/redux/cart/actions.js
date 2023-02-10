import Utils from '../../configs';
import { aclearError, afetchingDone, afetchingStart, aupdateInfo } from "./types";
import { Alert } from "react-native";

export const setError = (title, msg) => {
    return {
        type: setError,
        message: msg,
        title: title
    }
};


export const createBooking = (cartInfo, after) => {
    return async (dispatch, getState) => {
        if (getState().cart.fetching) {
            return;
        }
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/create', {
                items: getState().cart.items.map(item => {
                    return {
                        id: item.id,
                        qty: item.qty,
                        option_id: item.option ? item.option.id : undefined
                    }
                }),
                salon_id: getState().cart.salonID,
                ...cartInfo
            });
            after(rq.data);
        }
        catch (e) {
            if (e.response) {
                if (e.response.status === 400) {
                    Alert.alert('iSalon', e.response.data.message);
                }
            }
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const addBooking = (after) => {
    return async (dispatch, getState) => {
        if (getState().cart.fetching) {
            return;
        }
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/add', {
                items: getState().cart.items.map(item => {
                    return {
                        id: item.id,
                        qty: item.qty,
                        option_id: item.option ? item.option.id : undefined
                    }
                }),
                salon_id: getState().cart.salonID
            });
            after(rq.data);
        }
        catch (e) {
            if (e.response) {
                if (e.response.status === 400) {
                    Alert.alert('iSalon', e.response.data.message);
                }
            }
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const updateBooking = (cartInfo, after) => {
    return async (dispatch, getState) => {
        if (getState().cart.fetching) {
            return;
        }
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('booking/update', {
                items: getState().cart.items.map(item => {
                    return {
                        id: item.id,
                        qty: item.qty,
                        option_id: item.option ? item.option.id : undefined
                    }
                }),
                ...cartInfo
            });
            after(rq.data);
        }
        catch (e) {
            if (e.response) {
                if (e.response.status === 400) {
                    Alert.alert('iSalon', e.response.data.message);
                }
            }
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const fetchItemsInfo = () => {
    return async (dispatch, getState) => {
        if (getState().cart.fetching) {
            return;
        }
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('cart/info', {
                items: getState().cart.items.map(item => {
                    return {
                        id: item.id,
                        qty: item.qty
                    }
                })
            });
        }
        catch (e) {

        }
        finally {
            dispatch(updateInfo({
                fetching: false,
            }))
        }
    }
};

export const getCartSaloninfo = (salonID) => {
    return async (dispatch, getState) => {
        if (getState().cart.fetching) {
            return;
        }
        let salonInfo = {};
        try {
            dispatch(updateInfo({
                fetching: true,
            }));
            let rq = await Utils.getAxios(getState().account.token).post('salon/' + salonID + '/info');
            salonInfo = rq.data;

        }
        catch (e) {

        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                salonInfo: salonInfo
            }))
        }
    }
};

export const addRemoveCartItem = (salonID, service, option = null, included_items = null) => {
    return (dispatch, getState) => {
        let add = true;
        let items = getState().cart.items;
        if (salonID !== getState().cart.salonID) {
            items = [];
        }
        getState().cart.items.every((item) => {
            if (item.id === service.id) {
                add = false;
                return false;
            }
            return item;
        });
        if (add) {
            items.push({
                id: service.id,
                qty: 1,
                price: !option ? service.priceRaw : option.final_price / 1000,
                name: service.name,
                time: service.time,
                option: option,
                included_items: included_items
            })
        } else {
            items = items.filter(item => {
                return item.id !== service.id;
            });
        }
        dispatch(updateInfo({
            items: items,
            salonID: salonID
        }));
    }
};

export const clearError = () => {
    return {
        type: aclearError,
    }
};

export const starFetching = () => {
    return {
        type: afetchingStart,
    }
};

export const doneFetching = () => {
    return {
        type: afetchingDone,
    }
};

export const updateInfo = (info) => {
    return {
        type: aupdateInfo,
        info: info
    }
};
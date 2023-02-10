import {aclearError, afetchingDone, afetchingStart, asetError, aupdateInfo} from "./types";

const defaultState = {
    fetching: false,
    error: false,
    errorMessage: undefined,
    items: [],
    salonID: undefined,
    salonInfo: {},
    inCart: function(id) { //Hàm kiểm tra id dịch vụ có trong giở hàng hay không?
        return this.items.findIndex(item => {
            return item.id === id;
        })> - 1;
    },
    getTotal: function () { //Hàm tính tổng số tiền dịch vụ trong giở hàng
        let rs = 0;
        this.items.every(item=>{
            rs += item.price * item.qty;
            if (item.included_items != null) {
                item.included_items.every(include=>{
                    rs += include.org_price / 1000;
                    return include;
                });
            }
            return item;
        });
        return rs;
    },
    screenBeforeCart: 'home',
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
        case aupdateInfo:
            state = {
                ...state,
                ...action.info
            };
            break;
    }
    return state;
}
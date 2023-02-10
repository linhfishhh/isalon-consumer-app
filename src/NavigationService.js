import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function navigator() {
    return _navigator;
}

function getCurrentRoute() {
    let index = _navigator.state.nav.index;
    let routes = _navigator.state.nav.routes;
    let rs = '';
    routes.every((item, iindex) => {
        if(iindex === index){
            rs = item;
        }
        return item;
    });
    return rs;
}

function goBack() {
    let back = NavigationActions.back();
    _navigator.dispatch(back);
}

function replace(route) {
    let back = NavigationActions.navigate({
        routeName: route
    });
    _navigator.dispatch(back);
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    navigator,
    getCurrentRoute,
    goBack,
    replace
};
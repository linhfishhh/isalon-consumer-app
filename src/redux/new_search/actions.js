import Utils from '../../configs'
import {aupdateInfo} from "./types";
import {PermissionsAndroid, Platform} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { updateDeviceUserIDTag } from '../../oneSignal';

const search_types = Utils.getSearchType();
const defaultFilters = Utils.getDefaultFilters();

export const updateSearchState = (state) =>{
    return {
        type: aupdateInfo,
        info : state
    }
};

export const getUserLocation = (afterDone = null) => {
    return async (dispatch, getState) => {
        let search = getState().new_search;
        let run = ()=>{
            return new Promise(async (resolve, reject) => {
                if (search.user_location.lat !== 0 || search.user_location.lng !== 0) {
                    return resolve(0);
                }
                try {
                    let granted = true;
                    if (Platform.OS === 'android') {
                        granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        //   {~
                        //       'title': 'Sử dụng dịch vụ định vị',
                        //       'message': 'Ứng dụng cần quyền sử dụng tính năng định vị để xác định được vị trí của bạn nhằm đưa ra các kết quả tìm kiếm cũng như gợi ý chính xác',
                        //   }
                        );
                        granted = granted === PermissionsAndroid.RESULTS.GRANTED
                    } else {
                        navigator.geolocation.requestAuthorization();
                    }

                    if (granted) {
                        await Geolocation.getCurrentPosition(
                            async (positionz) => {
                                dispatch(updateSearchState({
                                    user_location_init: true,
                                    user_location: {
                                        ...search.user_location,
                                        lat: positionz.coords.latitude,
                                        lng: positionz.coords.longitude,
                                    }
                                }));
                                await AsyncStorage.setItem('isalon:user_latitude', positionz.coords.latitude+'');
                                await AsyncStorage.setItem('isalon:user_longitude', positionz.coords.longitude+'');
                                return resolve(0);
                            },
                            (error) => {
                              return resolve(error.code);
                            },
                            {enableHighAccuracy: false, timeout: 25000, maximumAge: 3600000},
                        );
                    } else {
                        return resolve(1);
                    }
                } catch (err) {
                    return resolve(-3);
                }
            });
        };

        let rs = await run();
        if(rs){
            let latitude = await AsyncStorage.getItem('isalon:user_latitude');
            let longitude = await AsyncStorage.getItem('isalon:user_longitude');
            if(latitude && longitude){
                latitude = latitude * 1.0;
                longitude = longitude * 1.0;
                dispatch(updateSearchState({
                    user_location_init: true,
                    user_location: {
                        ...search.user_location,
                        lat: latitude,
                        lng: longitude,
                    }
                }));
            }
            rs = 0;
        }
        return  rs;
    }
};

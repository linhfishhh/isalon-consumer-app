import AsyncStorage from '@react-native-community/async-storage';
import {
  aClearError,
  aFetchingDone,
  aFetchingStart,
  alogout,
  aSetError,
  aUpdateInfo,
  aUpdateRegisterData,
  aUpdateStartupRoute,
  aUpdateToken
} from './types';
import Utils from '../../configs';
import OneSignal from 'react-native-onesignal';
import { aResetData as aResetFav } from '../fav/types';
import { aResetData as aResetHis } from '../history/types';
import { lResetData } from '../notify/types';
import { updateDeviceUserIDTag } from '../../oneSignal';
import { authService } from '../../shop/services';
import { removeToken } from '../../shop/utils/auth';

export const updateToken = token => {
  return {
    type: aUpdateToken,
    token: token
  };
};

export const loadSettings = async () => {
  try {
    let ls = await AsyncStorage.multiGet([
      '@iSalon:token',
      '@iSalon:welcomed',
      '@iSalon:startupRoute',
      '@iSalon:tabIndex'
    ]);
    let token = ls[0][1];
    let welcomed = ls[1][1];
    let startupRoute = ls[2][1];
    let tabIndex = ls[3][1];
    return Promise.resolve({
      token: token,
      welcomed: welcomed,
      startupRoute: startupRoute,
      tabIndex: tabIndex === null || tabIndex === undefined ? 0 : tabIndex * 1
    });
  } catch (e) {
    return Promise.reject({
      errorTitle: 'Lỗi không xác định',
      errorMessage:
        'Có lỗi xảy ra trong quá trình xử lý, vui lòng đóng app và thử lại'
    });
  }
};

export const saveAccountSettings = async settings => {
  try {
    await AsyncStorage.multiSet(settings);
  } catch (error) {
    return Promise.reject({
      title: 'Lỗi không xác định',
      message: 'Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại'
    });
  }
};

export const determineAccessRoute = async () => {
  let rs = 'home';
  try {
    let settings = await loadSettings();
    if (settings.startupRoute !== null) {
      rs = settings.startupRoute;
    }
  } catch (error) {
    rs = Promise.reject({
      title: 'Lỗi không xác định',
      message: 'Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại'
    });
  }
  return rs;
};

export const loginWithOldToken = () => {
  return async (dispatch, getState) => {
    let welcomed = '0';
    try {
      let settings = await loadSettings();
      welcomed = settings.welcomed;
      let userData = null;
      if (settings.token) {
        userData = await verifyToken(settings.token);
      }
      if (userData) {
        //let route = await determineAccessRoute();
        dispatch(
          updateInfo({
            ...userData,
            token: settings.token,
            tabIndex: settings.tabIndex
          })
        );
        await authService.login(userData.user_id);
        dispatch(updateStartupRoute('home'));
      } else {
        if (welcomed === '1') {
          dispatch(updateStartupRoute('new_login')); //access
        } else {
          dispatch(updateStartupRoute('new_login')); //welcome
        }
      }
    } catch (error) {
      dispatch(updateStartupRoute('new_login')); //welcome
    }
  };
};

export const updateStartupRoute = route => {
  return {
    type: aUpdateStartupRoute,
    route: route
  };
};

const verifyToken = async token => {
  try {
    let rq = Utils.getAxios(token);
    let rs = await rq.post('account/info');
    return Promise.resolve(rs.data);
  } catch (e) {
    if (e.response) {
      if (e.response.status === 500) {
        return Promise.reject('Lỗi xảy ra trong quá trình xử lý');
      }
    }
    return false;
  }
};

export const login = (username, password) => {
  return async (dispatch, getState) => {
    dispatch(clearError());
    dispatch(starFetching());
    try {
      let settings = await loadSettings();
      let api = await doLogin(username, password);
      let token = api.data.token;
      let user = api.data.user;
      await saveAccountSettings([['@iSalon:token', token]]);
      dispatch(
        updateInfo({
          ...user,
          token: token,
          tabIndex: settings.tabIndex
        })
      );
      dispatch(updateStartupRoute('home'));
    } catch (e) {
      dispatch(setError('Lỗi đăng nhập', e + ''));
    } finally {
      dispatch(doneFetching());
    }
  };
};

const doLogin = (username, password) => {
  return Utils.getAxios()
    .post('login', {
      username: username,
      password: password
    })
    .catch(function(e) {
      if (e.response.status === 401) {
        return Promise.reject(e.response.data.message);
      }
      return Promise.reject('Lỗi xảy ra trong quá trình xử lý');
    });
};

const loginV2 = (tokenFBAK, success, error) => {
  return async (dispatch, getState) => {
    dispatch(clearError());
    dispatch(starFetching());
    try {
      let settings = await loadSettings();
      let api = await doLoginV2(tokenFBAK, null, email, success, error);
      let token = api.data.login.token;
      let user = api.data.login.user;
      await saveAccountSettings([['@iSalon:token', token]]);
      await authService.login(user.user_id);
      dispatch(
        updateInfo({
          ...user,
          token: token,
          tabIndex: settings.tabIndex
        })
      );
      dispatch(updateStartupRoute('home')); //home-new_login-ask_noti_permission
      success(api.data);
    } catch (e) {
      dispatch(setError('Lỗi đăng nhập', e + ''));
    } finally {
      dispatch(doneFetching());
    }
  };
};

const doLoginV2 = (token, phone, email, success, error) => {
  return Utils.getAxios()
    .post('social/v3/login', {
      idToken: token,
      phone,
      email
    })
    .catch(function(e) {
      error(e.response);
      if (e.response.status === 401) {
        return Promise.reject(e.response.data.message);
      }
      return Promise.reject('Lỗi xảy ra trong quá trình xử lý');
    });
};

export const loginWithOldTokenV2 = (idToken, phone, email, success, error) => {
  return async (dispatch, getState) => {
    dispatch(clearError());
    dispatch(starFetching());
    try {
      let settings = await loadSettings();
      let api = await doLoginV2(idToken, phone, email, success, error);
      let token = api.data.login.token;
      let user = api.data.login.user;
      await saveAccountSettings([['@iSalon:token', token]]);
      dispatch(
        updateInfo({
          ...user,
          token: token,
          tabIndex: settings.tabIndex
        })
      );
      await authService.login(user.user_id);
      dispatch(updateStartupRoute('home')); //home-ask_noti_permission
      success(api.data);
    } catch (error) {
      error(error);
      dispatch(updateStartupRoute('new_login'));
    } finally {
      dispatch(doneFetching());
    }
  };
};

export const logout = () => {
  return async dispatch => {
    await saveAccountSettings([['@iSalon:token', '']]);
    await removeToken();
    dispatch({
      type: alogout
    });
    dispatch({
      type: aResetFav
    });
    dispatch({
      type: aResetHis
    });
    dispatch({
      type: lResetData
    });
    try {
      //OneSignal.setSubscription(false);
      await updateDeviceUserIDTag({
        user_id: 0
      });
    } catch (e) {}
  };
};

export const setError = (title, msg) => {
  return {
    type: aSetError,
    message: msg,
    title: title
  };
};

export const clearError = () => {
  return {
    type: aClearError
  };
};

export const starFetching = () => {
  return {
    type: aFetchingStart
  };
};

export const doneFetching = () => {
  return {
    type: aFetchingDone
  };
};

export const updateInfo = info => {
  return {
    type: aUpdateInfo,
    info: info
  };
};

export const registerStepOne = (phone, password, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await Utils.getAxios().post('register/check', {
        phone: phone,
        password: password
      });
      dispatch(
        updateRegisterData({
          phone: phone,
          password: password
        })
      );
      //navigation.navigate('verify_phone')
      dispatch(sendPhoneVerify(phone, navigation));
    } catch (e) {
      dispatch(
        setError(
          'Lỗi đăng ký',
          e.response.status === 422
            ? Utils.getValidationMessage(e.response)
            : e.response.status === 400
            ? e.response.data.message
            : 'Lỗi khi xác nhận số điện thoại hoặc emnail'
        )
      );
      dispatch(doneFetching());
    }
  };
};

const requestNewPhoneVerify = phone => {
  return Utils.getAxios().post('verify-phone', {
    phone: phone
  });
};

export const resendPhoneVerify = phone => {
  return async dispatch => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await requestNewPhoneVerify(phone);
    } catch (e) {
      dispatch(
        setError(
          'Lỗi đăng ký',
          e.response.status === 400
            ? e.response.data.message
            : 'Có lỗi xảy ra trong quá trình gửi mã xác nhận'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const sendPhoneVerify = (phone, navigation) => {
  return async dispatch => {
    try {
      await requestNewPhoneVerify(phone);
      navigation.navigate('verify_phone');
    } catch (e) {
      dispatch(
        setError(
          'Lỗi đăng ký',
          e.response.status === 400
            ? e.response.data.message
            : 'Có lỗi xảy ra trong quá trình gửi mã xác nhận'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyPhoneCode = (phone, code) => {
  return Utils.getAxios().post('verify-phone-code', {
    phone: phone,
    code: code
  });
};

export const registerStepTwo = (phone, code, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyPhoneCode(phone.trim(), code.trim());
      dispatch(
        updateRegisterData({
          code: code
        })
      );
      navigation.navigate('new_user_step_one');
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 400
            ? e.response.data.message
            : 'Có lỗi xảy ra trong quá trình xác nhận mã'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyInfoStepOne = (name, email) => {
  return Utils.getAxios().post('verify-personal-info-step-one', {
    name: name,
    email: email
  });
};

export const registerStepThree = (name, email, avatar, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyInfoStepOne(name, email);
      dispatch(
        updateRegisterData({
          name: name,
          email: email,
          avatar: avatar
        })
      );
      navigation.navigate('agreement');
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 422
            ? Utils.getValidationMessage(e.response)
            : 'Có lỗi xảy ra trong quá trình xử lý thông tin cá nhân'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyStepTwo = (address, lv1, lv2, lv3) => {
  return Utils.getAxios().post('verify-personal-info-step-two', {
    address: address,
    lv1: lv1,
    lv2: lv2,
    lv3: lv3
  });
};

export const registerStepFinal = (address, lv1, lv2, lv3, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyStepTwo(address, lv1, lv2, lv3);
      dispatch(
        updateRegisterData({
          address: address,
          lv1: lv1,
          lv2: lv2,
          lv3: lv3
        })
      );
      navigation.navigate('agreement');
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 422
            ? Utils.getValidationMessage(e.response)
            : 'Lỗi khi xác nhận địa chỉ'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requrestJoinTOS = () => {
  return Utils.getAxios().post('get-join-tos');
};

export const updateJoinTOS = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      let rq = await requrestJoinTOS();
      let html = rq.data;
      dispatch(
        updateInfo({
          temp: {
            joinTOS: html
          }
        })
      );
    } catch (e) {
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestCreateAccount = data => {
  let form = new FormData();
  for (let name in data) {
    if (data[name] !== undefined) {
      form.append(name, data[name]);
    }
  }
  return Utils.getAxios(undefined, {
    'Content-Type': 'multipart/form-data'
  }).post('account/create', form);
};

export const createAccount = navigation => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      let rq = await requestCreateAccount(getState().account.registerData);
      let token = rq.data.token;
      let user = rq.data.user;
      await saveAccountSettings([['@iSalon:token', token]]);
      let route = await determineAccessRoute();
      dispatch(
        updateInfo({
          ...user,
          token: token
        })
      );
      dispatch(updateStartupRoute(route));
    } catch (e) {
      //Alert.alert('Lỗi trong quá trình hoàn tất đăng ký');
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestResetPassword = username => {
  return Utils.getAxios().post('account/reset-password', {
    username: username
  });
};

export const resetPassswordStepOne = (username, navigation) => {
  return async dispatch => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      let rq = await requestResetPassword(username);
      let phone = rq.data;
      navigation.navigate('reset_pass_verify', {
        phone: phone
      });
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 422
            ? Utils.getValidationMessage(e.response)
            : e.response.status === 400
            ? e.response.data.message
            : 'Lỗi khi xác nhận số điện thoại hoặc emnail'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

export const resetPassswordStepTwo = (phone, code, navigation) => {
  return async dispatch => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyPhoneCode(phone, code);
      navigation.navigate('new_pass', {
        phone: phone,
        code: code
      });
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 400
            ? e.response.data.message
            : 'Có lỗi xảy ra trong quá trình xác nhận mã'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestNewPassword = (phone, code, password, cpassword) => {
  return Utils.getAxios().post('account/new-password', {
    phone: phone,
    code: code,
    password: password,
    password_confirmation: cpassword
  });
};

export const resetPassswordStepThree = (
  phone,
  code,
  password,
  cpassword,
  navigation
) => {
  return async dispatch => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await requestNewPassword(phone, code, password, cpassword);
      dispatch(
        updateInfo({
          resetPasswordDone: true
        })
      );
    } catch (e) {
      dispatch(
        setError(
          'Lỗi xác nhận',
          e.response.status === 422
            ? Utils.getValidationMessage(e.response)
            : 'Lỗi khi khởi tạo mật khẩu'
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const updateRegisterData = data => {
  return {
    type: aUpdateRegisterData,
    data: data
  };
};

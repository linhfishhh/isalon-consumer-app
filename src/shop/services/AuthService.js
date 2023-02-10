import _ from 'lodash';
import * as DeviceInfo from 'react-native-device-info';
import APIService from './APIService';
import { TENANT_ID } from '../constants';
import { saveToken, removeToken } from '../utils/auth';

export default class AuthService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  async login(userId) {
    const deviceId = DeviceInfo.getUniqueID();
    const loginParams = {
      tenantId: TENANT_ID,
      grantType: 'password',
      password: 'iSalon@072019',
      profileType: 'CONSUMER',
      externalId: userId,
      uuid: deviceId,
    };
    try {
      await removeToken();
      const result = await this.apiService.post('/user/login', loginParams);
      const accessToken = _.get(result, 'data.data.access_token');
      await saveToken(accessToken);
      return result;
    } catch (e) {
      // TODO
    }
    return undefined;
  }

  async logout() {
    return this.apiService.post('/user/logout');
  }
}

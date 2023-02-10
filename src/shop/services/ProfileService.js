// import _ from 'lodash';
// import * as DeviceInfo from 'react-native-device-info';
import APIService from './APIService';
// import { TENANT_ID } from '../constants';
// import { saveToken } from '../utils/auth';

export default class ProfileService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  async getProvinceList() {
    return this.apiService.get('/address/get-all-provinces');
  }

  async getDistrictList(provinceId) {
    return this.apiService.get('/address/get-all-districts', { provinceId });
  }

  async getCommuneList(districtId) {
    return this.apiService.get('/address/get-all-communes', { districtId });
  }

  async addAddress(payload) {
    // private String description;
    // private Long communeId;
    // private String name;
    // private String phone;
    // private Boolean isDefault;
    return this.apiService.post('/profile/address', payload);
  }

  async updateAddress(payload) {
    return this.apiService.put('/profile/address', payload);
  }

  async removeAddress(addressId) {
    return this.apiService.delete('/profile/address', { addressId });
  }

  async getMyAddresses() {
    return this.apiService.get('/profile/get-all-addresses');
  }
}

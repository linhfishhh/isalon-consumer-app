import axios from 'axios';
import _get from 'lodash/get';
// import {
//   NEW_API_END_POINT,
// } from 'react-native-dotenv';
import { getToken, isAuthenticated } from '../utils/auth';
import { TENANT_ID } from '../constants';

// const NETWORK_MESSAGE = 'Network error, please check your connection';
// const USER_NOTFOUND = 'User not found';
// const INVALID_USER_OR_PASSWORD = 'Invalid user or password';
// const INTERNAL_SERVER_ERROR = 'Internal server error';

// const DEFAULT_CONFIG = {
//   baseURL: NEW_API_END_POINT,
// };

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export default class APIService {
  constructor(cfg) {
    const service = axios.create(cfg);
    service.interceptors.request.use(this.handleRefreshToken);
    service.interceptors.response.use(
      this.handleRequestSuccess,
      this.handleRequestError,
    );
    this.service = service;
  }

  handleRefreshToken = async (config) => config;

  handleRequestSuccess = (response) => {
    if (_get(response, 'data.error', null)) {
      return Promise.reject(response.data.error);
    }
    return response;
  };

  handleRequestError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          break;
        case HTTP_STATUS.NOT_FOUND:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  };

  async get(url, params = {}, config = {}) {
    const { headers = {}, ...restConfig } = config;
    return this.executeRequest(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID,
        ...headers,
      },
      ...restConfig,
      params,
    });
  }

  async post(url, data = {}, config = {}) {
    const { headers = {}, ...restConfig } = config;

    return this.executeRequest(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID,
        ...headers,
      },
      ...restConfig,
      data,
    });
  }

  async put(url, data = {}, config = {}) {
    const { headers = {}, ...restConfig } = config;

    return this.executeRequest(url, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID,
        ...headers,
      },
      ...restConfig,
      data,
    });
  }

  async patch(url, data = {}, config = {}) {
    return this.executeRequest(url, { method: 'patch', ...config, data });
  }

  async delete(url, params = {}, config = {}) {
    const { headers = {}, ...restConfig } = config;

    return this.executeRequest(url, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID,
        ...headers,
      },
      ...restConfig,
      params,
    });
  }

  async executeRequest(url, config) {
    const authConfig = {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    };

    const finalHeaderConfig = await isAuthenticated()
      ? { ...config.headers, ...authConfig.headers }
      : config.headers;

    const finalConfig = {
      url,
      ...config,
      headers: { ...finalHeaderConfig },
    };

    return this.service.request(finalConfig);
  }
}

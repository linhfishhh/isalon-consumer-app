import axios from 'axios';
import Colors from './styles/Colors';
import {
  GOOGLE_MAPS_API_KEY,
  ONESIGNAL_APP_ID,
  API_END_POINT
} from 'react-native-dotenv';

export default {
  googleMapApiKey: GOOGLE_MAPS_API_KEY,

  oneSignalAppID: ONESIGNAL_APP_ID,

  getAxios: (token = undefined, headers = {}) => {
    let rs = axios.create({
      baseURL: API_END_POINT,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Authorization: token !== undefined ? 'Bearer ' + token : '',
        ...headers
      }
    });
    return rs;
  },
  getValidationMessage: response => {
    let rs = '';
    let i = 0;
    for (let name in response.data.errors) {
      if (i > 0) {
        rs += '\n';
      }
      rs += '■ ' + response.data.errors[name][0];
      i++;
    }
    return rs;
  },

  getBookingStatus: status => {
    let name = '';
    let color = '';
    let text = '';
    switch (status) {
      case -3:
        color = Colors.SILVER;
        name = 'block';
        text = 'Huỷ do quá hạn xử lý';
        break;
      case -2:
        color = Colors.SILVER;
        name = 'block';
        text = 'Huỷ bởi salon';
        break;
      case -1:
        color = Colors.SILVER;
        name = 'block';
        text = 'Huỷ bởi khách';
        break;
      case 0:
        color = '#ff931f';
        name = 'schedule';
        text = 'Chờ salon duyệt';
        break;
      case 1:
        color = Colors.PRIMARY;
        name = 'timer';
        text = 'Chờ thanh toán';
        break;
      case 2:
        color = Colors.ERROR;
        name = 'date-range';
        text = 'Chờ thực hiện';
        break;
      case 3:
        color = 'green';
        name = 'check-circle';
        text = 'Đã hoàn thành';
        break;
      case 4:
        color = Colors.SILVER;
        name = 'highlight-off';
        text = 'Vắng mặt';
        break;
    }
    return {
      text: text,
      name: name,
      color: color
    };
  },

  getSearchType: () => {
    return {
      service: {
        slug: 'service',
        placeholder: 'Nhập dịch vụ bạn quan tâm...',
        title: 'Tìm dịch vụ'
      },
      salon: {
        slug: 'salon',
        placeholder: 'Nhập tên salon bạn cần tìm...',
        title: 'Tìm salon'
      }
    };
  },

  getDefaultFilters: () => {
    return {
      cat: [],
      price_from: -5000,
      price_to: 5005000,
      local: {
        id: 0,
        name: 'Tất cả quận huyện'
      },
      sale_off: false,
      rating: 0
    };
  },

  getRadiusList: () => {
    return [1000, 1500, 2000];
  }
};

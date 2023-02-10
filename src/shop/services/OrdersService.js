import APIService from './APIService';
import { DEFAULT_PAGE_SIZE } from '../constants';

export default class OrdersService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  getOrderHistory(orderStatus, page, limit = DEFAULT_PAGE_SIZE) {
    return this.apiService.get('/orders', { orderStatus, page, limit });
  }

  cancelOrders(data) {
    return this.apiService.post('/orders/cancel', data);
  }
}

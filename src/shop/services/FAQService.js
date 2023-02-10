import APIService from './APIService';
import { DEFAULT_PAGE_SIZE } from '../constants';

export default class FAQService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  getAllFAQ(productId, page, limit = DEFAULT_PAGE_SIZE) {
    return this.apiService.get('/questions', { productId, page, limit });
  }

  addFAQ(data) {
    return this.apiService.post('/questions', data);
  }
}

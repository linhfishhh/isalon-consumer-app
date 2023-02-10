import APIService from './APIService';
import { DEFAULT_PAGE_SIZE } from '../constants';

export default class ReviewService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  getAllReview(productId, page, limit = DEFAULT_PAGE_SIZE) {
    return this.apiService.get('/product-reviews', { productId, page, limit });
  }

  addReview(data) {
    return this.apiService.post('/product-reviews/create', data);
  }

  likeReview(id) {
    return this.apiService.post(`/product-reviews/${id}/like`);
  }

  unlikeReview(id) {
    return this.apiService.post(`/product-reviews/${id}/unlike`);
  }

  likeReply(id) {
    return this.apiService.post(`/product-review-messages/${id}/like`);
  }

  unlikeReply(id) {
    return this.apiService.post(`/product-review-messages/${id}/unlike`);
  }

  updateFavorite(productId, favorited) {
    if (favorited) {
      return this.apiService.post(`/favorite/${productId}`);
    }
    return this.apiService.delete(`/favorite/${productId}`);
  }

  fetchAllFavorited = async (page, limit = DEFAULT_PAGE_SIZE) => this.apiService.get('/favorite', { page, limit })
}

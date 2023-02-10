import APIService from './APIService';
import { DEFAULT_PAGE_SIZE } from '../constants';

export default class ShopService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  getSuggestionKeywords = async (keyword) => this.apiService.get('search/suggestion-keywords', { keyword });

  getSuggestionProducts = async (params) => this.apiService.get('products/suggested-products', params);

  getSearchHistory = async () => this.apiService.get('search/latest');

  clearSearchHistory = async () => this.apiService.delete('search');

  getHotKeywords = async () => this.apiService.get('search/hot');

  findProducts = async (keyword, options, page, limit = DEFAULT_PAGE_SIZE) => this.apiService.get('products/find-by-keyword', {
    keyword,
    page,
    limit,
    ...options
  });

  fetchFilterOptions = async () => this.apiService.get('search/filter-fields');
}

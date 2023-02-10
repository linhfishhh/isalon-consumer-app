import APIService from './APIService';
import { DEFAULT_PAGE_SIZE } from '../constants';

export default class ShopService {
  constructor(apiService = new APIService()) {
    this.apiService = apiService;
  }

  getSpotlightItems = async () => this.apiService.get('spotlights/home');

  getAllProducts = async (page, limit = DEFAULT_PAGE_SIZE) => this.apiService.get('products/all', { page, limit });

  getProductsForCategory = async (categoryId, page, limit = DEFAULT_PAGE_SIZE) => this.apiService.get('products/find', {
    categoryId,
    page,
    limit
  });

  getProductDetail = async (productId) => this.apiService.get(`products/${productId}/details`);

  getProductVariants = async (productId, valueIds) => this.apiService.get(
    `products/${productId}/product-variants/all`,
    { variantValueIds: valueIds }
  );

  getAllProductVariants = async (productId) => this.apiService.get(`products/${productId}/product-variants`);

  getProductVariantValues = async (productId) => this.apiService.get(`products/${productId}/variant-values`);

  getCart = async () => this.apiService.get('cart');

  getCartQuantity = async () => this.apiService.get('cart/quantity');

  addProductsToCart = async (payload) => this.apiService.post('cart/add-products', {
    cartItems: payload
  });

  removeProductFromCart = async (payload) => this.apiService.post('cart/remove-product', payload)

  getPublicGiftCodes = async () => this.apiService.get('gift-codes/all-public');

  prepayOrder = async (payload) => this.apiService.post('orders/pre-pay', payload)

  payOrder = async (payload) => this.apiService.post('orders/pay', payload)

  updateCartItem = async (payload) => this.apiService.post('cart/update-item', payload)

  deleteCartItems = async (cartItemIds) => this.apiService.delete('cart/remove-items', { cartItemIds })

  getCurrentFlashSaleInfo = async () => this.apiService.get('flash-sales/current')

  getFlashSaleProducts = async (params) => this.apiService.get('flash-sales/all-products', { ...params })

  findAllProducts = async (params) => this.apiService.get('products/all', { ...params });
}

import {
  NEW_API_END_POINT,
} from 'react-native-dotenv';
import APIService from './APIService';
import AuthService from './AuthService';
import ShopService from './ShopService';
import ProfileService from './ProfileService';
import SearchService from './SearchService';
import ImageService from './ImageService';
import OrdersService from './OrdersService';
import ReviewService from './ReviewService';
import FAQService from './FAQService';

const uaaApiService = new APIService({
  baseURL: `${NEW_API_END_POINT}/uaa`
});

const shopApiService = new APIService({
  baseURL: `${NEW_API_END_POINT}/shop`
});

const profileApiService = new APIService({
  baseURL: `${NEW_API_END_POINT}/profile`
});

const storageApiService = new APIService({
  baseURL: `${NEW_API_END_POINT}/storage`
});

const authService = new AuthService(uaaApiService);
const shopService = new ShopService(shopApiService);
const profileService = new ProfileService(profileApiService);
const searchService = new SearchService(shopApiService);
const imageService = new ImageService(storageApiService);
const reviewService = new ReviewService(shopApiService);
const ordersService = new OrdersService(shopApiService);
const faqService = new FAQService(shopApiService);

export {
  authService,
  shopService,
  profileService,
  searchService,
  imageService,
  ordersService,
  reviewService,
  faqService
};

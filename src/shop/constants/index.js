import Layout from './Layout';
import Colors from './Colors';
import CommonStyles from './CommonStyles';

const DEFAULT_PAGE_SIZE = 10;
const TENANT_ID = 'isalon';
const SpotlightTypes = {
  banner: 'banner',
  flashSale: 'flashsale',
  category: 'category',
  newProduct: 'newProduct',
  hotSale: 'bestSelling',
  targeted: 'targetedProduct',
  search: 'search',
};

const ErrorTypes = {
  internal: 'internal',
  connection: 'connection',
  missingAddress: 'address',
  invalidGiftCode: 'gift',
};

const SortType = {
  PRICE: 'PRICE',
  HOT_ORDER: 'HOT_ORDER',
  HOT_SALE: 'HOT_SALE',
  HOT_REVIEW: 'HOT_REVIEW',
  NEW_PRODUCT: 'NEW_PRODUCT',
};

export {
  Layout, Colors, CommonStyles, DEFAULT_PAGE_SIZE, TENANT_ID, SpotlightTypes, ErrorTypes, SortType
};

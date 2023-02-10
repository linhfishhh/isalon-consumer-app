/* eslint-disable func-names */
import React from 'react';
import moment from 'moment';
import 'moment/src/locale/vi';
import { NEW_API_END_POINT } from 'react-native-dotenv';
import _ from 'lodash';
/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
// eslint-disable-next-line no-extend-native
Number.prototype.format = function (n, x, s, c) {
  const re = `\\d(?=(\\d{${x || 3}})+${n > 0 ? '\\D' : '$'})`;
  // eslint-disable-next-line no-bitwise
  const num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    `$&${s || ','}`
  );
};

export function formatCurrency(amount) {
  if (amount !== undefined && amount != null) {
    return `${amount.format(0, 3, '.', ',')} ₫`;
  }
  return amount;
}

export function formatDecimal(amount) {
  if (amount !== undefined && amount != null) {
    return `${amount.format(0, 3, '.', ',')}`;
  }
  return amount;
}

export function getThumbImageUrl(imageId, size) {
  if (!size) {
    // eslint-disable-next-line no-param-reassign
    size = 256;
  }
  return `${NEW_API_END_POINT}/storage/images/${imageId}/get?size=${size}`;
}

export function getImageUrl(imageId) {
  return `${NEW_API_END_POINT}/storage/images/${imageId}/get`;
}

export function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = React.useRef();

  React.useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        // console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

export function getProductPrice(product, productVariant) {
  const variant = productVariant || _.get(product, 'defaultProductVariant') || product;
  const oldPrice = _.get(variant, 'price.originRetailPrice');
  const flashSaleVariant = _.get(variant, 'flashSaleProductVariant') || _.get(variant, 'flashSaleProduct');
  const newPrice = _.get(flashSaleVariant || variant, 'price.retailPrice');
  const discount = oldPrice > 0 ? Math.floor(((oldPrice - newPrice) * 100) / oldPrice) : 0;
  return {
    oldPrice,
    newPrice,
    discount
  };
}

export function datetimeFormat(time, format = 'DD-MM-YYYY HH:mm:ss') { return moment.utc(time).local().format(format); }

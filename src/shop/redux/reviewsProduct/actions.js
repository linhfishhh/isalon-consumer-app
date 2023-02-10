import _ from 'lodash';
import { createSideEffectAction } from '../../utils/reduxHelper';

import { reviewService, imageService } from '../../services';

import {
  GET_REVIEW_LIST, ADD_REVIEW, LIKE_REVIEW, UNLIKE_REVIEW, LIKE_REPLY, UNLIKE_REPLY
} from './types';

export const [
  getReviewListBegin,
  getReviewListSuccess,
  getReviewListFail,
  getReviewListEnd
] = createSideEffectAction(GET_REVIEW_LIST);

export const [
  addReviewBegin,
  addReviewSuccess,
  addReviewFail,
  addReviewEnd
] = createSideEffectAction(ADD_REVIEW);

export const [
  likeReviewBegin,
  likeReviewSuccess,
  likeReviewFail,
  likeReviewEnd
] = createSideEffectAction(LIKE_REVIEW);

export const [
  unlikeReviewBegin,
  unlikeReviewSuccess,
  unlikeReviewFail,
  unlikeReviewEnd
] = createSideEffectAction(UNLIKE_REVIEW);

export const [
  likeReplyBegin,
  likeReplySuccess,
  likeReplyFail,
  likeReplyEnd
] = createSideEffectAction(LIKE_REPLY);

export const [
  unlikeReplyBegin,
  unlikeReplySuccess,
  unlikeReplyFail,
  unlikeReplyEnd
] = createSideEffectAction(UNLIKE_REPLY);

export function getAllReview(productId, refreshing = false, page = 0) {
  return async (dispatch) => {
    try {
      dispatch(getReviewListBegin({ refreshing }));
      const result = await reviewService.getAllReview(productId, page);
      dispatch(getReviewListSuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        getReviewListFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(getReviewListEnd());
    }
  };
}

export function addReview(data, callback) {
  return async (dispatch) => {
    try {
      dispatch(addReviewBegin());
      if (data.images.length) {
        const imageResponse = await imageService.createCollectionImage('products-review', data.images);
        const id = _.get(imageResponse.data, 'data.collectionId');
        if (id) {
          _.set(data, 'imageCollectionId', id);
        }
      }
      const dataRequest = _.clone(data);
      _.unset(dataRequest, 'images');

      const result = await reviewService.addReview(dataRequest);
      dispatch(addReviewSuccess({ ...result.data }));
      if (callback) {
        callback();
      }
    } catch (e) {
      if (callback) {
        callback();
      }
      dispatch(
        addReviewFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(addReviewEnd());
    }
  };
}


export function likeReview(id) {
  return async (dispatch) => {
    try {
      dispatch(likeReviewBegin());
      const result = await reviewService.likeReview(id);
      dispatch(likeReviewSuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        likeReviewFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(likeReviewEnd());
    }
  };
}


export function unlikeReview(id) {
  return async (dispatch) => {
    try {
      dispatch(unlikeReviewBegin());
      const result = await reviewService.unlikeReview(id);
      dispatch(unlikeReviewSuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        unlikeReviewFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(unlikeReviewEnd());
    }
  };
}


export function likeReply(id) {
  return async (dispatch) => {
    try {
      dispatch(likeReplyBegin());
      const result = await reviewService.likeReply(id);
      dispatch(likeReplySuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        likeReplyFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(likeReplyEnd());
    }
  };
}


export function unlikeReply(id) {
  return async (dispatch) => {
    try {
      dispatch(unlikeReplyBegin());
      const result = await reviewService.unlikeReply(id);
      dispatch(unlikeReplySuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        unlikeReplyFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(unlikeReplyEnd());
    }
  };
}

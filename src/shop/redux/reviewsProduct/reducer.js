/* eslint-disable no-param-reassign */
import produce from 'immer';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_REVIEW_LIST_BEGIN,
  GET_REVIEW_LIST_SUCCESS,
  GET_REVIEW_LIST_FAIL,
  LIKE_REVIEW_SUCCESS,
  LIKE_REVIEW_FAIL,
  UNLIKE_REVIEW_SUCCESS,
  UNLIKE_REVIEW_FAIL,
  LIKE_REPLY_SUCCESS,
  LIKE_REPLY_FAIL,
  UNLIKE_REPLY_SUCCESS,
  UNLIKE_REPLY_FAIL
} from './types';

export const initialState = {
  loading: true,
  reviewList: [],
  paging: {}
};

function updateLikeStatusReview(reviews, likeStatus) {
  const result = reviews.map((element) => {
    if (element.productReviewId === likeStatus.productReviewId) {
      if (likeStatus.isLiked) {
        _.set(element, 'numLikes', element.numLikes + 1);
      } else {
        _.set(element, 'numLikes', element.numLikes - 1);
      }
      _.set(element, 'isLiked', likeStatus.isLiked);
    }
    return element;
  });
  return result;
}

function updateLikeStatusReply(reviews, likeStatus) {
  const result = reviews.map((element) => {
    const reply = element.productReviewMessage;
    if (reply && reply.productReviewMessageId === likeStatus.productReviewMessageId) {
      if (likeStatus.isLiked) {
        _.set(element.productReviewMessage, 'numLikes', reply.numLikes + 1);
      } else {
        _.set(element.productReviewMessage, 'numLikes', reply.numLikes - 1);
      }
      _.set(element.productReviewMessage, 'isLiked', likeStatus.isLiked);
    }
    return element;
  });
  return result;
}


const reviewsProductReducer = {
  [GET_REVIEW_LIST_BEGIN]: (state, action) => produce(state, (draft) => {
    const refreshing = _.get(action, 'payload.refreshing', false);
    if (refreshing) {
      draft.loading = true;
    }
  }),
  [GET_REVIEW_LIST_SUCCESS]: (state, action) => produce(state, (draft) => {
    const pageNumber = _.get(action, 'payload.data.pageable.pageNumber');
    if (!pageNumber) {
      draft.reviewList = _.get(action, 'payload.data.content');
    } else {
      draft.reviewList = [
        ...state.reviewList,
        ..._.get(action, 'payload.data.content')
      ];
    }
    draft.loading = false;
    draft.paging = _.get(action, 'payload.data');
    _.unset(draft.paging, 'content');
    draft.error = {};
  }),
  [GET_REVIEW_LIST_FAIL]: (state, action) => produce(state, (draft) => {
    draft.loading = false;
    draft.error = _.get(action, 'payload');
  }),
  [LIKE_REVIEW_FAIL]: (state, action) => produce(state, (draft) => {
    draft.error = _.get(action, 'payload');
  }),
  [UNLIKE_REVIEW_FAIL]: (state, action) => produce(state, (draft) => {
    draft.error = _.get(action, 'payload');
  }),
  [LIKE_REPLY_FAIL]: (state, action) => produce(state, (draft) => {
    draft.error = _.get(action, 'payload');
  }),
  [UNLIKE_REPLY_FAIL]: (state, action) => produce(state, (draft) => {
    draft.error = _.get(action, 'payload');
  }),
  [LIKE_REVIEW_SUCCESS]: (state, action) => produce(state, (draft) => {
    const likeStatus = _.get(action, 'payload.data');
    draft.reviewList = updateLikeStatusReview(draft.reviewList, likeStatus);
    draft.error = {};
  }),
  [UNLIKE_REVIEW_SUCCESS]: (state, action) => produce(state, (draft) => {
    const likeStatus = _.get(action, 'payload.data');
    draft.reviewList = updateLikeStatusReview(draft.reviewList, likeStatus);
    draft.error = {};
  }),
  [LIKE_REPLY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const likeStatus = _.get(action, 'payload.data');
    draft.reviewList = updateLikeStatusReply(draft.reviewList, likeStatus);
    draft.error = {};
  }),
  [UNLIKE_REPLY_SUCCESS]: (state, action) => produce(state, (draft) => {
    const likeStatus = _.get(action, 'payload.data');
    draft.reviewList = updateLikeStatusReply(draft.reviewList, likeStatus);
    draft.error = {};
  }),
};

export default handleActions(
  {
    ...reviewsProductReducer
  },
  initialState
);

import React, { useCallback } from 'react';
import {
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';

import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import EvaluationContent from './EvaluationContent';
import { CommonStyles } from '../../constants';

import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';

import {
  getAllReview,
  likeReview as likeReviewAction,
  unlikeReview as unlikeReviewAction,
  likeReply as likeReplyAction,
  unlikeReply as unlikeReplyAction
} from '../../redux/reviewsProduct/actions';

function ProductEvaluation(props) {
  const {
    navigation,
    getReviewList,
    reviewList,
    paging,
    likeReview,
    unlikeReview,
    likeReply,
    unlikeReply
  } = props;

  const product = navigation.getParam('product');

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onLoadmore = () => {
    if (!paging.last && product) {
      getReviewList(product.productId, false, paging.pageable.pageNumber + 1);
    }
  };

  const handleLikeReview = async (id) => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      likeReview(id);
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };
  const handleUnlikeReview = async (id) => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      unlikeReview(id);
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };
  const handleLikeReply = async (id) => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      likeReply(id);
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };
  const handleUnlikeReply = async (id) => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      unlikeReply(id);
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  return (
    <MainContainer
      hasNavigationBackground={false}
      style={CommonStyles.main_container_white}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title="Đánh giá & Nhận xét"
        onClose={goBack}
      />
      <EvaluationContent
        navigation={navigation}
        product={product}
        reviews={reviewList}
        likeReivew={handleLikeReview}
        unlikeReview={handleUnlikeReview}
        likeReply={handleLikeReply}
        unlikeReply={handleUnlikeReply}
        onLoadmore={onLoadmore}
      />
    </MainContainer>
  );
}


export default connect(
  (state) => ({
    reviewList: state.shopReviews.reviewList,
    paging: state.shopReviews.paging,
  }), {
    getReviewList: getAllReview,
    likeReview: likeReviewAction,
    unlikeReview: unlikeReviewAction,
    likeReply: likeReplyAction,
    unlikeReply: unlikeReplyAction,
  }
)(ProductEvaluation);

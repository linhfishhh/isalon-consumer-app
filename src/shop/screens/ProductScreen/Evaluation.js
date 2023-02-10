import React, { memo, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';
import TextButton from '../../components/TextButton';
import styles from './styles';
import SectionTitle from '../../components/SectionTitle';
import Separator from '../../components/Separator';
import EvaluationContent from '../ProductEvaluation/EvaluationContent';

import {
  likeReview as likeReviewAction,
  unlikeReview as unlikeReviewAction,
  likeReply as likeReplyAction,
  unlikeReply as unlikeReplyAction
} from '../../redux/reviewsProduct/actions';

import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';
import WAAlert from '../../../components/WAAlert';

import icEdit from '../../../assets/images/shop/ic_edit_button.png';

function Evaluation(props) {
  const {
    style,
    onPress,
    navigation,
    product,
    topReview,
    likeReview,
    unlikeReview,
    likeReply,
    unlikeReply
  } = props;

  const [alertDialog, setAlertDialog] = useState(false);

  const onViewMore = () => {
    navigation.navigate('ProductEvaluation', { product });
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

  const handleOnPress = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      if (product && product.isReviewable) {
        onPress();
      } else {
        setAlertDialog(true);
      }
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const closeDialog = () => {
    setAlertDialog(false);
  };

  const [containerStyle] = React.useState({
    ...styles.evaluation_container,
    ...style
  });

  return (
    <View style={containerStyle}>
      <SectionTitle
        title="Đánh giá & Nhận xét"
        subTitle={!(product && product.productRate && product.productRate.numberTotal !== 0) ? 'Hiện chưa có nhận xét nào cho sản phẩm' : ''}
        style={internalStyles.title}
      >
        <ImageButton
          style={internalStyles.edit_button}
          source={icEdit}
          onPress={handleOnPress}
        />
      </SectionTitle>
      <EvaluationContent
        navigation={navigation}
        product={product}
        reviews={topReview}
        likeReivew={handleLikeReview}
        unlikeReview={handleUnlikeReview}
        likeReply={handleLikeReply}
        unlikeReply={handleUnlikeReply}
      />
      {(product && product.productRate && product.productRate.numberTotal > 10) && (
      <TextButton
        style={internalStyles.send_button}
        titleStyle={internalStyles.send_button_title}
        title="XEM TẤT CẢ"
        onPress={onViewMore}
      />
      )}
      <Separator />
      <WAAlert
        show={alertDialog}
        title="iSalon"
        question="Vui lòng mua sản phẩm để thực hiện chức năng này :)"
        titleFirst
        yes={closeDialog}
        no={false}
        yesTitle="Đóng"
      />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  title: {
    backgroundColor: 'white',
  },
  edit_button: {
    width: 30, height: 30
  },
  send_button: {
    height: 40,
    width: 100,
    // backgroundColor: Colors.tintColor,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  send_button_title: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: Colors.tintColor
  },
});

export default connect(
  () => ({
    // map state to props
  }), {
    likeReview: likeReviewAction,
    unlikeReview: unlikeReviewAction,
    likeReply: likeReplyAction,
    unlikeReply: unlikeReplyAction,
  }
)(memo(Evaluation));

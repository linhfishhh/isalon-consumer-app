import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';
import Entypo from 'react-native-vector-icons/Entypo';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Space from '../../components/Space';
import Separator from '../../components/Separator';
import { RateView } from '../../components/RateAmountView';
// import Img from '../../components/Img';
import ImageButton from '../../components/ImageButton';
import { VectorIconButton } from '../../components/Button';
import {
  // getImageUrl,
  getThumbImageUrl,
  datetimeFormat
} from '../../utils';


// const reportOptions = ['Không hữu ích', 'Báo cáo lạm dụng', 'Đóng'];

export default function EvaluationMessage(props) {
  const {
    message,
    likeReivew,
    unlikeReview,
    likeReply,
    unlikeReply,
    isLast,
    onPreviewImage
  } = props;
  // const reportActionSheetRef = React.useRef(null);

  // const showReportActionSheet = () => {
  //   reportActionSheetRef.current.show();
  // };

  // const onReportPress = (index) => {

  // };

  const handleLikeAndUnlikeReview = (review) => {
    if (review.isLiked) {
      unlikeReview(review.productReviewId);
    } else {
      likeReivew(review.productReviewId);
    }
  };

  const handleLikeAndUnlikeReply = (reply) => {
    if (reply.isLiked) {
      unlikeReply(reply.productReviewMessageId);
    } else {
      likeReply(reply.productReviewMessageId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.subject}>{message.title}</Text>
        <Text style={styles.time}>{datetimeFormat(message.createdAt, 'DD-MM-YYYY')}</Text>
      </View>
      <View style={styles.row}>
        <RateView rate={message.rate} size={16} />
        <Text style={styles.bought_text}>Đã mua hàng</Text>
        <Space />
        <Text style={styles.author_text}>{`Bởi ${message.profile.fullName}`}</Text>
      </View>
      <Text style={styles.message}>{message.comment}</Text>
      {(message.collection && message.collection.images) ? (
        <ScrollView
          style={styles.images_container}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {
          message.collection.images.map((img) => (
            <ImageButton
              key={img.imageId}
              style={styles.image}
              source={{ uri: getThumbImageUrl(img.imageId) }}
              resizeMode="cover"
              onPress={() => onPreviewImage(message.collection.images)}
            />
          ))
        }
        </ScrollView>
      ) : null}
      <View style={styles.row}>
        <Space />
        <VectorIconButton
          size={17}
          style={styles.like_image}
          name="thumb-up"
          color={message.isLiked ? '#E84B7D' : '#969696'}
          onPress={() => handleLikeAndUnlikeReview(message)}
        />
        <Text style={styles.message}>{message.numLikes}</Text>
        {/* <VectorIconButton
          size={30, 20}
          style={styles.more_menu}
          name="more-horiz"
          color="#969696"
          onPress={showReportActionSheet}
        /> */}
      </View>
      {
        message.productReviewMessage
          ? (
            <View style={styles.answer_container}>
              <View style={styles.row}>
                <Entypo size={25} name="dot-single" color={Colors.tintColor} />
                <Text style={styles.reply_subject}>
                  {`Phản hồi từ nhà bán hàng - ${datetimeFormat(message.productReviewMessage.createdAt, 'DD-MM-YYYY')}`}
                </Text>
                <Space />
              </View>
              <Text style={styles.reply_message}>{message.productReviewMessage.message}</Text>
              <View style={styles.row}>
                <VectorIconButton
                  size={17}
                  style={styles.like_image}
                  name="thumb-up"
                  color={message.productReviewMessage.isLiked > 0 ? '#E84B7D' : '#969696'}
                  onPress={() => handleLikeAndUnlikeReply(message.productReviewMessage)}
                />
                <Text style={styles.message}>{message.productReviewMessage.numLikes}</Text>
                <Space />
              </View>
            </View>
          ) : null
      }

      {!isLast && (<Separator height={1} />)}
      {/* <ActionSheet
        ref={reportActionSheetRef}
        options={reportOptions}
        onPress={onReportPress}
        cancelButtonIndex={2}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
  subject: {
    ...Layout.font.bold,
    fontSize: 18,
    color: Colors.itemTextColor,
    maxWidth: Layout.window.width - 150,
  },
  time: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.subSectionTextColor,
    maxWidth: 100,
  },
  bought_text: {
    ...Layout.font.medium,
    fontSize: 15,
    color: Colors.cyanColor,
  },
  author_text: {
    ...Layout.font.medium,
    fontSize: 12,
    color: Colors.itemTextColor,
  },
  message: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.itemTextColor,
    maxWidth: Layout.window.width - 50,
  },
  images_container: {
    width: Layout.window.width - 50,
    marginTop: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 3,
    backgroundColor: 'white',
    marginLeft: 2,
    marginRight: 2,
  },
  like_image: {
    width: 17,
    height: 15,
    marginRight: 5,
    marginLeft: 25,
  },
  more_menu: {
    width: 25,
    height: 8,
    marginLeft: 5,
  },
  answer_container: {
    backgroundColor: '#e4e4e4',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  reply_subject: {
    ...Layout.font.medium,
    fontSize: 12,
    color: Colors.itemTextColor,
    // maxWidth: Layout.window.width - 100,
  },
  reply_message: {
    ...Layout.font.normal,
    fontSize: 12,
    color: Colors.itemTextColor,
    maxWidth: Layout.window.width - 90,
    marginLeft: 25,
  },
});

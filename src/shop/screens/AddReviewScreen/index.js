import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import RateInput from '../../components/RateInput';
import UploadImagePicker from '../../components/UploadImagePicker';
import TextButton from '../../components/TextButton';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import { CommonStyles } from '../../constants';
import WAAlert from '../../../components/WAAlert';

import {
  addReview as addReviewAction,
} from '../../redux/reviewsProduct/actions';
import {
  updateReviewable as updateReviewableAction,
} from '../../redux/product/actions';


function AddReviewScreen(props) {
  const { navigation, addReview, updateReviewable } = props;

  const [validateMessage, setValidateMessage] = useState('');
  const [progress, setProgress] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const [rate, setRate] = useState(0);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const product = navigation.getParam('product');

  const goBack = useCallback(() => {
    navigation.goBack();
    setSuccessDialog(false);
  }, []);

  const validateReview = (payload) => {
    if (_.isEmpty(payload, 'rate') || payload.rate === 0) {
      setValidateMessage('Bạn chưa đánh giá');
      return false;
    } if (_.isEmpty(payload, 'title') || payload.title.length <= 0) {
      setValidateMessage('Vui lòng nhập tiêu đề');
      return false;
    } if (_.isEmpty(payload, 'comment') || payload.comment.length <= 0) {
      setValidateMessage('Vui lòng nhập nhận xét của bạn');
      return false;
    } if (payload.comment.length <= 50) {
      setValidateMessage('Vui lòng nhập nhận xét của bạn (tối thiểu 50 ký tự)');
      return false;
    }
    return true;
  };

  const onAddPress = () => {
    const { productId } = product;
    if (productId) {
      const data = {
        productId,
        rate,
        images,
        title,
        comment
      };
      if (validateReview(data)) {
        setProgress(true);
        addReview(data, () => {
          setProgress(false);
          setSuccessDialog(true);
          updateReviewable(false);
        });
      }
    }
  };

  const clearErrors = () => {
    setValidateMessage('');
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
      <Spinner
        visible={progress}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.tintColor} size={10} count={3} />}
      />
      <NavigationBar
        title="Viết nhận xét"
        closeButtonName="close"
        onClose={goBack}
      />

      <ScrollView style={internalStyles.content}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{ flex: 1 }}
        >
          <View style={internalStyles.rate_container}>
            <Text style={internalStyles.rate_title}>Đánh giá của bạn</Text>
            <RateInput padding={20} size={35} onChange={setRate} />
            <Text style={internalStyles.rate_comment}>{!rate ? 'Bạn chưa đánh giá' : ''}</Text>
          </View>
          <View style={internalStyles.upload_container}>
            <Text style={internalStyles.upload_title}>Hình ảnh đính kèm</Text>
            <UploadImagePicker onChange={setImages} maxFiles={10} />
            <Text style={internalStyles.upload_comment}>Thêm hình ảnh sản phẩm nếu bạn muốn</Text>
          </View>
          <TextInput
            style={internalStyles.title_input}
            placeholder="Tiêu đề (bắt buộc)"
            value={title}
            onChangeText={setTitle}
            maxLength={256}
          />
          <TextInput
            style={internalStyles.content_input}
            placeholder="Nhập nội dung nhận xét ở đây (tối thiểu 50 ký tự)"
            multiline
            value={comment}
            onChangeText={setComment}
            maxLength={4000}
          />
          <Text style={internalStyles.text_length}>{`${comment.length}/4000`}</Text>
          <TextButton
            style={internalStyles.send_button}
            titleStyle={internalStyles.send_button_title}
            title="GỬI"
            onPress={onAddPress}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <WAAlert
        show={!_.isEmpty(validateMessage)}
        title="iSalon"
        question={validateMessage}
        titleFirst
        yes={clearErrors}
        no={false}
        yesTitle="Đóng"
      />
      <WAAlert
        show={successDialog}
        title="iSalon"
        question="Cám ơn bạn đã đánh giá về sản phẩm, chúc bạn một ngày vui vẻ :)"
        titleFirst
        yes={goBack}
        no={false}
        yesTitle="Đóng"
      />
    </MainContainer>
  );
}

export default connect(
  () => ({}),
  {
    addReview: addReviewAction,
    updateReviewable: updateReviewableAction
  }
)(AddReviewScreen);


const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
    padding: 20,
  },
  close_button: {
    width: 20, height: 20,
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    marginLeft: 10,
    color: Colors.itemTextColor,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
  },
  rate_container: {
    marginTop: 35,
    height: 160,
    backgroundColor: Colors.modalBackground,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rate_title: {
    ...Layout.font.normal,
    fontSize: Layout.largeFontSize,
    marginBottom: 20,
    color: Colors.subSectionTextColor,
  },
  rate_comment: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    marginTop: 20,
    color: Colors.subSectionTextColor,
  },
  upload_container: {
    height: 200,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upload_title: {
    ...Layout.font.normal,
    fontSize: Layout.titleFontSize,
    marginBottom: 20,
    color: Colors.itemTextColor,
  },
  upload_comment: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    marginTop: 20,
    color: Colors.subSectionTextColor,
  },
  title_input: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    height: 50,
    backgroundColor: 'white',
    marginTop: 3,
    paddingLeft: 25,
    paddingRight: 25,
    color: Colors.itemTextColor,
  },
  content_input: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    minHeight: 60,
    backgroundColor: 'white',
    marginTop: 3,
    paddingLeft: 25,
    paddingRight: 25,
    color: Colors.itemTextColor,
    paddingVertical: 5
  },
  send_button: {
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20,
    marginTop: 20,
    height: 40,
    width: Layout.window.width - 50,
    backgroundColor: '#f05d3e',
  },
  send_button_title: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: 'white'
  },
  text_length: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 5,
    color: '#f05d3e',
  }
});

import React, { useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TextInput,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TextButton from '../../components/TextButton';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import Separator from '../../components/Separator';
import FAQContent from './FAQContent';
import Img from '../../components/Img';
import { CommonStyles } from '../../constants';
import icEmptyQuestion from '../../../assets/images/shop/ic_empty_question.png';
import WAAlert from '../../../components/WAAlert';

import {
  getAllFAQ as getAllFAQAction,
  addFAQ as addFAQAction
} from '../../redux/FAQProduct/actions';


const emptyMessage = 'Chưa có câu hỏi cho sản phẩm này. Đặt câu hỏi cho nhà bán hàng và câu trả lời sẽ được hiển thị tại đây';

function ProductFAQ(props) {
  const {
    navigation,
    getFAQList,
    faqList,
    paging,
    addFAQ
  } = props;

  const product = navigation.getParam('product');
  const [progress, setProgress] = useState(false);
  const [question, setQuestion] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);

  const onLoadmore = () => {
    if (!paging.last && product) {
      getFAQList(product.productId, false, paging.pageable.pageNumber + 1);
    }
  };

  const handleAddFAQ = () => {
    const { productId } = product;
    if (productId && question.length > 0) {
      setProgress(true);
      const data = { productId, question };
      addFAQ(data, () => {
        setProgress(false);
        setSuccessDialog(true);
        setQuestion('');
      });
    }
    Keyboard.dismiss();
  };

  const goBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const closeDialog = () => {
    setSuccessDialog(false);
  };

  return (
    <MainContainer hasNavigationBackground={false} style={CommonStyles.main_container_white}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title="Hỏi đáp về sản phẩm"
        closeButtonName="close"
        onClose={goBack}
      />
      <Spinner
        visible={progress}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.tintColor} size={10} count={3} />}
      />
      {
        faqList.length > 0 ? <FAQContent messages={faqList} onLoadmore={onLoadmore} />
          : (
            <View style={internalStyles.empty_question_list_container}>
              <Img style={internalStyles.empty_question_mark} source={icEmptyQuestion} />
              <Text style={internalStyles.empty_question_message}>{emptyMessage}</Text>
            </View>
          )
      }
      <Separator height={0.5} />
      <View style={internalStyles.send_container}>
        <TextInput
          style={internalStyles.send_input}
          placeholder="Viết câu hỏi của bạn ở đây"
          maxLength={4000}
          value={question}
          onChangeText={setQuestion}
        />
        <TextButton
          disabled={question.length === 0}
          style={internalStyles.send_button}
          titleStyle={internalStyles.send_button_title}
          title="GỬI"
          onPress={handleAddFAQ}
        />
      </View>
      <WAAlert
        show={successDialog}
        title="iSalon"
        question="Cám ơn bạn đã đặt câu hỏi về sản phẩm, chúng tôi sẽ trả lời bạn trong thời gian sớm nhất. :)"
        titleFirst
        yes={closeDialog}
        no={false}
        yesTitle="Đóng"
      />
    </MainContainer>
  );
}

const internalStyles = StyleSheet.create({
  bottom_bar: {
    flexDirection: 'column',
    height: 61,
  },
  send_container: {
    minHeight: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  send_input: {
    ...Layout.font.normal,
    // backgroundColor: Colors.modalBackground,
    minHeight: 40,
    // width: Layout.window.width - 120,
    borderRadius: 3,
    marginLeft: 25,
    marginRight: 20,
    flex: 1,
  },
  send_button: {
    marginRight: 25,
    height: 40,
    width: 50,
    backgroundColor: '#f05d3e',
  },
  send_button_title: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: 'white'
  },
  empty_question_list_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 100,
  },
  empty_question_mark: {
    width: 77, height: 82,
  },
  empty_question_message: {
    ...Layout.font.normal,
    color: Colors.subSectionTextColor,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    textAlign: 'center',
  },
});


export default connect(
  (state) => ({
    faqList: state.shopFAQ.faqList,
    paging: state.shopFAQ.paging,
  }), {
    getFAQList: getAllFAQAction,
    addFAQ: addFAQAction
  }
)(ProductFAQ);

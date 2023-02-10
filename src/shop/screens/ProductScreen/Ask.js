import React, { memo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';
import styles from './styles';
import SectionTitle from '../../components/SectionTitle';
import TextButton from '../../components/TextButton';
import icEdit from '../../../assets/images/shop/ic_edit_button.png';

import NavigationService from '../../../NavigationService';
import { isAuthenticated } from '../../utils/auth';
import FAQContent from '../ProductFAQ/FAQContent';

function Ask(props) {
  const {
    style,
    onPress,
    product,
    navigation,
    topFAQ,
  } = props;

  const onViewMore = () => {
    navigation.navigate('ProductFAQ', { product });
  };

  const handleOnPress = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      onPress();
    } else {
      NavigationService.navigate('new_login', { hasBack: true });
    }
  };

  const [containerStyle] = React.useState({
    ...styles.ask_container,
    ...style
  });

  return (
    <View style={containerStyle}>
      <SectionTitle
        title="Hỏi đáp về sản phẩm"
        subTitle={topFAQ.faqList.length === 0 ? 'Hiện chưa có câu hỏi nào cho sản phẩm' : ''}
        style={internalStyles.title}
      >
        <ImageButton
          style={internalStyles.edit_button}
          source={icEdit}
          onPress={handleOnPress}
        />
      </SectionTitle>
      <FAQContent
        navigation={navigation}
        product={product}
        messages={topFAQ.faqList.slice(0, 10)}
      />
      {topFAQ.paging.totalElements > 10 && (
      <TextButton
        style={internalStyles.send_button}
        titleStyle={internalStyles.send_button_title}
        title="XEM TẤT CẢ"
        onPress={onViewMore}
      />
      )}
    </View>
  );
}

const internalStyles = StyleSheet.create({
  title: {
    backgroundColor: 'white'
  },
  edit_button: {
    width: 30, height: 30
  },
  send_button: {
    height: 40,
    width: 100,
    // backgroundColor: Colors.tintColor,
    alignSelf: 'center',
    marginBottom: 15,
  },
  send_button_title: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: Colors.tintColor,
  },
});

export default memo(Ask);

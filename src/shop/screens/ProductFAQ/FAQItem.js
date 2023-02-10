import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Img from '../../components/Img';
import Separator from '../../components/Separator';

import { datetimeFormat } from '../../utils';

type Props = {
  item: Object,
};

const askIcon = require('../../../assets/images/shop/ic_faq_ask.png');
const answerIcon = require('../../../assets/images/shop/ic_faq_answer.png');

export default function FAQItem({ item, isLast }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Img style={styles.icon} source={askIcon} />
        <View style={styles.content}>
          <Text style={styles.message}>{item.question}</Text>
          <Text style={styles.askAuthor}>
            <Text style={styles.creater}>Bởi</Text>
            {` ${item.questionProfile.fullName} | `}
            <Text style={styles.createdAt}>{datetimeFormat(item.createdAt, 'DD-MM-YYYY')}</Text>
          </Text>
        </View>
      </View>
      {item.answerProfileId !== undefined && (
        <View style={styles.item}>
          <Img style={styles.icon} source={answerIcon} />
          <View style={styles.content}>
            <Text style={styles.message}>{item.answer}</Text>
            <Text style={styles.answerAuthor}>
              {`iSalon trả lời vào ${datetimeFormat(item.answerAt, 'DD-MM-YYYY')}`}

            </Text>
          </View>
        </View>
      )}
      {!isLast && (<Separator height={1} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 15
  },
  item: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  icon: {
    width: 24, height: 26,
  },
  content: {
    flexDirection: 'column',
    marginLeft: 10,
    width: Layout.window.width - 85,
  },
  message: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor,
  },
  creater: {
    fontWeight: 'normal'
  },
  askAuthor: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.cyanColor,
    fontWeight: 'bold'
  },
  createdAt: {
    color: Colors.itemTextColor,
    fontWeight: 'normal'
  },
  answerAuthor: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.answerAuthorColor,
  }
});

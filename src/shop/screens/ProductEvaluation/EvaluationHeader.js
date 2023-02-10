import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { times } from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TextButton from '../../components/TextButton';
import { RateView } from '../../components/RateAmountView';
import LevelBar from '../../components/LevelBar';

export default function EvaluationHeader(props) {
  const { navigation, product } = props;

  const { productRate } = product;

  const onWriteCommentPress = () => {
    navigation.push('AddReviewScreen', { product });
  };

  const percentRate = (total, rate) => ((rate / total) * 100).toFixed(0);

  return (
    <View style={internalStyles.container}>
      {productRate && productRate.numberTotal !== 0 && (
        <>
          <View style={internalStyles.evaluation_info_container}>
            <View style={internalStyles.summary_container}>
              <Text style={internalStyles.score_text}>{`${productRate ? productRate.rate.toFixed(1) : 0}/5`}</Text>
              <RateView rate={productRate ? productRate.rate : 0} size={16} />
              <Text style={internalStyles.info_text}>{`${productRate ? productRate.numberTotal : 0} nhận xét`}</Text>
            </View>
            <View style={internalStyles.separator} />
            <View style={internalStyles.detail_container}>
              {
            times(5, (index) => (
              <View style={internalStyles.rate_input_container} key={index}>
                <RateView rate={5 - index} />
                <LevelBar
                  style={internalStyles.rate_percent}
                  tintColor="#A6A8AB"
                  trackColor="#D0D2D3"
                  percent={`${productRate ? percentRate(productRate.numberTotal, productRate[`numberRate${5 - index}`]) : 0}%`}
                />
                <Text style={internalStyles.rate_info_text}>{`${productRate ? percentRate(productRate.numberTotal, productRate[`numberRate${5 - index}`]) : 0}%`}</Text>
              </View>
            ))
          }
            </View>
          </View>
          {(product && product.isReviewable) && (
          <TextButton
            style={internalStyles.write_cmt_btn}
            titleStyle={internalStyles.write_cmt_btn_title}
            title="VIẾT NHẬN XÉT"
            onPress={onWriteCommentPress}
          />
          )}
        </>
      )}
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  write_cmt_btn: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 15,
    height: 40,
    backgroundColor: Colors.cyanColor,
  },
  write_cmt_btn_title: {
    ...Layout.font.bold,
    fontSize: 18,
    color: 'white',
  },
  evaluation_info_container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summary_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  detail_container: {
    flexDirection: 'column',
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.separatorColor,
  },
  score_text: {
    ...Layout.font.normal,
    fontSize: 42,
    color: Colors.itemTextColor
  },
  info_text: {
    ...Layout.font.normal,
    fontSize: 16,
    color: Colors.itemTextColor,
    marginTop: 6,
  },
  rate_info_text: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.itemTextColor,
  },
  rate_input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rate_percent: {
    height: 3,
    width: 100,
    marginLeft: 0,
    marginRight: 8,
  }
});
